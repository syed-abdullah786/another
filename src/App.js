import React, {useState } from "react";
import './App.css';
import Upload from './components/upload';
import Properties from './components/properties';
import Edit from './components/edit';
import Crawl from './components/crawl';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myContext from './components/appContext';

function App() {
  const [propurl,setPropurl] = useState([])
  const [uniturl,setUniturl] = useState([])
  return (
    <div className="App">
      <Switch>
      <myContext.Provider value={{propurl,setPropurl,uniturl,setUniturl}}>
        <Route exact path='/' component={Upload} />
        <Route exact path='/properties' component={Properties} />
        <Route exact path='/crawl' component={Crawl} />
        <Route exact path='/edit' component={Edit} />
  {/* <Route exact path="/" render={(props) => <Main sortBy="newest" {...props}/> }/>  */}
      </myContext.Provider>
        </Switch>
        <ToastContainer />
    </div>
  );
}

export default App;
