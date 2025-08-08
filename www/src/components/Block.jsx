import React, {useEffect, useState} from 'react';
import {PiLinkBold} from "react-icons/pi";
import {toDateString} from "../utility/utility.js";
import {Button, Container, Row, Table} from "react-bootstrap";


function Block({blockJson, blockTxs, onBlock, onBlockTxs, onTx}) {


    function getTxs(block_id) {

        onBlockTxs(block_id)

    }
    /*
    const txsRows = blockTxs.map((tx, key) =>
        <tr key={key}>
            <td><p className="robotomono">{tx.txid}</p>
                <button className="ButtonImg" onClick={() => onTx(tx.txid)}>
                    <PiLinkBold/></button>
            </td>
            <td><p className="robotomono">{tx.fee}</p></td>
            <td><p className="robotomono">{tx.inputs}</p></td>
            <td><p className="robotomono">{tx.outputs}</p></td>
        </tr>);
*/
    return (
        <>

            <Container className=" fw-lighter">
                <Row>
                    <Table striped hover>
                        <tbody>
                        <tr>
                            <td><p>RAW</p></td>
                            <td><p className="robotomono">{blockJson.raw}</p></td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td><p className="robotomono">{blockJson.version}</p></td>
                        </tr>
                        <tr>
                            <td>Version bits</td>
                            <td><p className="robotomono">{blockJson.version_bits}</p></td>
                        </tr>
                        <tr>
                            <td>Previous Block</td>
                            <td>
                                <p className="robotomono">{blockJson.prev_block}
                                    <button className="ButtonImg"
                                            onClick={() => onBlock(blockJson.prev_block)}>
                                        <PiLinkBold/></button>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>Merkle root</td>
                            <td><p className="robotomono">{blockJson.merkle_root}</p></td>
                        </tr>
                        <tr>
                            <td>Timestamp</td>
                            <td><p
                                className="robotomono">{blockJson.timestamp}</p> {toDateString(blockJson.timestamp)}
                            </td>
                        </tr>

                        <tr>
                            <td>Height</td>
                            <td><p>{blockJson.height}</p></td>
                        </tr>
                        <tr>
                            <td>Bits</td>
                            <td><p className="robotomono">{blockJson.bits}</p></td>
                        </tr>
                        <tr>
                            <td>Nonce</td>
                            <td><p className="robotomono">{blockJson.nonce}</p></td>
                        </tr>
                        <tr>
                            <td>Transactions</td>
                            <td><p>{blockJson.n_tx}</p></td>
                        </tr>
                        </tbody>
                    </Table>
                </Row>
                {
                    blockTxs.length === 0 && <Button onClick={() => {
                        getTxs(blockJson.block_id)
                    }
                    }>load txs</Button>
                }
                {
                    blockTxs.length > 0 &&
                    <Row>
                        <Table striped hover>
                            <thead>
                            <tr>
                                <th>Tx id</th>
                                <th>Fee</th>
                                <th>input</th>
                                <th>outputs</th>
                            </tr>
                            </thead>
                            <tbody>
                            {blockTxs.map((tx, key) =>
                                <tr key={key}>
                                    <td><p className="robotomono">{tx.txid}</p>
                                        <button className="ButtonImg" onClick={() => onTx(tx.txid)}>
                                            <PiLinkBold/></button>
                                    </td>
                                    <td><p className="robotomono">{tx.fee}</p></td>
                                    <td><p className="robotomono">{tx.inputs}</p></td>
                                    <td><p className="robotomono">{tx.outputs}</p></td>
                                </tr>)}
                            </tbody>
                        </Table>
                    </Row>
                }
            </Container>
        </>
    )
}

export default Block;
