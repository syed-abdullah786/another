import logo from './logo.svg';
import './App.css';
import Upload from './components/upload';
import Properties from './components/properties';
import Edit from './components/edit';
import Crawl from './components/crawl';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Upload} />
        <Route exact path='/properties' component={Properties} />
        <Route exact path='/crawl' component={Crawl} />
        <Route exact path='/edit' component={Edit} />
  {/* <Route exact path="/" render={(props) => <Main sortBy="newest" {...props}/> }/>  */}
        </Switch>
    </div>
  );
}

export default App;
