import React, {useEffect, useState} from 'react';
import {PiLinkBold} from "react-icons/pi";
import {hex2a, toDateString} from "../utility/utility.js";
import {Col, Container, Row, Table} from "react-bootstrap";

function ScriptItems({items}) {
    if (items === undefined) {
        return <p></p>
    }
    const list = items.map((item, idx) =>
        (<p key={idx}><span className="IsByte">{item}</span></p>)
    );
    return (<>{list}</>)
}
function Inputs({txJson, onTx}) {
    const listItems = txJson.inputs.map((item, idx) =>
        (<div key={idx}><p>Input {idx}</p>
                <Table striped hover>
                    <tbody>
                    <tr>
                        <td><p>Prev tx ID</p></td>
                        <td><p className="robotomono">{item["prev_tx"]}</p><button className="ButtonImg" onClick={() => onTx(item["prev_tx"])}>
                            <PiLinkBold/></button></td>
                    </tr>
                    <tr>
                        <td ><p>Prev index</p></td>
                        <td><p>{txJson["is_coinbase"] === true ? item["prev_index_hex"] : item["prev_index"]}</p></td>
                    </tr>
                    <tr>
                        <td ><p>ScriptSig</p></td>
                        <td><ScriptItems items={item["script_json"]["cmd_list_json"]}/></td>
                    </tr>
                    <tr>
                        <td ><p>Witness</p></td>
                        <td><ScriptItems items={item["witness"]}/></td>
                    </tr>
                    <tr>
                        <td ><p>Sequence</p></td>
                        <td>{item["sequence_hex"]} (RBF: {item["is_rbf"] === true ? "enabled" : "not enabled"})</td>
                    </tr>
                    <tr>
                        <td ><p>Prev Output ScriptPubKey</p></td>
                        <td>{
                            item["prev_output_script_pubkey"] &&
                            <ScriptItems items={item["prev_output_script_pubkey"]["cmd_list_json"]}/>
                        }</td>
                    </tr>
                    <tr>
                        <td ><p>Type</p></td>
                        <td>{item["prev_output_type"]}</td>
                    </tr>
                    {txJson["is_coinbase"] === true &&
                        <tr>
                            <td ><p>Coinbase height</p></td>
                            <td>{txJson["coinbase_height"]}</td>
                        </tr>
                    }
                    </tbody>
                </Table>
            </div>
        ));
    return (<>{listItems}</>)
}
function Outputs({txJson}) {
    const listItems = txJson.outputs.map((item, idx) =>
        (<div key={idx}><p>Output {idx}</p>
                <Table striped hover>
                    <tbody>
                    <tr>
                        <td ><p>Amount</p></td>
                        <td><p>{item["amount"]} sats</p></td>
                    </tr>
                    <tr>
                        <td ><p>ScriptPubKey</p></td>
                        <td><ScriptItems items={item["script_json"]["cmd_list_json"]}/></td>
                    </tr>
                    <tr>
                        <td ><p>Type</p></td>
                        <td><p>{item["script_type"]}</p></td>
                    </tr>
                    {item["script_type"] === "op_return" &&
                        <tr>
                            <td ><p>op_return data</p></td>
                            <td>{item["script_type"] === "op_return" ? hex2a(item["script_json"]["cmd_list_json"][2]) : ""}</td>
                        </tr>
                    }
                    {item["address"].length > 0 &&
                        <tr>
                            <td ><p>Address</p></td>
                            <td><p className="robotomono">{item["address"]}</p></td>
                        </tr>
                    }
                    </tbody>
                </Table>
            </div>
        ));
    return (<>{listItems}</>)
}
function Summary({txJson, onBlock}) {
    return (
        <>
        <Container className=" fw-lighter">
            <Row>
                <Table striped hover>
                    <tbody>
                    <tr>
                        <td ><p>Fee</p></td>
                        <td><p>{txJson.fee} sats</p></td>
                    </tr>
                    <tr>
                        <td ><p>Bytes</p></td>
                        <td><p>{txJson.non_witness_bytes + txJson.witness_bytes}</p>{txJson.non_witness_bytes} + {txJson.witness_bytes}</td>
                    </tr>
                    <tr>
                        <td ><p>Weight Units</p></td>
                        <td><p>{txJson.non_witness_bytes * 4 + txJson.witness_bytes}</p>{txJson.non_witness_bytes} x 4 + {txJson.witness_bytes} x 1</td>
                    </tr>
                    <tr>
                        <td ><p>Virtual Bytes</p></td>
                        <td><p>{txJson.non_witness_bytes + txJson.witness_bytes * 0.25}</p>{txJson.non_witness_bytes} x 1 + {txJson.witness_bytes} x 0.25</td>
                    </tr>
                    <tr>
                        <td ><p>Fee rate</p></td>
                        <td><p>{Number(txJson.fee / (txJson.non_witness_bytes + txJson.witness_bytes * 0.25)).toFixed(2)} sats/vBytes</p></td>
                    </tr>

                    <tr>
                        <td ><p>SegWit</p></td>
                        <td><p>{txJson.is_segwit ? "YES" : "NO"}</p></td>
                    </tr>
                    <tr>
                        <td ><p>RBF</p></td>
                        <td><p>{txJson.is_rbf ? "YES" : "NO"}</p></td>
                    </tr>
                    <tr>
                        <td ><p>Coinbase</p></td>
                        <td><p>{txJson.is_coinbase ? "YES" : "NO"}</p></td>
                    </tr>
                    <tr>
                        <td ><p>Blockhash</p></td>
                        <td><p className="robotomono">{txJson.blockhash}</p><button className="ButtonImg" onClick={() => onBlock(txJson.blockhash)}><PiLinkBold/>
                        </button></td>
                    </tr>
                    <tr>
                        <td ><p>Blocktime</p></td>
                        <td><p>{toDateString(txJson.blocktime)}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Confirmations</p></td>
                        <td><p>{txJson.confirmations}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Tx Hex</p></td>
                        <td><p className="robotomono">{txJson.hex}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Tx ID</p></td>
                        <td><p className="robotomono">{txJson.tx_id}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Hash (wTxId)</p></td>
                        <td><p className="robotomono">{txJson.hash}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Version</p></td>
                        <td><p>{txJson.version_hex} ({txJson.version})</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Segwit marker</p></td>
                        <td><p className="robotomono">{txJson.marker_hex}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Segwit flag</p></td>
                        <td><p className="robotomono">{txJson.marker_flag}</p>
                        </td>
                    </tr>
                    <tr>
                        <td ><p>Locktime</p></td>
                        <td><p className="robotomono">{txJson.locktime_hex}</p>({txJson.locktime})
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>
        </>
    )
}
function Tx({txJson, onBlock, onTx}) {

    return (
            <>
                <Container className=" fw-lighter">
                    <Row>
                    <p>Summary</p>
                    <Summary txJson={txJson} onBlock={onBlock} />
                    </Row>
                    <Row>
                        <Col><Inputs txJson={txJson} onTx={onTx}/></Col>
                        <Col><Outputs txJson={txJson}/></Col>

                    </Row>
                </Container>
            </>
    )
}

export default Tx;
