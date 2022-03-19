package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/wojtek/mashroom/types"
)

var svc *dynamodb.DynamoDB
var s3Client *s3.S3
var s3m *s3manager.Downloader

func init() {
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(endpoints.EuWest1RegionID),
		Credentials: credentials.NewSharedCredentials("", "wpuser"),
	})

	if err != nil {
		fmt.Println(err)
	}

	svc = dynamodb.New(sess)
	s3Client = s3.New(sess)
	s3m = s3manager.NewDownloader(sess)
}

func getAllMaterials() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Example iterating over at most 3 pages of a Scan operation.
		pageNum := 0
		var dbItems []map[string]*dynamodb.AttributeValue
		now := time.Now()

		err := svc.ScanPages(&dynamodb.ScanInput{TableName: aws.String("inventory")},
			func(page *dynamodb.ScanOutput, lastPage bool) bool {
				pageNum++
				dbItems = append(dbItems, page.Items...)
				return pageNum <= 3
			})
		fmt.Printf("scan took: %s \n", time.Since(now))

		if err != nil {
			fmt.Println(err)
		}
		var materials []types.Material
		now = time.Now()

		for _, item := range dbItems {
			material, err := unmarshalItem(item, false)

			if err != nil {
				fmt.Println(err)
				w.Write([]byte(err.Error()))
				return
			}

			materials = append(materials, *material)
		}

		js, err := json.Marshal(materials)

		fmt.Printf("marshaling took took: %s \n", time.Since(now))
		if err != nil {
			fmt.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Write(js)
	}
}

func saveMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		buf := new(bytes.Buffer)
		buf.ReadFrom(r.Body)

		material := &types.Material{}
		err := json.Unmarshal(buf.Bytes(), material)
		if err != nil {
			fmt.Println(err)
		}

		if material.Id == "" {
			out, err := exec.Command("uuidgen").Output()
			if err != nil {
				fmt.Println(err)
			}

			material.Id = strings.TrimSpace(string(out))
			material.DateAdded = time.Now().Format("02/01/2006")
			material.Version = 1
		}

		if material.RawPics != nil && len(material.RawPics) > 0 {
			rawPic := material.RawPics[0]

			picAsStr := strings.TrimPrefix(rawPic.Pic, "data:image/jpeg;base64,")
			imageData, err := base64.StdEncoding.DecodeString(picAsStr)
			if err != nil {
				fmt.Println(err)
			}

			//temp file
			ioutil.WriteFile(material.Id+".jpg", imageData, 0644)
		}

		for k, v := range material.RawPics {
			reader := strings.NewReader(v.Pic)

			var key bytes.Buffer
			key.WriteString(material.Id)
			key.WriteString("/")
			key.WriteString(strconv.Itoa(k))

			s3Input := &s3.PutObjectInput{Body: reader,
				Bucket: aws.String("limetka-storage"),
				Key:    aws.String(key.String())}

			s3Output, err := s3Client.PutObject(s3Input)
			if err != nil {
				fmt.Println(err)
			}

			fmt.Println(s3Output.String())
		}

		// resize
		cmd := exec.Command("convert", material.Id+".jpg", "-resize", "100x100", material.Id+"-resized.jpg")
		var out bytes.Buffer
		cmd.Stdout = &out
		err = cmd.Run()

		if err != nil {
			fmt.Println("Error with iamge")
			fmt.Println(err)
		}

		thumbnail, err := ioutil.ReadFile(material.Id + "-resized.jpg")

		if err != nil {
			fmt.Println("image will be missing")
			thumbnail = []byte("hello")
		}

		var colors, themes []*string

		for _, v := range material.SelectedColors {
			var color = v.Name
			colors = append(colors, &color)
		}

		for _, v := range material.SelectedThemes {
			var theme = v.Name
			themes = append(themes, &theme)
		}

		input := &dynamodb.PutItemInput{
			Item: map[string]*dynamodb.AttributeValue{
				"id": {
					S: aws.String(material.Id),
				},
				"dateAdded": {
					S: aws.String(material.DateAdded),
				},
				"name": {
					S: aws.String(material.Name),
				},
				"materialType": {
					S: aws.String(string(material.MaterialType)),
				},
				"length": {
					S: aws.String(strconv.Itoa(material.Length)),
				},
				"width": {
					S: aws.String(strconv.Itoa(material.Width)),
				},
				"height": {
					S: aws.String(strconv.Itoa(material.Height)),
				},
				"weight": {
					S: aws.String(strconv.Itoa(material.Weight)),
				},
				"quantity": {
					S: aws.String(strconv.Itoa(material.Quantity)),
				},
				"colors": {
					SS: colors,
				},
				"themes": {
					SS: themes,
				},
				"cost": {
					S: aws.String(strconv.Itoa(material.Cost)),
				},
				"thumbnail": {
					B: thumbnail,
				},
			},
			ReturnConsumedCapacity: aws.String("TOTAL"),
			TableName:              aws.String("inventory"),
		}

		if res, err := svc.PutItem(input); err != nil {
			fmt.Println(err)
		} else {
			fmt.Println(res)
		}

		w.WriteHeader(http.StatusOK)
	}
}

func getFromS3(id string) []types.RawPicture {
	var pics []types.RawPicture

	output, err := s3Client.ListObjects(&s3.ListObjectsInput{Bucket: aws.String("limetka-storage"), Prefix: aws.String(id)})
	if err != nil {
		fmt.Println(err)
	}

	for _, v := range output.Contents {
		buffer := &aws.WriteAtBuffer{}

		_, err := s3m.Download(buffer,
			&s3.GetObjectInput{
				Bucket: aws.String("limetka-storage"),
				Key:    v.Key,
			})

		if err != nil {
			fmt.Println(err)
		}

		pics = append(pics, types.RawPicture{Pic: string(buffer.Bytes())})
	}

	return pics
}

func unmarshalItem(item map[string]*dynamodb.AttributeValue, withImages bool) (*types.Material, error) {
	var selectedColors, selectedThemes []types.VFD

	if item["colors"] != nil {
		for _, v := range item["colors"].SS {
			selectedColors = append(selectedColors, types.VFD{Name: *v, Id: *v})
		}
	}

	if item["themes"] != nil {
		for _, v := range item["themes"].SS {
			selectedThemes = append(selectedThemes, types.VFD{Name: *v, Id: *v})
		}
	}

	length, err := strconv.Atoi(*item["length"].S)
	if err != nil {
		fmt.Println(err)
	}
	width, err := strconv.Atoi(*item["width"].S)
	if err != nil {
		fmt.Println(err)
	}
	height, err := strconv.Atoi(*item["height"].S)
	if err != nil {
		fmt.Println(err)
	}
	weight, err := strconv.Atoi(*item["weight"].S)
	if err != nil {
		fmt.Println(err)
	}
	quantity, err := strconv.Atoi(*item["quantity"].S)
	if err != nil {
		fmt.Println(err)
	}
	cost, err := strconv.Atoi(*item["cost"].S)
	if err != nil {
		fmt.Println(err)
	}

	thumbnail := item["thumbnail"].B
	if err != nil {
		fmt.Println(err)
	}

	material := &types.Material{
		Id:             *item["id"].S,
		DateAdded:      *item["dateAdded"].S,
		SelectedColors: selectedColors,
		SelectedThemes: selectedThemes,
		Name:           *item["name"].S,
		MaterialType:   types.MaterialType(*item["materialType"].S),
		Length:         length,
		Width:          width,
		Height:         height,
		Weight:         weight,
		Quantity:       quantity,
		Cost:           cost,
		Version:        1,
		ThumbNail:      thumbnail,
	}

	if withImages {
		material.RawPics = getFromS3(*item["id"].S)
	}

	return material, nil
}

func getMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")

		getItemInput := &dynamodb.GetItemInput{
			Key: map[string]*dynamodb.AttributeValue{
				"id": {
					S: aws.String(id),
				},
			},
			ReturnConsumedCapacity: aws.String("TOTAL"),
			TableName:              aws.String("inventory"),
		}

		res, err := svc.GetItem(getItemInput)
		if err != nil {
			fmt.Println(err)
			w.Write([]byte(err.Error()))
			return
		}

		material, err := unmarshalItem(res.Item, true)

		if err != nil {
			fmt.Println(err)
			w.Write([]byte(err.Error()))
			return
		}

		json, err := json.Marshal(material)

		if err != nil {
			fmt.Println(err)
			w.Write([]byte(err.Error()))
			return
		}

		w.Write(json)
	}
}

func corsHandler(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if r.Method == "OPTIONS" {
			w.Header().Add("Connection", "keep-alive")
			w.Header().Add("Access-Control-Allow-Origin", origin)
			w.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PUT")
			w.Header().Add("Access-Control-Allow-Headers", "content-type")
			w.Header().Add("Access-Control-Max-Age", "86400")
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", origin)
			h.ServeHTTP(w, r)
		}
	}
}

func getConstants() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := json.Marshal(types.New())

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Write(c)
	}
}

func main() {
	http.HandleFunc("/getAllMaterials", corsHandler(getAllMaterials()))
	http.HandleFunc("/getConstants", corsHandler(getConstants()))

	http.HandleFunc("/saveMaterial", corsHandler(saveMaterial()))
	http.HandleFunc("/getMaterial", corsHandler(getMaterial()))

	if err := http.ListenAndServe(":3001", nil); err != nil {
		os.Exit(123)
		fmt.Println(err)
	}
}
