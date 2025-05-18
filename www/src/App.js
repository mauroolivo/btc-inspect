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
    function ScriptItems({items}) {
        const list = items.map((item, idx) =>
            (<p key={idx}>{item}</p>)
        );
        return (<>{list}</>)
    }
    function Inputs() {
        const listItems = txJson.inputs.map((item, idx) =>
            (<div key={idx}><p>Input {idx}</p><table><tbody>
                <tr key="0">
                    <td className="Col1">prev tx ID</td>
                    <td>{item["prev_tx"]}</td>
                </tr>
                <tr key="1">
                    <td className="Col1">prev index</td>
                    <td>{item["prev_index"]}</td>
                </tr>
                <tr key="2">
                    <td className="Col1">scriptSig</td>
                    <td><ScriptItems items={item["script_json"]}/></td>
                </tr>
                <tr key="3">
                    <td className="Col1">sequence</td>
                    <td>{item["sequence_hex"]}</td>
                </tr>
                </tbody>
                </table></div>
            ));
        return (<>{listItems}</>)
    }
    function Table() {
        if (txJson == null) {
            return <p></p>;
        } else {
            return (
                <table><tbody>
                <tr>
                    <td className="Col1">Tx Hex</td>
                    <td className="Col2">{txJson.hex.length / 2}</td>
                    <td>{txJson.hex}</td>
                </tr>
                <tr>
                    <td className="Col1">Tx ID</td>
                    <td className="Col2">{txJson.hash.length / 2}</td>
                    <td>{txJson.hash}</td>
                </tr>
                <tr>
                    <td className="Col1">version</td>
                    <td className="Col2">{txJson.version_hex.length / 2}</td>
                    <td>{txJson.version_hex} ({txJson.version})</td>
                </tr>
                <tr>
                    <td className="Col1">marker</td>
                    <td className="Col2">{txJson.version_hex.length / 2}</td>
                    <td>{txJson.marker_hex} {txJson.is_segwit ? "segwit" : ""}</td>
                </tr>
                <tr>
                    <td className="Col1">inputs</td>
                    <td className="Col2">{txJson.num_inputs}</td>
                    <td><Inputs /></td>
                </tr>
                <tr>
                    <td className="Col1">outputs</td>
                    <td className="Col2"></td>
                    <td>{txJson.num_outputs}</td>
                </tr>
                <tr>
                    <td className="Col1">locktime</td>
                    <td className="Col2">{txJson.locktime_hex.length / 2}</td>
                    <td>{txJson.locktime_hex} ({txJson.locktime})</td>
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
