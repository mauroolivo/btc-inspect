import React, {useEffect, useState} from 'react';
import init, {
    init_app, get_tx_json, get_block_json, get_block_txs_json,
    get_block_count, get_blockchain_info, get_mempool_info, get_mining_info, get_nettotals, get_network_info
} from "btc-inspect";
import {NavLink, Outlet} from "react-router";
import {Container, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";

function AppLayout() {
    useEffect(() => {
        const runWasm = async () => {
            await init();
            init_app();
        };
        runWasm();
    }, []);

    return (
        <Container className=" fw-lighter">
            <Row>
                <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="/">BTC</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto mainmenu">
                                <NavLink className={({isActive}) =>
                                    isActive ? "active" : ""}
                                         to={"/"}>Home</NavLink>
                                <NavLink className={({isActive}) =>
                                    isActive ? "active" : ""}
                                         to={"/explorer"}>Explorer</NavLink>
                                <NavLink className={({isActive}) =>
                                    isActive ? "active" : ""}
                                         to={"/blockchain"}>Blockchain</NavLink>
                                <NavLink className={({isActive}) =>
                                    isActive ? "active" : ""}
                                         to={"/wallet"}>Wallet</NavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Row>

            <Outlet/>
        </Container>
    )
}

export default AppLayout;