// import React from 'react';
import React, { useState } from 'react';

function Example() {
    const [nameA, setName] = useState()
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            data: null,
            count: 0,
            p: this.props.someProfile,

        };
    }

    componentDidMount() {

    }

    handleChangeUsername() {
        // const handleSubmit = event => {
        //     console.info('I', "asda")
        //     // alert(event)
        //     event.preventDefault()
        // }

    }

    render() {
        // const Profile = () => {
        //     const [name, setName] = useState()

        //     const handleChangeUsername = e => {
        //       console.info('I', name)
        //       setName(e.target.value)
        //     }

        const handleSubmit = event => {
            console.info('I', this.state.name)
            //   alert(p.na)
            event.preventDefault()
        }

        const handleChangeUsername = e => {
            console.info('I', e.target.value)
            // this.state.name = e.target.value
            this.setState({ name: e.target.value })
            // setName(e.target.value)
        }


        function CreditCardForm(props) {
            const [cardNumber, setCardNumber] = React.useState("");
            const [nameA, setName] = useState()

            const [cardTypeImage, setCardTypeImage] = React.useState(
              "card-logo-unknown.svg"
            );
          
            const handleCardNumber = (e) => {
              e.preventDefault();
          
              const value = e.target.value;
              setCardNumber(value);
          
              let suggestion;
          
              if (value.length > 0) {
                console.info('I', e.target.value)
                // suggestion = creditCardType(e.target.value)[0];
              }
          
              const cardType = suggestion ? suggestion.type : "unknown";
          
              let imageUrl;
          
              switch (cardType) {
                case "visa":
                  imageUrl = "card-logo-visa.svg";
                  break;
                case "mastercard":
                  imageUrl = "card-logo-mastercard.svg";
                  break;
                case "american-express":
                  imageUrl = "card-logo-amex.svg";
                  break;
                default:
                  imageUrl = "card-logo-unknown.svg";
              }
          
              setCardTypeImage(imageUrl);
            };
          
            return (
              <form>
                <div className="card-number">
                  <input
                    type="text"
                    placeholder="card number"
                    value={cardNumber}
                    onChange={handleCardNumber}
                  />
                  <img src={cardTypeImage} alt="card logo" />
                  <div>
                        <label >Id</label>
                        <label >Id</label>

                        <input type="text" value={nameA} onChange={handleChangeUsername} />
                    </div>


                </div>
                <button type="submit" className="myButton">
                  Login
                </button>
              </form>
            );
          }






        return (
            
            <div>
                {/* <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button> */}

        <CreditCardForm(this.props) />

                <form onSubmit={handleSubmit}>
                    Username:
                    {/* <input
                        type="text"
                        value="asdas"
                    // onChange={handleChangeUsername}
                    /> */}

                    <div>
                        <label >Id</label>
                        <label >Id</label>

                        {/* <input type="text" value={nameA} onChange={handleChangeUsername} /> */}
                    </div>

                    <input type="submit" value="Submit" />
                </form>

                <div>
                    <label >Name</label>
                    {/* <input type="text"  onChange={e => set(e.target.value)} value={p.Name}/> */}
                </div>

                {/* <p>{p.Id}</p> */}
                {/* <p>{p.Name}</p> */}
                {/* <p>{p.Unit}</p> */}
                {/* <p>You clicked {count} times</p> */}
                {/* <input id="submit-new-period" type="button" value={count} onClick={() => boo(count + 1)} /> */}

                {/* <input id="submit-new-period" type="submit"/> */}
            </div>
        );
    }

}

export default Profile