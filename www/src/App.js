import './App.css';
import React, { useEffect } from 'react';
import init, {r_tx_json} from "btc-inspect";
import { useState } from 'react';

function App() {
  const [txJson, setTxJson] = useState(null)
  useEffect(() => {
    const runWasm = async () => {
      await init();
    };
    runWasm();
  }, []);

  function handleFetch() {
        let tx_json = JSON.parse(r_tx_json());
        console.log(tx_json);
        setTxJson(tx_json)
  }
    function handleClear() {
        setTxJson(null)
    }
    function Table() {
        if (txJson == null) {
            return <p></p>;
        } else {
            return (
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <td className="TableHead">Raw Tx</td>
                    <td>{txJson.raw}</td>
                </tr>

                <tr>
                    <td className="TableHead">Tx ID</td>
                    <td>{txJson.hash}</td>
                </tr>
                <tr>
                    <td className="TableHead">version</td>
                    <td>02000000...</td>
                </tr>
                <tr>
                    <td className="TableHead">marker</td>
                    <td>0001... <i>segwit</i></td>
                </tr>
                </tbody>
            </table>
            )
        }
    }
  return (
    <div className="App">
        <div className="Header">
            <input className="Input"
                   placeholder={"Transaction ID"}
            />
        </div>
        <button className="Button" onClick={() => handleFetch()} >
          Fetch Transaction
        </button>
        <button className="Button" onClick={() => handleClear()} >
            Clear
        </button>
        <Table />
    </div>
  );
}

export default App;
