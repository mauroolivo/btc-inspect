import {Col, NavDropdown, Row} from "react-bootstrap";
import React, {useState} from "react";
import {JSONTree} from "react-json-tree";
import {
    get_wallet_info,
    list_transactions,
    list_unspent
} from "btc-inspect";

function AppWallet() {
    // TODO move testnetValue to parent
    const [testnetValue, setTestnetValue] = useState(true);
    const [jsonTree, setJsonTree] = useState(null)

    function getWalletInfo() {
        get_wallet_info(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function listTransactions() {
        list_transactions(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    function listUnspent() {
        list_unspent(testnetValue).then(res => {
            setJsonTree(JSON.parse(res))
            console.log(res)
        })
    }
    return (
        <Row>
            <Col>
                <h3>Wallet</h3>
                <NavDropdown title="Wallet" id="basic-nav-dropdown">
                    <NavDropdown.Item href=""
                                      onClick={() => getWalletInfo()}>get_wallet_info</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => listTransactions()}>list_transactions</NavDropdown.Item>
                    <NavDropdown.Item href=""
                                      onClick={() => listUnspent()}>list_unspent</NavDropdown.Item>
                </NavDropdown>
                {
                    jsonTree !== null && <JSONTree data={jsonTree} />
                }

            </Col>
        </Row>
    )
}
export default AppWallet;