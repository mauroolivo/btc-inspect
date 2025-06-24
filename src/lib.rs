extern crate core;
use serde_json::json;

use wasm_bindgen::prelude::*;
use crate::tx::Tx;
use std::{io::{Cursor, Read}};
use tx_fetcher::TxFetcher;
use crate::utils::set_panic_hook;

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
pub mod cache;

extern crate console_error_panic_hook;
extern crate wasm_log;

#[wasm_bindgen]
pub fn init_app() {
    set_panic_hook();
    wasm_log::init(wasm_log::Config::default());
}
#[wasm_bindgen]
pub async fn r_tx_json_from_id(tx_id: String) -> String {

    let mut tx = Tx::new_from_id(tx_id.clone()).await;
    tx.tx_json.to_string()
}