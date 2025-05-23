import './App.css';
import React, {useEffect, useState} from 'react';
import init, {r_tx_json} from "btc-inspect";

function App() {
    const [inputValue, setInputValue] = useState('');
    const [txJson, setTxJson] = useState(null)
    useEffect(() => {
        const runWasm = async () => {
            await init();
        };
        runWasm();
    }, []);

    function handleFetch(input) {
        setTxJson(null)

        fetch(`https://blockstream.info/api/tx/${input}/hex`, {
            method: "GET",
            headers: {},
        })
            .then((response) => response.text())
            .then((data) => {
                let tx_json = JSON.parse(r_tx_json(data));

                console.log(tx_json.inputs[0])
                setTxJson(tx_json)
            })
            .catch((error) => console.log(error));
    }
    function handleSample(n) {
        let input = ""
        if (n === 1) {
            input = "64ff0b827f7899674fc26b693c557852540b9260c5c29cf18f536b56f01b17ba"
        } else if (n === 2) {
            input = "ae8032eb2f698ff3e7a06deea33bcbf463466e84515c688940fe4a4e7dc4d966"
        } else if (n === 3) {
            input = "0b6461de422c46a221db99608fcbe0326e4f2325ebf2a47c9faf660ed61ee6a4"
        }
        handleFetch(input)
        setInputValue(input)
    }
    function handleClear() {
        setTxJson(null)
        setInputValue("")
    }

    function ScriptItems({items}) {
        if (items === undefined) {
            return <p></p>
        }
        const list = items.map((item, idx) =>
            (<p key={idx}>{item}</p>)
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

    function Table() {
        if (txJson == null) {
            return <p></p>;
        } else {
            return (
                <table>
                    <tbody>
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
                        <td><Inputs/></td>
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
                    </tbody>
                </table>
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
            <ul>
                <li><button className="Button" onClick={() => handleSample(1)}>sample 1</button></li>
                <li><button className="Button" onClick={() => handleSample(2)}>sample 2</button></li>
                <li><button className="Button" onClick={() => handleSample(3)}>sample 3</button></li>
            </ul>
            <Table/>
        </div>
    );
}

export default App;
