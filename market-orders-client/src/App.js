import './App.css';
import {useEffect, useState} from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function App() {
  const [trades, setTrades] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);
  const [topSymbols, setTopSymbols] = useState([]);
  const [totalTrades, setTotalTrades] = useState(0);
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
      setTopBuyers(json.topBuyers);
      setTopSymbols(json.topSymbols);
      setTotalTrades(json.totalTrades);
    } catch (e) {
      throw e;
    }
  }

  async function toggleStreaming() {
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
        <Row>
          <Col>
            <h3>Top Buyers</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Total Portfolio Value</th>
                </tr>
              </thead>
              <tbody>
                {topBuyers.map(topBuyer => {
                  return <tr key={topBuyer.last_name}>
                      <td>{topBuyer.first_name}</td>
                      <td>{topBuyer.last_name}</td>
                      <td>${USNumberFormat.format(topBuyer.total_portfolio_value || 0)}</td>
                    </tr>
                })}
              </tbody>
            </Table>
          </Col>
          <Col>
            <h3>Top Symbols</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Total Bid Price</th>
                </tr>
              </thead>
              <tbody>
                {topSymbols.map(topSymbol => {
                  return <tr key={topSymbol.symbol}>
                      <td>{topSymbol.symbol}</td>
                      <td>${USNumberFormat.format(topSymbol.bid_price || 0)}</td>
                    </tr>
                })}
              </tbody>
            </Table>
          </Col>
          <Col>
            <h3>Total Trades</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td>{totalTrades}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

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
