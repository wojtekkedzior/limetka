import React from 'react';
import moment from 'moment'
import Multiselect from 'multiselect-react-dropdown';

class OverviewMaterials extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      cachedData: null,
      //sort type
      sortBy: null,
      //Filters
      selectedThemes: [],
      selectedTypes: [],
      selectedColors: [],
      //constants
      types: [],
      themes: [],
      colors: []
    };

    this.sort = this.sort.bind(this);
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
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            data: [],
            error,
          });
        }
      )

    fetch("http://localhost:3001/getAllMaterials", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Request-Headers': 'http://localhost:3001'
      }
    }).then(response => response.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            data: result,
            cachedData: result
          });
          console.log(result);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            data: [],
            error,
          });
        }
      )
  }

  sort(event) {
    this.setState({ sortBy: event.target.value })
    const data = this.state.data

    if (event.target.value === "newest") {
      data.sort(function (a, b) { return moment(a.addedOn, "DD/MM/YYYY").isBefore(moment(b.addedOn, "DD/MM/YYYY")) })
    } else if (event.target.value === "oldest") {
      data.sort(function (a, b) { return moment(a.addedOn, "DD/MM/YYYY").isAfter(moment(b.addedOn, "DD/MM/YYYY")) })
    } else if (event.target.value === "cheapest") {
      data.sort(function (a, b) { return parseInt(a.cost) > parseInt(b.cost) })
    } else if (event.target.value === "costliest") {
      data.sort(function (a, b) { return parseInt(a.cost) < parseInt(b.cost) })
    }
    this.setState({ data: data });
  }

  findMatch(filters, materialValues) {
    return filters.length === 0 ? true : materialValues.some(mv => {
      return filters.some(filter => {
        return filter.name === mv.name ? true : false
      })
    })
  }

  filter() {
    if (this.state.selectedThemes.length === 0 && this.state.selectedColors.length === 0 && this.state.selectedTypes.length === 0) {
      this.setState({ data: this.state.cachedData });
      return;
    }

    this.setState({
      data: this.state.cachedData.filter(material => {
        return this.state.selectedTypes.length === 0 ? true : this.state.selectedTypes.some(st => {
          return material.materialType === st.name ? true : false
        })
      }).filter(material => {
        return this.findMatch(this.state.selectedThemes, material.selectedThemes)
      }).filter(material => {
        return this.findMatch(this.state.selectedColors, material.selectedColors)
      })
    });
  }

  render() {
    const { isLoaded, data } = this.state;

    const TitleBar = () => (
      <div className="title-bar">
        <div className='title-label'>
          <label>Materials</label>
        </div>
        <div className='title-buttons'>
          <button type="button" style={{ float: 'right' }} onClick={() => this.props.history.push("/")}>Back</button>
          <button type="button" style={{ float: 'right' }} onClick={() => this.props.history.push("/material/add")}>New</button>
        </div>
      </div>
    );

    const FilterBar = () => {
      return (
        <div className='filters'>
          <div className='filters-div'>
            <label style={{ float: 'left' }}>Filters</label>
            <Multiselect
              id="multiSelect_overview"
              options={this.state.themes}
              selectedValues={this.state.selectedThemes}
              onSelect={(selectedList, selectedItem) => { this.setState({ selectedThemes: selectedList }, function () { this.filter(); }) }}
              onRemove={(selectedList, removedItem) => { this.setState({ selectedThemes: selectedList }, function () { this.filter(); }) }}
              displayValue="name"
              placeholder="Themes"
            />

            <Multiselect
            id="multiSelect_overview"
              options={this.state.types}
              selectedValues={this.state.selectedTypes}
              onSelect={(selectedList, selectedItem) => { this.setState({ selectedTypes: selectedList }, function () { this.filter(); }) }}
              onRemove={(selectedList, removedItem) => { this.setState({ selectedTypes: selectedList }, function () { this.filter(); }) }}
              displayValue="name"
              placeholder="Types"
            />

            <Multiselect
              id="multiSelect_overview"
              options={this.state.colors}
              selectedValues={this.state.selectedColors}
              onSelect={(selectedList, selectedItem) => { this.setState({ selectedColors: selectedList }, function () { this.filter(); }) }}
              onRemove={(selectedList, removedItem) => { this.setState({ selectedColors: selectedList }, function () { this.filter(); }) }}
              displayValue="name"
              placeholder="Colors"
            />
            {/* <div>
              <select name="sizeSelect">
                <option value="">Size</option>
                <option value="size-s">size-s</option>
                <option value="size-d">size-d</option>
                <option value="quantity">quantity</option>
              </select>
            </div> */}
          </div>

          <div className='sort-div'>
            <label style={{ float: 'left' }} >Sort</label>
            <input style={{ float: 'left' }} type="radio" id="newest" value="newest" name="g1" checked={this.state.sortBy === "newest"} onChange={this.sort}></input>
            <label style={{ float: 'left' }} htmlFor="newest">Newest</label>

            <input style={{ float: 'left' }} type="radio" id="oldest" value="oldest" name="g1" checked={this.state.sortBy === "oldest"} onChange={this.sort}></input>
            <label style={{ float: 'left' }} htmlFor="oldest">Oldest</label>

            <input style={{ float: 'left' }} type="radio" id="cheapest" value="cheapest" name="g1" checked={this.state.sortBy === "cheapest"} onChange={this.sort}></input>
            <label style={{ float: 'left' }} htmlFor="cheapest">Cheapest</label>

            <input style={{ float: 'left' }} type="radio" id="costliest" value="costliest" name="g1" checked={this.state.sortBy === "costliest"} onChange={this.sort}></input>
            <label style={{ float: 'left' }} htmlFor="costliest">Costliest</label>
          </div>
        </div>
      );
    }

    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    return (
      <div className='content'>
        <TitleBar></TitleBar>

        <FilterBar></FilterBar>

        <table >
          <thead>
            <tr>
              <th style={{width: '10%'}}>Thumbnail</th>
              <th style={{width: '30%'}}>Name</th>
              <th style={{width: '20%'}}>Type</th>
              <th style={{width: '10%'}}>Size</th>
              <th style={{width: '5%'}}>Cost</th>
              <th style={{width: '20%'}}>Added</th>
              <th></th>
            </tr>
          </thead>

          <tbody >
            {data.map((material =>
              <tr key={material.id}>
                <td >
                  <div  style={{marginLeft: '20px'}}>
                    <img src={"data:image/png;base64," + material.thumbnail} alt="thumbnail"></img>
                  </div>
                </td>  
                <td>{material.name}</td>
                <td>{material.materialType}</td>
                <td>{`W: ${material.width} l: ${material.length}`}</td>
                <td>{material.cost}</td>
                <td> {material.addedOn}</td>
                <td>
                  <div style={{width: '90px'}}>
                    <a href={`/material/view/${material.id}`} className="table-buttons">
                      <img src={'./view_icon.png'} width="30" height="30" alt="view"></img>
                    </a>
                    <a href={`/material/edit/${material.id}`} className="table-buttons">
                      <img src={'./edit_icon.png'} width="30" height="30" alt="edit"></img>
                    </a>
                    <a href={`/material/delete/${material.id}`} className="table-buttons">
                      <img src={'./delete_icon.jpeg'} width="30" height="30" alt="delete"></img>
                    </a>
                  </div>
                </td>

                {/* <td> <a href={`/material/view/${material.id}`}>{material.name}</a></td>
              <td>{material.Unit}</td>
              <input id="submit-new-period" type="button" value="delete" onClick={() => this.handleClick(material)} /> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default OverviewMaterials

