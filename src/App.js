import './App.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [alerts, setAlerts] = useState([])

  const fetchData = async () => {
    try {
      const results = await axios('/.netlify/functions/controller')
      const data = results?.data.map(
        result => result.get['@ref'].object.data.object,
      )

      setAlerts(data)
    } catch (e) {
      console.error('ui error', e)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return (
    <>
      <h2>RMM Webhook Dashboard</h2>
      <div className="dashboard">
        <table>
          <thead>
            <tr>
              <th>hostname</th>
              <th>device id</th>
              <th>site id</th>
              <th>site name</th>
              <th>priority</th>
              <th>message</th>
              <th>category</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, idx) => (
              <tr key={idx}>
                <td>{alert?.hostname}</td>
                <td>{alert?.deviceId}</td>
                <td>{alert?.siteId}</td>
                <td>{alert?.siteName}</td>
                <td>{alert?.priority}</td>
                <td>{alert?.msg}</td>
                <td>{alert?.category}</td>
                <td>{new Date(alert?.date).toUTCString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
