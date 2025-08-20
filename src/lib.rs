extern crate core;

use serde::Serialize;
use serde_json::json;
use wasm_bindgen::prelude::*;
use crate::tx::Tx;

use crate::block::Block;
use crate::rpc_api::RpcApi;
use crate::rpc_models::RpcBlockchaininfoResult;
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
pub mod rpc_api;
pub mod block;
pub mod merkle_tree;
pub mod merkle_block;
pub mod env;
pub mod rpc_models;

extern crate console_error_panic_hook;
extern crate wasm_log;

#[wasm_bindgen]
pub fn init_app() {
    set_panic_hook();
    wasm_log::init(wasm_log::Config::default());
}
#[wasm_bindgen]
pub async fn get_tx_json(testnet: bool, tx_id: String) -> String {

    let mut tx = Tx::new_from_id(testnet, tx_id.clone()).await;
    match tx {
        Some(tx) => tx.tx_json.to_string(),
        None => "".to_string()
    }
}
#[wasm_bindgen]
pub async fn get_block_json(testnet: bool, block_id: String) -> String {

    let mut block = Block::new_from_id(testnet, block_id.clone()).await;
    match block {
        Some(block) => block.block_json.to_string(),
        None => "".to_string()
    }
}
#[wasm_bindgen]
pub async fn get_block_txs_json(testnet: bool, block_id: String) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_block_2(&block_id).await;

    match res_wrapped {
        Ok(block_res) => {
            let txs = block_res.result.tx;
            let mut txs_json = Vec::new();
            for tx in txs {
                let mut tx_json = json!({});
                tx_json["txid"] = json!(tx.txid);
                tx_json["fee"] = json!(tx.fee);
                let mut vin_count = 0;
                if let Some(vin) = tx.vin {
                    vin_count = vin.len()
                }
                let mut vout_count = 0;
                if let Some(vout) = tx.vout {
                    vout_count = vout.len()
                }
                tx_json["inputs"] = json!(vin_count);
                tx_json["outputs"] = json!(vout_count);

                txs_json.push(tx_json);
            }
            serde_json::to_string(&txs_json).unwrap()
        }
        Err(_) => {

            "".to_string()
        }
    }
}
#[wasm_bindgen]
pub async fn get_block_count(testnet: bool) -> u32 {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_block_count().await;
    match res_wrapped {
        Ok(res) => {res.result},
        Err(_) => {0}
    }
}
#[wasm_bindgen]
pub async fn get_blockchain_info(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_blockchain_info().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {"".to_string()}
    }
}
#[wasm_bindgen]
pub async fn get_mempool_info(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_mempool_info().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {"".to_string()}
    }
}
#[wasm_bindgen]
pub async fn get_mining_info(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_mining_info().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {"".to_string()}
    }
}
#[wasm_bindgen]
pub async fn get_nettotals(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_nettotals().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {"".to_string()}
    }
}
#[wasm_bindgen]
pub async fn get_network_info(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_network_info().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {"".to_string()}
    }
}

#[wasm_bindgen]
pub async fn get_wallet_info(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.get_wallet_info().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {
            "".to_string()
        }
    }
}
#[wasm_bindgen]
pub async fn list_transactions(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.list_transactions().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {
            "".to_string()
        }
    }
}
#[wasm_bindgen]
pub async fn list_unspent(testnet: bool) -> String {
    let api = RpcApi::new(testnet);
    let res_wrapped = api.list_unspent().await;
    match res_wrapped {
        Ok(res) => {
            serde_json::to_string(&res.result).unwrap()
        },
        Err(_) => {
            "".to_string()
        }
    }
}