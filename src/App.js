import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from 'axios'

function App() {
  const [alerts, setAlerts] = useState([])

  const fetchData = async () => {
    const results = await axios('/.netlify/functions/api')
    console.info(results)

    setAlerts(results?.data?.message)
  }


  useEffect(() => {
    void fetchData()
  },[])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {alerts}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
