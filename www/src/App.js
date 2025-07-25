import './App.css';
import React, {useEffect, useState} from 'react';
import init, {init_app, get_tx_json, get_block_json} from "btc-inspect";
import { PiLinkBold } from "react-icons/pi";
import { toDateString, hex2a } from "./Utility/utility";

function App() {
    const [inputValue, setInputValue] = useState('');
    const [txJson, setTxJson] = useState(null)
    const [blockJson, setBlockJson] = useState(null)
    const [errLbl, setErrLbl] = useState(null)
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };
    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };
    useEffect(() => {
        const runWasm = async () => {
            await init();
            init_app();
        };
        runWasm();
    }, []);
    function handleFetch(input) {
        setTxJson(null)
        setBlockJson(null)
        setErrLbl(null)
        // wasm: can't aquire multiple mutex
        get_tx_json(input).then(tx_json_str => {
            if (tx_json_str === "") {
                get_block_json(input).then(block_json_str => {
                    if(block_json_str === "") {
                        setErrLbl("Invalid hash")
                    }
                    else {
                        let block_json = JSON.parse(block_json_str);
                        console.log(block_json_str)
                        setBlockJson(block_json)
                    }
                }
                )
            }
            else {
                let tx_json = JSON.parse(tx_json_str);
                console.log(tx_json)
                setTxJson(tx_json)
            }
        }
        )
    }
    function handleSample(n) {
        setDropdownVisible(false);
        let input = ""
        if (n === 1) {
            input = "64ff0b827f7899674fc26b693c557852540b9260c5c29cf18f536b56f01b17ba"
        } else if (n === 2) {
            input = "581d30e2a73a2db683ac2f15d53590bd0cd72de52555c2722d9d6a78e9fea510"
        } else if (n === 3) {
            input = "0b6461de422c46a221db99608fcbe0326e4f2325ebf2a47c9faf660ed61ee6a4"
        } else if (n === 4) {
            input = "0a168cc50ef5a4603dfd3f810a9b8d8fcdd4e4d1c548ded68385e2fe215be302"
        } else if (n === 5) {
            input = "a894b5961f3258ac3f14a9ea3698a7db6537b393687a92bb42e54521d9d34d4e"
        } else if (n === 6) {
            input = "8670ed595dfee2c2fd10419f00711eed7ee7c3ea7c3a3a6ed3bccc3b835a2795"
        } else if (n === 7) {
            input = "b24d0b39bb06e8405d3658e9b74a6efb2c7e8898fa2205a30a19a390f12d816b"
        } else if (n === 8) {
            input = "a55bd4d4ebd319ab2990c356e16cab1eeb52a93c414b869a606dc0add61d725a"
        } else if (n === 9) {
            input = "46ebe264b0115a439732554b2b390b11b332b5b5692958b1754aa0ee57b64265"
        } else if (n === 10) {
            input = "55c7c71c63b87478cd30d401e7ca5344a2e159dc8d6990df695c7e0cb2f82783"
        } else  if (n === 11) {
            input = "6dfb16dd580698242bcfd8e433d557ed8c642272a368894de27292a8844a4e75"
        } else if (n === 12) {
            input = "61b43bbbf0d14580b9fdd45956b407be47499bb3712fd20f53f1b2a7029752d8"
        } else if (n === 13) {
            input = "1d8149eb8d8475b98113b5011cf70e0b7a4dccff71286d28b8b4b641f94f1e46"
        }
        // blocks
        if (n === 50) {
            input = "0000000000000000000590fc0f3eba193a278534220b2b37e9849e1a770ca959"
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
                            <td className="Col1">Prev tx ID</td>
                            <td>{item["prev_tx"]} <button className="ButtonImg" onClick={() => handleNewInput(item["prev_tx"])}><PiLinkBold /></button></td>
                        </tr>
                        <tr key="1">
                            <td className="Col1">Prev index</td>
                            <td>{txJson["is_coinbase"] === true ? item["prev_index_hex"] : item["prev_index"] }</td>
                        </tr>
                        <tr key="2">
                            <td className="Col1">ScriptSig</td>
                            <td><ScriptItems items={item["script_json"]["cmd_list_json"]}/></td>
                        </tr>
                        <tr key="3">
                            <td className="Col1">Witness</td>
                            <td><ScriptItems items={item["witness"]}/></td>
                        </tr>
                        <tr key="4">
                            <td className="Col1">Sequence</td>
                            <td>{item["sequence_hex"]} (RBF: {item["is_rbf"] === true ? "enabled" : "not enabled"})</td>
                        </tr>
                        <tr key="5">
                            <td className="Col1">Prev Output ScriptPubKey</td>
                            <td>
                                {
                                    item["prev_output_script_pubkey"] &&
                                    <ScriptItems items={item["prev_output_script_pubkey"]["cmd_list_json"]}/>
                                }
                            </td>
                        </tr>
                        <tr key="6">
                            <td className="Col1">Type</td>
                            <td>{item["prev_output_type"]}</td>
                        </tr>
                        { txJson["is_coinbase"] === true &&
                        <tr key="7">
                            <td className="Col1">Coinbase height</td>
                            <td>{txJson["coinbase_height"]}</td>
                        </tr>
                        }
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
                            <td></td>
                        </tr>
                        <tr key="1">
                            <td className="Col1">ScriptPubKey</td>
                            <td><ScriptItems items={item["script_json"]["cmd_list_json"]}/></td>
                        </tr>
                        <tr key="2">
                            <td className="Col1">Type</td>
                            <td>{item["script_type"]}</td>
                        </tr>
                        { item["script_type"] === "op_return" &&
                             <tr key="3">
                                <td className="Col1">op_return data</td>
                                <td>{item["script_type"] === "op_return" ? hex2a(item["script_json"]["cmd_list_json"][2]) : ""}</td>
                            </tr>

                        }
                        { item["address"].length > 0 &&
                            <tr key="4">
                                <td className="Col1">Address</td>
                                <td>{item["address"]}</td>
                            </tr>

                        }
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
                <tr key="7">
                    <td className="Col1">Coinbase</td>
                    <td>{txJson.is_coinbase ? "YES" : "NO"}</td>
                    <td></td>
                </tr>
                <tr key="8">
                    <td className="Col1">Blockhash</td>
                    <td>{txJson.blockhash} <button className="ButtonImg" onClick={() => handleNewInput(txJson.blockhash)}><PiLinkBold /></button></td>
                    <td></td>
                </tr>
                <tr key="9">
                    <td className="Col1">Blocktime</td>
                    <td>{toDateString(txJson.blocktime)}</td>
                    <td></td>
                </tr>
                <tr key="10">
                    <td className="Col1">Confirmations</td>
                    <td>{txJson.confirmations}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        )
    }
    function TableBlock() {
        const transactions = blockJson.txs.map(tx => <li>{tx}</li>);
        return (
            <>
                <table>
                    <tbody>
                    <tr>
                        <td className="Col1">Raw</td>
                        <td className="Col2"></td>
                        <td>{blockJson.raw}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Version</td>
                        <td className="Col2"></td>
                        <td>{blockJson.version}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Version bits</td>
                        <td className="Col2"></td>
                        <td>{blockJson.version_bits}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Previous Block</td>
                        <td className="Col2"></td>
                        <td>{blockJson.prev_block} <button className="ButtonImg" onClick={() => handleNewInput(blockJson.prev_block)}><PiLinkBold /></button></td>
                    </tr>
                    <tr>
                        <td className="Col1">merkle root</td>
                        <td className="Col2"></td>
                        <td>{blockJson.merkle_root}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Timestamp</td>
                        <td className="Col2"></td>
                        <td>{blockJson.timestamp} {toDateString(blockJson.timestamp)}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Bits</td>
                        <td className="Col2"></td>
                        <td>{blockJson.bits}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Nonce</td>
                        <td className="Col2"></td>
                        <td>{blockJson.nonce}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Transactions</td>
                        <td className="Col2"></td>
                        <td>{blockJson.n_tx}</td>
                    </tr>
                    { /*
                    <tr>
                        <td className="Col1">Transactions</td>
                        <td className="Col2"></td>
                        <td><ul>{transactions}</ul></td>
                    </tr>
                    */ }
                    </tbody>
                </table>
            </>
        )
    }
    function TableTx() {
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
                        <td>{txJson.tx_id}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Hash (wTxId)</td>
                        <td className="Col2"></td>
                        <td>{txJson.hash}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Version</td>
                        <td className="Col2"></td>
                        <td>{txJson.version_hex} ({txJson.version})</td>
                    </tr>
                    <tr>
                        <td className="Col1">Segwit marker</td>
                        <td className="Col2"></td>
                        <td>{txJson.marker_hex}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Segwit flag</td>
                        <td className="Col2"></td>
                        <td>{txJson.marker_flag}</td>
                    </tr>
                    <tr>
                        <td className="Col1">Locktime</td>
                        <td className="Col2"></td>
                        <td>{txJson.locktime_hex} ({txJson.locktime})</td>
                    </tr>
                    </tbody>
                </table>
                <div className="Cols2">
                    <div><Inputs/></div>
                    <div><Outputs/></div>
                </div>
            </>
        )
    }
    function Content() {
        if (txJson !== null) {
            return (<TableTx/>);
        } else if (blockJson !== null) {
            return (<TableBlock/>)
        } else if (errLbl !== null) {
            return <p>{errLbl}</p>
        } else {
            return (<p></p>)
        }
    }
    function DropdownMenu() {
        return (
            <div className="dropdown-menu">
                <ul>
                    <li onClick={() => handleSample(1)}>P2WPKH</li>
                    <li onClick={() => handleSample(2)}>p2ms</li>
                    <li onClick={() => handleSample(3)}>p2pkh</li>
                    <li onClick={() => handleSample(4)}>p2tr</li>
                    <li onClick={() => handleSample(5)}>p2wpkh</li>
                    <li onClick={() => handleSample(6)}>p2sh multisig</li>
                    <li onClick={() => handleSample(7)}>p2pk</li>
                    <li onClick={() => handleSample(8)}>p2sh-p2wpkh</li>
                    <li onClick={() => handleSample(9)}>p2wsh</li>
                    <li onClick={() => handleSample(10)}>p2sh-pswsh</li>
                    <li onClick={() => handleSample(11)}>op_return</li>
                    <li onClick={() => handleSample(12)}>coinbase (903171)</li>
                    <li onClick={() => handleSample(13)}>coinbase (700000)</li>
                </ul>
                <ul>
                    <li onClick={() => handleSample(50)}>Block 700000</li>
                </ul>
            </div>
        )
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
                <button className="Button" disabled={inputValue.length !== 64} onClick={() => handleFetch(inputValue)}>
                    Fetch
                </button>
                <button className="Button" onClick={() => handleClear()}>
                    Clear
                </button>
                <header className="App-header">
                    <div
                        className="menu"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="Button">Samples</button>
                        {isDropdownVisible && <DropdownMenu />}
                    </div>
                </header>
            </div>
            <Content/>
        </div>
    );
}

export default App;
