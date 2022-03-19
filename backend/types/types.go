package types

//Unit is a unit
type Unit string

//MaterialType is useful
type MaterialType string

// type Color string
type Theme string

const (
	//TEXT is something
	TEXT Unit = "cm"
	//BINARY is something
	BINARY Unit = "m"

	//COTTON is soft
	BAVLNA      MaterialType = "bavlna"
	DECORATIVNI MaterialType = "decorativni"
	ODEVNI      MaterialType = "odevni"
	ZAPINANI    MaterialType = "zapinani"
	STUHY       MaterialType = "stuhy"
	VLNA        MaterialType = "vlna"

	// RED   Color = "red"
	// GREEN Color = "green"
	// BLACK Color = "black"

	// BAW       Theme = "Black and white"
	// GEOMETRIE Theme = "Geometrie"
	// TROPICAL  Theme = "Tropical"
)

// MaterialDimensions
type MaterialDimensions struct {
	Length int `json:"length,string"`
	Width  int `json:"width,string"`
	Height int `json:"height,string"`
	Weight int `json:"weight,string"`
}

type Item struct {
	Id   string `json:"id"`
	Data []byte `json:"data"`
}

type Constants struct {
	MaterialTypes []VFD `json:"materialTypes"`
	Themes        []VFD `json:"themes"`
	Colors        []VFD `json:"colors"`
}

type RawPicture struct {
	Pic string `json:"data_url"`
}

//ValueForDropDown
type VFD struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

type Material struct {
	// added by the backend
	Id      string `json:"id"`
	Version int

	// from the UI
	Name string `json:"name"`

	Length   int `json:"length,string"`
	Width    int `json:"width,string"`
	Height   int `json:"height,string"`
	Weight   int `json:"weight,string"`
	Quantity int `json:"quantity,string"`

	RawPics   []RawPicture `json:"rawpics,omitempty"`
	ThumbNail []byte       `json:"thumbnail"`

	MaterialType   MaterialType `json:"materialType"`
	SelectedThemes []VFD        `json:"selectedThemes"`
	SelectedColors []VFD        `json:"selectedColors"`

	DateAdded   string `json:"addedOn,omitempty"`
	PurchasedOn string `json:"purchasedOn"`
	Cost        int    `json:"cost,string"`
}

// func (o *Color) UnmarshalText(b []byte) error {
// 	str := strings.Trim(string(b), `"`)

// 	switch str {
// 	case string(RED), string(GREEN):
// 		*o = Color(str)

// 	default:
// 		*o = "n/a"
// 		// or return an error...
// 	}

// 	return nil
// }

func New() *Constants {
	return &Constants{
		MaterialTypes: []VFD{
			{Name: "bavlna", Id: "bavlna"},
			{Name: "decorativni", Id: "decorativni"},
			{Name: "odevni", Id: "odevni"},
			{Name: "zapinani", Id: "zapinani"},
			{Name: "stuhy", Id: "stuhy"},
			{Name: "vlna", Id: "vlna"},
		},
		Themes: []VFD{
			{Name: "Black and white", Id: "Black and white"},
			{Name: "Geometrie", Id: "Geometrie"},
			{Name: "Tropical", Id: "Tropical"},
		},
		Colors: []VFD{
			{Name: "red", Id: "red"},
			{Name: "green", Id: "green"},
			{Name: "black", Id: "black"},
		},
	}
}
