import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Navigate, Route, Routes} from "react-router";
/* import App from "./app"; */
import AppLayout from "./components/AppLayout.jsx";
import AppHome from "./components/AppHome.jsx";
import AppExplorer from "./components/AppExplorer.jsx";
import AppWallet from "./components/AppWallet.jsx";
import AppBlockchain from "./components/AppBlockchain.jsx";
import App404 from "./components/App404.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import './index.css'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<App />} /> */}

            <Route element={<AppLayout />}>
                <Route index element={<AppHome />} />
                <Route path="explorer" element={<AppExplorer />} />
                <Route path="blockchain" element={<AppBlockchain />} />
                <Route path="wallet" element={<AppWallet />} />

                <Route path="/404" element={<App404 />} />
                <Route path="*" element={<Navigate replace to="/404" />} />
            </Route>

        </Routes>
    </BrowserRouter>,
);