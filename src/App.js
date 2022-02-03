import './App.css';
import {useEffect, useState} from "react";
import axios from 'axios'

const App = () => {
  const [alerts, setAlerts] = useState([])

  const fetchData = async () => {
    const results = await axios('/.netlify/functions/api')
    console.info(results)

    setAlerts(results?.data)
  }


  useEffect(() => {
    void fetchData()
  },[])


  return (
    <div className="dashboard">
        {
          alerts?.map(({hostname, siteName}, idx) => (<p key={idx}>{hostname} - {siteName}</p>))
        }
    </div>
  );
}

export default App;
