import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Routes from './routes';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Provider store={store}>
      <Navbar/>
      <Router>
        <Routes />
      </Router>
    </Provider>
  );
};

export default App;
