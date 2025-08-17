import {Col, NavDropdown, Row} from "react-bootstrap";
import React, {useState} from "react";
import {JSONTree} from "react-json-tree";
import {
    get_block_count,
    get_blockchain_info,
    get_mempool_info,
    get_mining_info,
    get_nettotals,
    get_network_info
} from "btc-inspect";

function AppBlockchain() {
    // TODO move testnetValue to parent
    const [testnetValue, setTestnetValue] = useState(true);
    const [jsonTree, setJsonTree] = useState(null)

    function getBlockCount() {
        get_block_count(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function getBlockchainInfo() {
        get_blockchain_info(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function getMempoolInfo() {
        get_mempool_info(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function getMiningInfo() {
        get_mining_info(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function getNetTotals() {
        get_nettotals(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function getNetworkInfo() {
        get_network_info(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    return (
        <Row>
            <Col>
                <h3>Blockchain</h3>
                <NavDropdown title="Blockchain" id="basic-nav-dropdown">
                    <NavDropdown.Item href=""
                                      onClick={() => getBlockCount()}>get_block_count</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => getBlockchainInfo()}>get_blockchain_info</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => getMempoolInfo()}>get_mempool_info</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => getMiningInfo()}>get_mining_info</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => getNetTotals()}>get_nettotals</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => getNetworkInfo()}>get_network_info</NavDropdown.Item>
                </NavDropdown>
                {
                    jsonTree !== null && <JSONTree data={jsonTree} />
                }

            </Col>
        </Row>
    )
}
export default AppBlockchain;