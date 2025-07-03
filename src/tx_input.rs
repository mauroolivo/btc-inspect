use crate::script::Script;
use std::{fmt, io::{Cursor, Read, Error}};
use num::{BigUint, ToPrimitive};
use crate::helpers::endianness::{int_to_little_endian, little_endian_to_int};
use crate::tx_fetcher::TxFetcher;
use crate::tx::Tx;
use serde_json::json;

#[derive(Debug, Eq, PartialEq, Clone)]
pub struct TxInput {
    prev_tx: Vec<u8>,
    prev_index: u32,
    pub script_sig: Script,
    sequence: u32,
    pub witness: Option<Vec<Vec<u8>>>,
    pub tx_in_json: serde_json::Value,
}
impl TxInput {
    pub fn new(prev_tx: Vec<u8>, prev_index: u32, script_sig: Script, sequence: u32) -> Self {
        TxInput {
            prev_tx: prev_tx,
            prev_index: prev_index,
            script_sig: script_sig,
            sequence: sequence,
            witness: None,
            tx_in_json: json!(null),
        }
    }
    pub fn get_json(&self) -> serde_json::Value {
        self.tx_in_json.clone()
    }
    pub fn parse(stream: &mut Cursor<Vec<u8>>) -> Result<Self, Error> {
        let mut length: u32 = 0;
        length += 32;
        let mut buffer = vec![0; 32];
        stream.read(&mut buffer)?;
        buffer.reverse();
        let prev_tx = buffer.clone();

        length += 4;
        let mut buffer = vec![0; 4];
        stream.read(&mut buffer)?;
        let prev_index_bytes = buffer.as_slice();
        let prev_index = little_endian_to_int(prev_index_bytes).to_u32().unwrap();
        let prev_index_hex = hex::encode(prev_index_bytes);
        let script_sig = Script::parse(stream)?;
        let json = script_sig.script_json.clone();
        let val = json.get("script_length").unwrap().as_u64().unwrap();
        length += val as u32; // scriptsig length

        length += 4; //sequence
        let mut buffer = vec![0; 4];
        stream.read(&mut buffer)?;
        let sequence = little_endian_to_int(buffer.as_slice()).to_u32().unwrap();

        buffer.reverse();
        let tx_in_json = json!({
            "prev_tx": hex::encode(&prev_tx),
            "prev_index": prev_index,
            "prev_index_hex": prev_index_hex,
            "script_json": script_sig.get_json(),
            "sequence_hex": hex::encode(buffer),
            "is_rbf": (sequence < ( 0xffffffff - 1)),
            "length": length,
        });
        Ok(TxInput {
            prev_tx,
            prev_index,
            script_sig: script_sig,
            witness: None,
            sequence,
            tx_in_json: tx_in_json.clone(),
        })
    }
    pub fn serialize(&self) -> Vec<u8> {
        let mut result = Vec::new();

        let mut prev_tx = self.prev_tx.clone();
        prev_tx.reverse();
        result.extend(&prev_tx);
        result.extend(int_to_little_endian(BigUint::from(self.prev_index), 4u32));
        result.extend(self.script_sig.serialize());
        result.extend(int_to_little_endian(BigUint::from(self.sequence), 4u32));
        result
    }
    pub fn prev_tx(&self) -> Vec<u8> {
        self.prev_tx.to_vec()
    }
    pub fn prev_index(&self) -> u32 {
        self.prev_index
    }
    pub fn sequence(&self) -> u32 {
        self.sequence
    }
    pub fn script_sig(&self) -> Script {
        self.script_sig.clone()
    }
    pub async fn fetch_tx_async(&self, testnet: bool) -> Result<Tx, reqwest::Error> {
        let tx_id = hex::encode(self.prev_tx().to_vec());
        let tf = TxFetcher::new(testnet);
        let result = tf.fetch_async(tx_id.as_str()).await;
        match result {
            Ok(tx) => Ok(tx),
            Err(e) => Err(e)
        }
    }
    pub async fn value(&self, testnet: bool) -> u64 {
        let tx = self.fetch_tx_async(testnet).await.unwrap();
        tx.tx_outs()[self.prev_index as usize].amount()
    }
    pub async fn script_pubkey(&self, testnet: bool) -> Script {
        let tx = self.fetch_tx_async(testnet).await.unwrap();
        tx.tx_outs()[self.prev_index as usize].script_pubkey()
    }
}

impl fmt::Display for TxInput {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {

        write!(
            f,
            "TxInput {{ prev_tx: {:?}, prev_index: {}, script_sig: {}, sequence: {} }}",
            hex::encode(self.prev_tx()),
            self.prev_index(),
            self.script_sig(),
            self.sequence()
        )
    }
}