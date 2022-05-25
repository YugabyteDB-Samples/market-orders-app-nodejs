import './App.css';
import {useEffect, useState} from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'

function App() {
  const [trades, setTrades] = useState([]);
  const [topBuyer, setTopBuyer] = useState({});
  const [isRunning, setIsRunning] = useState(true);
  async function getTrades() {
    try {
      const data = await fetch("/trades?sort=trade_time:desc&limit=100");
      const json = await data.json();
      setTrades(json);
    } catch (e) {
      throw e;
    }
  }

  async function getStats() {
    try {
      const data = await fetch("/stats");
      const json = await data.json();
      setTopBuyer(json);
    } catch (e) {
      throw e;
    }
  }

  async function toggleStreaming() {
    console.log(isRunning)
    try {
      await fetch("/controls", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({value: !isRunning})
      })
      setIsRunning(!isRunning);
    } catch (e) {
      throw e;
    }
  }
  
  useEffect(() => {
    getTrades();
    getStats();
    const interval = setInterval(() => {
      getTrades();
      getStats();
    }, 5000);

    return () => { clearInterval(interval)}
  }, [])

  let USNumberFormat = Intl.NumberFormat('en-US');

  return (
    <div className="App">
      <div className="header">
        <h1>Market Orders</h1>
        {isRunning ? <button onClick={toggleStreaming}>Stop Streaming Trades<Spinner animation="grow" size="sm"/></button> : <button onClick={toggleStreaming}>Start Streaming Trades</button>}
      </div>

      <div className="main-content">
        <h3>Top Buyer</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Total Portfolio Value</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>{topBuyer.first_name}</td>
                <td>{topBuyer.last_name}</td>
                <td>${USNumberFormat.format(topBuyer.total_portfolio_value)}</td>
              </tr>
          </tbody>
        </Table>
        <h3>Recent Trades</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bid Price</th>
              <th>Symbol</th>
              <th>Time</th>
              <th>Trade Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => {
              return <tr key={trade.id}>
                <td>{trade.id}</td>
                <td>{trade.bid_price}</td>
                <td>{trade.symbol}</td>
                <td>{trade.trade_time}</td>
                <td>{trade.trade_type}</td>
                <td>{trade.order_quantity}</td>
              </tr>
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
