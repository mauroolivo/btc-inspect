extern crate core;

use wasm_bindgen::prelude::*;
use crate::tx::Tx;
use std::{io::{Cursor, Read}};

mod utils;
pub mod point_scalar;
pub mod field_element;
pub mod point;
pub mod secp256k1;
pub mod signature;
pub mod private_key;
pub mod helpers;
pub mod tx;
pub mod tx_input;
pub mod tx_output;
pub mod script;
pub mod tx_fetcher;
pub mod block;
pub mod merkle_tree;
pub mod merkle_block;

#[wasm_bindgen]
pub fn r_try_command() -> String {
    "0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600".to_string()
}
// #[wasm_bindgen]
// pub fn t_try_tx() -> Tx {
//     let raw_tx = hex::decode("0100000001813f79011acb80925dfe69b3def355fe914bd1d96a3f5f71bf8303c6a989c7d1000000006b483045022100ed81ff192e75a3fd2304004dcadb746fa5e24c5031ccfcf21320b0277457c98f02207a986d955c6e0cb35d446a89d3f56100f4d7f67801c31967743a9c8e10615bed01210349fc4e631e3624a545de3f89f5d8684c7b8138bd94bdd531d2e213bf016b278afeffffff02a135ef01000000001976a914bc3b654dca7e56b04dca18f2566cdaf02e8d9ada88ac99c39800000000001976a9141c4bc762dd5423e332166702cb75f40df79fea1288ac19430600").unwrap();
//     let mut stream = Cursor::new(raw_tx);
//     Tx::parse(&mut stream, true).unwrap()
// }