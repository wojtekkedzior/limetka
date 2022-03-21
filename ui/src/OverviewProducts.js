// import React from 'react';
import React from 'react';

class OverviewMaterials extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      data: null,
      nameA: "14",
    };
  }

  componentDidMount() {
    fetch("http://localhost:3001/getAll", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Request-Headers': 'http://localhost:3001'
      }
    }).then(response => response.json())
      // .then(res => res) 
      .then(
        (result) => {
          console.log("Actual Response: ", result)
          this.setState({
            isLoaded: true,
            data: result
          });
          console.log(result);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
            data: "asdasdas"
          });
        }
      )
  }

  handleClick() {
    // var rand = Math.random()
    // this.setState({ num: rand })
    // this.forceUpdate()
    // console.info('I', profile)
    this.setState({ nameA: Number(this.state.nameA) + Number(1) })

    // this.setState({num: profile.Name})
    // this.setState({num: profile.Quantity})
    // this.setState({num: profile.Unit})
  }


  render() {
    const { isLoaded, data  } = this.state;
    // function Example() {
    //   const [nameA, setName] = useState()
    //   // const [submitting, setSubmitting] = useState(false);
    // }

    // const handleType = event => {
    //   this.setState({ nameA: event.target.value })
    //   console.info(event.target.value)
    // }

    // const handleSubmit = event => {
    //   event.preventDefault();
    //   //  setSubmitting(true);

    //   //  setTimeout(() => {
    //   //    setSubmitting(false);
    //   //  }, 3000)
    // }

   if (!isLoaded) {
           return <div>Loading...</div>;
      } 
    return (
      
      
      <div className="wrapper">
        <p>table goes here</p>
        <input id="submit-new-period" type="button" value={this.state.nameA} onClick={() => this.handleClick()} />
        <table>
         <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit</th>
          </tr>

          {data.map((profile =>
            <tr>
              <td>{profile.Name}</td>
              <td>{profile.Quantity}</td>
              <td>{profile.Unit}</td>

              <input id="submit-new-period" type="button" value="delete" onClick={() => this.handleClick(profile)} />
            </tr>
          ))}
        </table>

      </div>
    )

  }

}

export default OverviewMaterials

