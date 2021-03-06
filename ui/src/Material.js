import React from 'react';
import ImageUploading from 'react-images-uploading';
import Multiselect from 'multiselect-react-dropdown';

class Material extends React.Component {
  mode = this.props.match.params.mode
  id = this.props.match.params.id
  date = ""

  constructor(props) {
    super(props);

    let date = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    }).format(new Date())

    this.state = {
      error: null,
      isLoaded: false,
      id: "",
      name: "",
      quantity: "0",
      length: "0",
      width: "0",
      height: "0",
      weight: "0",
      cost: "0",
      addedOn: date,
      purchasedOn: "",
      //for iamges
      maxNumber: "5",
      rawpics: [],
      materialType: "",
      selectedColors: [],
      selectedThemes: [],
      //constants
      types: [],
      themes: [],
      colors: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:3001/getConstants", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Request-Headers': 'http://localhost:3001'
      }
    }).then(response => response.json())
      .then(
        (result) => {
          this.setState({
            themes: result['themes'],
            types: result['materialTypes'],
            colors: result['colors'],
            isLoaded: true,
          });

        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      )

    if (this.mode === "view" || this.mode === "edit") {
      fetch("http://localhost:3001/getMaterial?id=" + this.id, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Request-Headers': 'http://localhost:3001'
        }
      }).then(res => res.json())
        .then((res) => {
          this.setState({
            isLoaded: true,
            id: res['id'],
            name: res['name'],
            width: res['width'],
            height: res['height'],
            weight: res['weight'],
            length: res['length'],
            quantity: res['quantity'],
            cost: res['cost'],
            addedOn: res['addedOn'],
            purchasedOn: res['data.purchasedOn'],
            materialType: res['materialType'],
            selectedColors: res['selectedColors'],
            selectedThemes: res['selectedThemes'],
            rawpics: res['rawpics']
          });
        });

    } else if (this.mode === "add") {
      console.info("Will add: " + this.id)
    } else if (this.mode === "delete") {
      console.info("Will delete: " + this.id)
    } else {
      console.error("Invalid mode: " + this.mode)
    }
  }

  back() {
    this.props.history.push("/materials");
  }

  save() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    };
    fetch('http://localhost:3001/saveMaterial', requestOptions)
      .then(async response => {
        // const isJson = response.headers.get('content-type')?.includes('application/json');
        // const data = isJson && await response.json();
        // console.log("saving result: ", data)

        if (!response.ok) {
          // get error message from body or default to response status
          const error = response.status;
          return Promise.reject(error);
        }

        this.props.history.push("/materials");
      })
      .catch(error => {
        this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
      });
  }

  titleBar(name) {
    return (<div className="wrapper">
      <div className='page-type'>
        <label className='page-type-label'>{name}</label>
      </div>

      <div className='navigation-buttons-div'>
        {this.mode === "view" &&
          <>
            <button style={{float: 'right'}} type="button" onClick={event => window.location.href = '/material/edit/' + this.id}>Edit</button>
            <button style={{float: 'right'}} type="button" onClick={() => this.back()}>Back</button>
          </>
        }

        {this.mode === "add" &&
          <>
            <button style={{float: 'right'}} type="button" onClick={() => this.save()}>Save</button>
            <button style={{float: 'right'}} type="button" onClick={() => this.back()}>Back</button>
          </>
        }

        {this.mode === "edit" &&
          <>
            <button style={{float: 'right'}} type="button" onClick={() => this.save()}>Save</button>
            <button style={{float: 'right'}} type="button" onClick={() => this.back()}>Back</button>
          </>
        }
      </div>
    </div>)
  }

  getViewMode() {
    if (this.mode === "edit") {
      return "Update Material"
    } else if (this.mode === "view") {
      return "Details"
    } else if (this.mode === "add") {
      return "New Material"
    } else {
      return "no idea"
    }
  }

  disabled() {
    return this.mode === "view" ? true : false
  }

  render() {
    const { isLoaded } = this.state;

    const handleType = event => {
      const { name, value } = event.target;
      this.setState({ [name]: value })
    }

    const ImagePanel = () => (
        <ImageUploading
          multiple
          value={this.state.rawpics}
          onChange={(imageList, addUpdateIndex) => { this.setState({ rawpics: imageList }) }}
          maxNumber={this.state.maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className="upload__image-wrapper">
              <p className='properties-title'>Fotografie</p>
              <button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                disabled={this.disabled()}
                {...dragProps}
              >
                Click or Drop here
              </button>
              &nbsp;
              <button onClick={onImageRemoveAll} disabled={this.disabled()}>Remove all images</button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image['data_url']} alt="" width="100" />
                  <div className="image-item__btn-wrapper">

                    <button onClick={() => onImageUpdate(index)} disabled={this.disabled()}>Update</button>
                    <button onClick={() => onImageRemove(index)} disabled={this.disabled()}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
    );

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <div className="content">
        <div className='topbar-div'>
          {this.titleBar(this.getViewMode())}
          <div className="name-div">
            <label className='properties-title'>Name</label>
            <input name="name" value={this.state.name} select={this.state.name} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""} name-input`} />
          </div>

          
          <div id='units-div'>
            <div style={{width: '100%', height: '50px' }}>
              <p className='properties-sub-title'>Unit</p>
            </div>
            {/* TODO turn into sinlge choice multiselect */}
            <div style={{width: '100%', height: '50px'}}>
              <label style={{float: 'left' , width: '30%', 'text-align': 'left'}} htmlFor="materialType">Material Type</label>
              <select style={{float: 'left', width: '70%'}} name="materialType" id="materialType" value={this.state.materialType} onChange={handleType} disabled={this.disabled()}>
                <option value=""></option>
                {this.state.types.map((t =>
                  <option value={t.name} key={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            {/* this.setState({ errorMessage: error.toString() }); */}
            <div >
              <Multiselect disable={this.disabled()}
                options={this.state.themes}
                selectedValues={this.state.selectedThemes}
                onSelect={(selectedList, selectedItem) => { this.setState({ selectedThemes: selectedList }) }}
                onRemove={(selectedList, removedItem) => { this.setState({ selectedThemes: selectedList }) }}
                displayValue="name"
                placeholder="Types"
              />
            </div>

            <div>
              <Multiselect disable={this.disabled()}
                options={this.state.colors}
                selectedValues={this.state.selectedColors}
                onSelect={(selectedList, selectedItem) => { this.setState({ selectedColors: selectedList }) }}
                onRemove={(selectedList, removedItem) => { this.setState({ selectedColors: selectedList }) }}
                displayValue="name"
                placeholder="Colors"
              />
            </div>

            </div>  

        </div>

        <div className='container'>
          <div className='left'>
            <div className='properties-divs'>
              <p className='properties-title'>Properties</p>

              <p className='properties-sub-title '>Dimensions</p>
                <div className='general-font '>
                  <label htmlFor="width">Width</label>
                  <input name="width" value={this.state.width} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
                </div>

                <div className='general-font '>
                  <label htmlFor="height">Height</label>
                  <input name="height" value={this.state.height} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
                </div>

                <div className='general-font '> 
                  <label htmlFor="length">Length</label>
                  <input name="length" value={this.state.length} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
                </div>

                <div className='general-font '>
                  <label htmlFor="weight">Weight</label>
                  <input name="weight" value={this.state.weight} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
                </div>

              <p className='properties-sub-title'>Quantity</p>
                <div className='general-font '>
                  <label htmlFor="quantity">Quantity</label>
                  <input name="quantity" value={this.state.quantity} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
                </div>
            </div>

            <div className='costs-divs'>
              <p className='properties-title'>Costs</p>
              <div className='general-font '>
                <label htmlFor="addedOn">Added On</label>
                <input name="addedOn" value={this.state.addedOn} disabled />
              </div>
              <div className='general-font '>
                <label htmlFor="purchasedOn">Purchased On</label>
                <input name="purchasedOn" value={this.state.purchasedOn} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
              </div>

              <div className='general-font '>
                <label htmlFor="cost">Cost Per Meter</label>
                <input name="cost" value={this.state.cost} onChange={handleType} className={`${this.mode === "view" ? "viewmode" : ""}`} />
              </div>
            </div>
          </div>

          <ImagePanel />
        </div>

      </div>
    )
  }
}

export default Material

//https://reactjs.org/docs/forms.html#controlled-components
//https://www.educative.io/edpresso/how-to-pass-props-to-a-child-component-in-react
//https://blog.logrocket.com/the-beginners-guide-to-mastering-react-props-3f6f01fd7099/
//https://www.robinwieruch.de/react-pass-props-to-component



