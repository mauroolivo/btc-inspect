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
                <table><tbody>
                <tr>
                    <td className="Col1">Raw Tx</td>
                    <td className="Col2">{txJson.raw.length / 2}</td>
                    <td>{txJson.raw}</td>
                </tr>
                <tr>
                    <td className="Col1">Tx ID</td>
                    <td className="Col2">{txJson.hash.length / 2}</td>
                    <td>{txJson.hash}</td>
                </tr>
                <tr>
                    <td className="Col1">version</td>
                    <td className="Col2"></td>
                    <td>02000000 ({txJson.version})</td>
                </tr>
                <tr>
                    <td className="Col1">marker</td>
                    <td className="Col2">2</td>
                    <td>0001</td>
                </tr>
                </tbody></table>
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
