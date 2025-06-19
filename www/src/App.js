import './App.css';
import React, {useEffect, useState} from 'react';
import init, {init_app, r_tx_json_from_id} from "btc-inspect";
import { PiArrowCircleRight } from "react-icons/pi";

function App() {
    const [inputValue, setInputValue] = useState('');
    const [txJson, setTxJson] = useState(null)
    useEffect(() => {
        const runWasm = async () => {
            await init();
            init_app();
        };
        runWasm();
    }, []);

    function handleFetch(input) {
        setTxJson(null)

        r_tx_json_from_id(input).then(tx_json_str => {
            let tx_json = JSON.parse(tx_json_str);
            console.log(tx_json)
            setTxJson(tx_json)
        }
        )
    }
    function handleSample(n) {
        let input = ""
        if (n === 1) {
            input = "64ff0b827f7899674fc26b693c557852540b9260c5c29cf18f536b56f01b17ba"
        } else if (n === 2) {
            input = "ae8032eb2f698ff3e7a06deea33bcbf463466e84515c688940fe4a4e7dc4d966"
        } else if (n === 3) {
            input = "0b6461de422c46a221db99608fcbe0326e4f2325ebf2a47c9faf660ed61ee6a4"
        } else if (n === 4) {
            input = "479edb958c2eb314078de498e8d70241fe58e30b71f46489c02820b21cb2d822"
        } else if (n === 5) {
            input = "a894b5961f3258ac3f14a9ea3698a7db6537b393687a92bb42e54521d9d34d4e"
        } else if (n === 6) {
            input = "8670ed595dfee2c2fd10419f00711eed7ee7c3ea7c3a3a6ed3bccc3b835a2795"
        }
        handleFetch(input)
        setInputValue(input)
    }
    function handleNewInput(input) {
        handleFetch(input)
        setInputValue(input)
    }
    function handleClear() {
        setTxJson(null)
        setInputValue("")
    }
    function Samples() {
        return (<p><button className="Button" onClick={() => handleSample(1)}>sample 1 (P2WPKH)</button>
            <button className="Button" onClick={() => handleSample(2)}>sample 2 (P2SH-P2WPKH and P2WPKH)</button>
            <button className="Button" onClick={() => handleSample(3)}>sample 3 (P2PKH)</button>
            <button className="Button" onClick={() => handleSample(4)}>sample 4 (P2TR)</button>
            <button className="Button" onClick={() => handleSample(5)}>sample 5 (P2WPKH)</button>
            <button className="Button" onClick={() => handleSample(6)}>sample 6 (P2SH multisig)</button>
        </p>)
    }
    function ScriptItems({items}) {
        if (items === undefined) {
            return <p></p>
        }
        const list = items.map((item, idx) =>
            (<p key={idx}><span className="IsByte">{item}</span></p>)
        );
        return (<>{list}</>)
    }

    function Inputs() {
        const listItems = txJson.inputs.map((item, idx) =>
            (<div key={idx}><p>Input {idx}</p>
                    <table>
                        <tbody>
                        <tr key="0">
                            <td className="Col1">prev tx ID</td>
                            <td>{item["prev_tx"]} <button className="ButtonImg" onClick={() => handleNewInput(item["prev_tx"])}><PiArrowCircleRight /></button></td>
                        </tr>
                        <tr key="1">
                            <td className="Col1">prev index</td>
                            <td>{item["prev_index"]}</td>
                        </tr>
                        <tr key="2">
                            <td className="Col1">ScriptSig</td>
                            <td><ScriptItems items={item["script_json"]["cmd_list_json"]}/></td>
                        </tr>
                        <tr key="3">
                            <td className="Col1">witness</td>
                            <td><ScriptItems items={item["witness"]}/></td>
                        </tr>
                        <tr key="4">
                            <td className="Col1">sequence</td>
                            <td>{item["sequence_hex"]} (RBF: {item["is_rbf"] === true ? "enabled" : "not enabled"})</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            ));
        return (<>{listItems}</>)
    }
    function Outputs() {
        const listItems = txJson.outputs.map((item, idx) =>
            (<div key={idx}><p>Output {idx}</p>
                    <table>
                        <tbody>
                        <tr key="0">
                            <td className="Col1">Amount</td>
                            <td>{item["amount"]} sats</td>
                        </tr>
                        <tr key="1">
                            <td className="Col1">ScriptPubKey</td>
                            <td><ScriptItems items={item["script_json"]["cmd_list_json"]}/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            ));
        return (<>{listItems}</>)
    }
    function Summary() {
        return (
            <table>
                <tbody>
                <tr key="0">
                    <td className="Col1">Fee</td>
                    <td>{txJson.fee} sats</td>
                    <td></td>
                </tr>
                <tr key="1">
                    <td className="Col1">Bytes</td>
                    <td>{txJson.non_witness_bytes + txJson.witness_bytes}</td>
                    <td><span className="Supplement">{txJson.non_witness_bytes} + {txJson.witness_bytes}</span></td>
                </tr>
                <tr key="2">
                    <td className="Col1">Weight Units</td>
                    <td>{txJson.non_witness_bytes * 4 + txJson.witness_bytes}</td>
                    <td><span className="Supplement">{txJson.non_witness_bytes} x 4 + {txJson.witness_bytes} x 1</span></td>
                </tr>
                <tr key="3">
                    <td className="Col1">Virtual Bytes</td>
                    <td>{txJson.non_witness_bytes + txJson.witness_bytes * 0.25}</td>
                    <td><span className="Supplement">{txJson.non_witness_bytes} x 1 + {txJson.witness_bytes} x 0.25</span></td>
                </tr>
                <tr key="4">
                    <td className="Col1">Fee rate</td>
                    <td>{Number(txJson.fee / (txJson.non_witness_bytes + txJson.witness_bytes * 0.25)).toFixed(2)} sats/vBytes</td>
                    <td></td>
                </tr>
                <tr key="5">
                    <td className="Col1">SegWit</td>
                    <td>{txJson.is_segwit ? "YES" : "NO"}</td>
                    <td></td>
                </tr>
                <tr key="6">
                    <td className="Col1">RBF</td>
                    <td>{txJson.is_rbf ? "YES" : "NO"}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        )
    }
    function Table() {
        if (txJson == null) {
            return <p></p>;
        } else {
            return (
                <>
                    <table>
                        <tbody>
                        <tr>
                            <td className="Col1">Summary</td>
                            <td className="Col2"></td>
                            <td><Summary/></td>
                        </tr>
                        <tr>
                            <td className="Col1">Tx Hex</td>
                            <td className="Col2"></td>
                            <td>{txJson.hex}</td>
                        </tr>
                        <tr>
                            <td className="Col1">Tx ID</td>
                            <td className="Col2"></td>
                            <td>{txJson.hash}</td>
                        </tr>
                        <tr>
                            <td className="Col1">version</td>
                            <td className="Col2"></td>
                            <td>{txJson.version_hex} ({txJson.version})</td>
                        </tr>
                        <tr>
                            <td className="Col1">marker</td>
                            <td className="Col2"></td>
                            <td>{txJson.marker_hex} {txJson.is_segwit ? "segwit" : ""}</td>
                        </tr>
                        <tr>
                            <td className="Col1">inputs: {txJson.num_inputs}</td>
                            <td className="Col2"></td>
                            <td><Inputs/></td>
                        </tr>
                        <tr>
                            <td className="Col1">outputs: {txJson.num_outputs}</td>
                            <td className="Col2"></td>
                            <td><Outputs/></td>
                        </tr>
                        <tr>
                            <td className="Col1">locktime</td>
                            <td className="Col2"></td>
                            <td>{txJson.locktime_hex} ({txJson.locktime})</td>
                        </tr>
                        </tbody>
                    </table>
                </>
            )
        }
    }

    return (
        <div className="App">
            <div className="Header">
                <input
                    className="Input"
                    type="text"
                    placeholder={"Transaction ID"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            <button className="Button" disabled={inputValue.length !== 64} onClick={() => handleFetch(inputValue)}>
                Fetch Transaction
            </button>
            <button className="Button" onClick={() => handleClear()}>
                Clear
            </button>
            <Samples/>
            <Table/>
        </div>
    );
}

export default App;
