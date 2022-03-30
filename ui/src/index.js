import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

import './App.scss';

import { Switch, Route } from 'react-router-dom';
import Material from './Material'
import OverviewMaterials from './OverviewMaterials';
import OverviewProducts from './OverviewProducts';

const MainPage = () => (
  <div className="content">
    <div className='home-page-divs'>
      <a href="/materials">Material</a>
    </div>

    <div className='home-page-divs' >
      <a href="/products">Prodcuts</a>
    </div>
  </div>
);

ReactDOM.render(
  <BrowserRouter>
    <Header></Header>
      <Switch>
        <Route exact path='/' component={MainPage}></Route>
        <Route exact path='/materials' component={OverviewMaterials}></Route>
        <Route exact path='/contact' component={OverviewProducts}></Route>
        <Route exact path='/material/:mode/:id' component={Material}></Route>
        <Route exact path='/material/:mode' component={Material}></Route>
      </Switch>
    <Footer></Footer>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
