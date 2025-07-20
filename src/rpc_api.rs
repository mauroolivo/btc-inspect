use std::collections::HashMap;
use std::f32::consts::E;
use std::io::{Cursor, Error, ErrorKind};
use std::num::IntErrorKind;
use reqwest::Method;
//use ripemd::digest::core_api::Block;
use crate::tx::Tx;
use crate::block::Block;
use serde_json::json;
use serde::{Deserialize, Serialize};
use crate::env::{API_PASS, API_URL, API_USER};
use crate::rpc_models::{RpcTxResponse, RpcBlockResponse0};

pub struct RpcApi {
    api_url: String,
    testnet: bool,
}

impl RpcApi {
    pub fn new(testnet: bool) -> Self {
        RpcApi {api_url: API_URL.lock().unwrap().to_string(), testnet }
    }
    pub async fn get_tx(&self, tx_id: &str) -> Result<Tx, reqwest::Error> {
        if self.testnet {
            panic!("Not implemented");
        }
        let url = format!("{}", self.api_url);
        log::info!("FETCH: {:?}", url);
        let json_string = json!({
            "jsonrpc": "2.0",
            "id": "curl",
            "method": "getrawtransaction",
            "params": [tx_id, true]
        }).to_string();

        let client = reqwest::Client::new();
        let response = client
            .post(url)
            .basic_auth(API_USER.lock().unwrap().to_string(), Some(API_PASS.lock().unwrap().to_string()))
            .body(json_string)
            .send()
            .await
            .unwrap()
            .json::<RpcTxResponse>()
            //.text()
            .await;
        match response {
            Ok(result) => {
                log::info!("CALL RESPONSE{:#?}", result.result.hex.clone());

                let raw_tx = hex::decode(result.result.hex.clone()).unwrap();
                let tid = tx_id;
                let k = format!("{}", tid);

                let mut stream = Cursor::new(raw_tx.clone());
                let mut tx = Tx::parse(&mut stream, false).unwrap();
                let mut tx_json = tx.tx_json();
                tx_json["hex"] = json!(result.result.hex.clone());
                tx_json["blockhash"] = json!(result.result.blockhash.clone());
                tx_json["blocktime"] = json!(result.result.blocktime.clone());
                tx_json["confirmations"] = json!(result.result.confirmations.clone());
                tx.tx_json = tx_json;
                Ok(tx)
            }
            Err(e) => {
                println!("Error: {}", e);
                Err(reqwest::Error::from(e))
            }
        }
    }
    pub async fn get_block(&self, block_id: &str) -> Result<String, reqwest::Error> {

        if self.testnet {
            panic!("Not implemented");
        }
        let url = format!("{}", self.api_url);
        log::info!("FETCH: {:?}", url);

        let verbosity = 1;
        let json_string = json!({
            "jsonrpc": "2.0",
            "id": "curl",
            "method": "getblock",
            "params": [block_id, verbosity]
        }).to_string();

        let client = reqwest::Client::new();
        let response = client
            .post(url)
            .basic_auth(API_USER.lock().unwrap().to_string(), Some(API_PASS.lock().unwrap().to_string()))
            .body(json_string)
            .send()
            .await
            .unwrap()
            .json::<RpcBlockResponse0>()
            //.text()
            .await;
        match response {
            Ok(result) => {
                //log::info!("CALL RESPONSE{:#?}", result.result.hex.clone());

                let raw_block = hex::decode(result.result.hash.clone()).unwrap();

                // log::info!("ADDING TO CACHE: {:#?}", tx_id);
                // let tid = tx_id;
                // let k = format!("{}", tid);
                // hashmap.insert(k.clone(), result.result.hex.clone());
                //
                let mut stream = Cursor::new(raw_block.clone());
                let mut block = Block::parse(&mut stream).unwrap();

                // let mut tx_json = tx.tx_json();
                // tx_json["hex"] = json!(result.result.hex.clone());
                // tx_json["blockhash"] = json!(result.result.blockhash.clone());
                // tx_json["blocktime"] = json!(result.result.blocktime.clone());
                // tx_json["confirmations"] = json!(result.result.confirmations.clone());
                // tx.tx_json = tx_json;

                Ok(result.result.hash)
            }
            Err(e) => {
                println!("Error: {}", e);
                Err(reqwest::Error::from(e))
            }
        }
    }
}