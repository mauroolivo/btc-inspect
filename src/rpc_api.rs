use std::collections::HashMap;
use std::f32::consts::E;
use std::io::{Cursor, Error, ErrorKind};
use std::num::IntErrorKind;
use num::BigUint;
use reqwest::Method;
//use ripemd::digest::core_api::Block;
use crate::tx::Tx;
use crate::block::Block;
use serde_json::json;
use serde::{Deserialize, Serialize};
use to_binary::BinaryString;
use crate::env::{API_PASS, API_URL, API_USER};
use crate::helpers::endianness::int_to_little_endian;
use crate::rpc_models::{RpcTxResponse, RpcBlock0Response, RpcBlock1Response};

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
                log::info!("hex: {:#?}", result.result.hex.clone());

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
    pub async fn get_block(&self, block_id: &str) -> Result<Block, reqwest::Error> {

        if self.testnet {
            panic!("Not implemented");
        }
        let url = format!("{}", self.api_url);

        let verbosity = 0;
        let json_string = json!({
            "jsonrpc": "2.0",
            "id": "curl",
            "method": "getblock",
            "params": [block_id, verbosity]
        }).to_string();

        let response0 = self.get_block_0(block_id).await;
        let response1 = self.get_block_1(block_id).await;

        match response0 {
            Ok(result) => {
                let block_api_data = result.result.clone();
                let block_api_raw = &block_api_data[..160];
                let raw_block = hex::decode(block_api_raw).unwrap();
                let mut stream = Cursor::new(raw_block.clone());
                let mut block = Block::parse(&mut stream).unwrap();
                let mut block_json = block.block_json();
                let serialized = hex::encode(block.serialize()).to_string();
                assert_eq!(block_api_raw, serialized);

                block_json["raw"] = json!(block_api_raw);
                let mut bytes: Vec<u8> = int_to_little_endian(BigUint::from(block.clone().version), 4);
                bytes.reverse();
                block_json["version"] = json!(hex::encode(bytes.clone()));
                let version_bits = BinaryString::from_hex(hex::encode(bytes));
                block_json["version_bits"] = json!(version_bits.unwrap().to_string());
                block_json["prev_block"] = json!(hex::encode(block.clone().prev_block));
                block_json["merkle_root"] = json!(hex::encode(block.clone().merkle_root));
                block_json["timestamp"] = json!(block.clone().timestamp);
                block_json["bits"] = json!(hex::encode(block.clone().bits));
                block_json["nonce"] = json!(hex::encode(block.clone().nonce));

                match response1 {
                    Ok(result) => {

                        block_json["n_tx"] = json!(result.result.nTx);
                        block_json["txs"] = json!(result.result.tx);
                    }
                    Err(e) => {
                        println!("Error: {}", e);
                        log::error!("Error: {}", e);
                    }
                }
                block.block_json = block_json;
                Ok(block)
            }
            Err(e) => {
                println!("Error: {}", e);
                Err(reqwest::Error::from(e))
            }
        }
    }
    async fn get_block_0(&self, block_id: &str) -> Result<RpcBlock0Response, reqwest::Error> {

        if self.testnet {
            panic!("Not implemented");
        }
        let url = format!("{}", self.api_url);

        let verbosity = 0;
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
            .json::<RpcBlock0Response>()
            //.text()
            .await;
        match response {
            Ok(result) => {
                Ok(result)
            }
            Err(e) => {
                println!("Error: {}", e);
                Err(reqwest::Error::from(e))
            }
        }
    }
    async fn get_block_1(&self, block_id: &str) -> Result<RpcBlock1Response, reqwest::Error> {

        if self.testnet {
            panic!("Not implemented");
        }
        let url = format!("{}", self.api_url);

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
            .json::<RpcBlock1Response>()
            //.text()
            .await;
        match response {
            Ok(result) => {
                Ok(result)
            }
            Err(e) => {
                Err(reqwest::Error::from(e))
            }
        }
    }
}