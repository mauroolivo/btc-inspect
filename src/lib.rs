extern crate core;
use serde_json::json;

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
    "02000000000102b6cddcad2c91605806d343d9b3bee830ac1dbad7b0947c3e8128c1d509ff6a0f0200000000fdffffff51eb90e06d2fd89fc2d44ecb3b61bc7c283c28bb5bd917fda60f9c70d8a508780000000000fdffffff0459fb01000000000016001460d6e1ace002fd8eaf32150bf57c85d44c16e16a8e83000000000000160014fc500b6131ec3656c69e61342fe79e704f1d0bf7e077010000000000160014933d02a93ff4432126d5dc07f4e7a789921386c28e830000000000001600143ca60043256e265f47742a8203692497f16d17060247304402204cdd7422269eadfa575cacb86ff71364d76c24e7500242dd7182436fa357802502203d6c35bd27806b1325b89c4fb44ac6b096cbb3b73e3571ae8e16f9c19817a043012102d7a6619fd168d86861cf210a181565e04412f7edced7545d0d691bdc0f9a0ecf02473044022015fb3bd8b9feb9cf9fcbcb9fb903f4f78bfaa3799a6179c6893029a0849f58f5022014678e7521f57c18608944b48269bf0a3d1ad2dd6b19d0b8359f31f75fff87d101210239cda05e52bbddf86a021903b6209758d9787b5aa3867db4bf5609efc05bd8642dae0d00".to_string()
}
// #[wasm_bindgen]
// pub fn t_try_tx() -> Tx {

// }

#[wasm_bindgen]
pub fn r_tx_json() -> String {

    let tx_str = "02000000000102b6cddcad2c91605806d343d9b3bee830ac1dbad7b0947c3e8128c1d509ff6a0f0200000000fdffffff51eb90e06d2fd89fc2d44ecb3b61bc7c283c28bb5bd917fda60f9c70d8a508780000000000fdffffff0459fb01000000000016001460d6e1ace002fd8eaf32150bf57c85d44c16e16a8e83000000000000160014fc500b6131ec3656c69e61342fe79e704f1d0bf7e077010000000000160014933d02a93ff4432126d5dc07f4e7a789921386c28e830000000000001600143ca60043256e265f47742a8203692497f16d17060247304402204cdd7422269eadfa575cacb86ff71364d76c24e7500242dd7182436fa357802502203d6c35bd27806b1325b89c4fb44ac6b096cbb3b73e3571ae8e16f9c19817a043012102d7a6619fd168d86861cf210a181565e04412f7edced7545d0d691bdc0f9a0ecf02473044022015fb3bd8b9feb9cf9fcbcb9fb903f4f78bfaa3799a6179c6893029a0849f58f5022014678e7521f57c18608944b48269bf0a3d1ad2dd6b19d0b8359f31f75fff87d101210239cda05e52bbddf86a021903b6209758d9787b5aa3867db4bf5609efc05bd8642dae0d00";
    let raw_tx = hex::decode(tx_str).unwrap();
    let mut stream = Cursor::new(raw_tx.clone());
    let tx = Tx::parse(&mut stream, true).unwrap();
    // let mut tx_json = json!({
    //     "varsion": tx.version(),
    //     "locktime": tx.locktime(),
    //     "hash": hex::encode( tx.hash() ).to_string(),
    //     "raw": tx_str,
    // });
    // tx_json["new"] = json!("123456");
    tx.tx_json().to_string()
}
