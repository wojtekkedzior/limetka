import React from 'react';

class SearchFilter extends React.Component {

    render() {
        return (
            <div className="App">
                <label>Filters</label>
                <select name="themeSelect" id="cars">
                    <option value="">Theme</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>

                <select name="typeSelect" id="cars">
                    <option value="">type</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>

                <select name="colorSelect" id="cars">
                    <option value="">Color</option>
                    <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="opel">Opel</option>
                    <option value="audi">Audi</option>
                </select>


            </div>
        );
    }

}


// function SearchFilter() {
//     return (
//         <div className="App">
//             <label>asdadasas</label>
//         </div>
//     );
// }



export default SearchFilter
