import React, {useEffect, useState} from 'react';
import {PiLinkBold} from "react-icons/pi";
import {toDateString} from "../utility/utility.js";
import {Button, Col, Container, Fade, Row, Nav, Navbar, NavDropdown, Table} from "react-bootstrap";


function Block({blockJson, onPrevBlock}) {

        const transactions = blockJson.txs.map(tx => <li>{tx}</li>);
        return (
            <>

                <Container className=" fw-lighter">
                    <Row>
                        <Table striped hover>
                            <tbody>
                            <tr>
                                <td nowrap><p>RAW</p></td>
                                <td><p className="robotomono">{blockJson.raw}</p></td>
                            </tr>
                            <tr>
                                <td nowrap>Version</td>
                                <td><p className="robotomono">{blockJson.version}</p></td>
                            </tr>
                            <tr>
                                <td nowrap>Version bits</td>
                                <td><p className="robotomono">{blockJson.version_bits}</p></td>
                            </tr>
                            <tr>
                                <td nowrap>Previous Block</td>
                                <td>
                                    <p className="robotomono">{blockJson.prev_block}
                                        <button className="ButtonImg"
                                                onClick={() => onPrevBlock(blockJson.prev_block)} >
                                            <PiLinkBold/></button>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td nowrap="true">Merkle root</td>
                                <td><p className="robotomono">{blockJson.merkle_root}</p></td>
                            </tr>
                            <tr>
                                <td nowrap="true">Timestamp</td>
                                <td><p
                                    className="robotomono">{blockJson.timestamp}</p> {toDateString(blockJson.timestamp)}
                                </td>
                            </tr>

                            <tr>
                                <td nowrap="true">Height</td>
                                <td><p>{blockJson.height}</p></td>
                            </tr>
                            <tr>
                                <td nowrap>Bits</td>
                                <td><p className="robotomono">{blockJson.bits}</p></td>
                            </tr>
                            <tr>
                                <td nowrap>Nonce</td>
                                <td><p className="robotomono">{blockJson.nonce}</p></td>
                            </tr>
                            <tr>
                                <td nowrap>Transactions</td>
                                <td><p>{blockJson.n_tx}</p></td>
                            </tr>
                            </tbody>
                        </Table>
                    </Row>
                </Container>
            </>
        )
}

export default Block;
