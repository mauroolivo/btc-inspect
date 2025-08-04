import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import './App.css';
import React, {useEffect, useState} from 'react';
import init, {init_app, get_tx_json, get_block_json, get_block_count} from "btc-inspect";
import {PiLinkBold} from "react-icons/pi";
import {toDateString, hex2a} from "./utility/utility";
import {Button, Col, Container, Fade, Row, Nav, Navbar, NavDropdown, Table} from "react-bootstrap";
import Block from "./components/Block.jsx";
import Tx from "./components/Tx.jsx";


function App() {
    const [inputValue, setInputValue] = useState('');
    const [txJson, setTxJson] = useState(null)
    const [blockJson, setBlockJson] = useState(null)
    const [errLbl, setErrLbl] = useState(null)

    useEffect(() => {
        const runWasm = async () => {
            await init();
            init_app();
        };
        runWasm();
    }, []);

    function handleBlock(blockId) {
        handleNewInput(blockId)
    }
    function handleTx(txId) {
        handleNewInput(txId)
    }
    function getBlockCount() {
        get_block_count().then(res => {
            console.log(res)
        })
    }
    function handleFetch(input) {
        setTxJson(null)
        setBlockJson(null)
        setErrLbl(null)
        // wasm: can't aquire multiple mutex
        get_tx_json(input).then(tx_json_str => {
                if (tx_json_str === "") {
                    get_block_json(input).then(block_json_str => {
                            if (block_json_str === "") {
                                setErrLbl("Invalid hash")
                            } else {
                                let block_json = JSON.parse(block_json_str);
                                console.log(block_json_str)
                                setBlockJson(block_json)
                            }
                        }
                    )
                } else {
                    let tx_json = JSON.parse(tx_json_str);
                    console.log(tx_json)
                    setTxJson(tx_json)
                }
            }
        )
    }
    function handleSample(n) {
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
        } else if (n === 11) {
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

    function Content() {
        if (txJson !== null) {
            return (<Tx txJson={txJson} onBlock={handleBlock} onTx={handleTx}/>)
        } else if (blockJson !== null) {
            return (
                <Block blockJson={blockJson} onBlock={handleBlock}/>
            )
        } else if (errLbl !== null) {
            return <p>{errLbl}</p>
        } else {
            return (
                <p></p>
            )
        }
    }

    return (
        <>
            <Container className=" fw-lighter">
                <Row>
                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand href="#home">BTC</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="#home">Home</Nav.Link>
                                    <Nav.Link href="#link">Link</Nav.Link>
                                    <NavDropdown title="Samples" id="basic-nav-dropdown">
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(1)}>P2WPKH</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(2)}>p2ms</NavDropdown.Item>

                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(3)}>p2pkh</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(4)}>p2tr</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(5)}>p2wpkh</NavDropdown.Item>
                                        <NavDropdown.Item href="" onClick={() => handleSample(6)}>p2sh
                                            multisig</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(7)}>p2pk</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(8)}>p2sh-p2wpkh</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(9)}>p2wsh</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(10)}>p2sh-pswsh</NavDropdown.Item>
                                        <NavDropdown.Item href=""
                                                          onClick={() => handleSample(11)}>op_return</NavDropdown.Item>
                                        <NavDropdown.Item href="" onClick={() => handleSample(12)}>coinbase
                                            (903171)</NavDropdown.Item>
                                        <NavDropdown.Item href="" onClick={() => handleSample(13)}>coinbase
                                            (700000)</NavDropdown.Item>
                                        <NavDropdown.Divider/>
                                        <NavDropdown.Item href="" onClick={() => handleSample(50)}>Block
                                            700000</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Row>
                <Row>
                    <Col>
                        <input
                            className="Input robotomono"
                            type="text"
                            placeholder={"Transaction ID"}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button variant="primary" disabled={inputValue.length !== 64}
                                onClick={() => handleFetch(inputValue)}>
                            Fetch
                        </Button>
                        <Button variant="primary" onClick={() => handleClear()}>
                            Clear
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Content/>
        </>
    );
}

export default App;
