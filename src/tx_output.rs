
use crate::script::Script;
use std::{fmt, io::{Cursor, Read}};
use num::{BigUint, ToPrimitive};
use crate::helpers::endianness::{int_to_little_endian, little_endian_to_int};
use serde_json::json;

#[derive(Debug, Eq, PartialEq, Clone)]
pub struct TxOutput {
    amount: u64,
    script_pubkey: Script,
    tx_out_json: serde_json::Value,
}
impl TxOutput {
    pub fn new(amount: u64, script_pubkey: Script) -> TxOutput {
        TxOutput {
            amount,
            script_pubkey,
            tx_out_json: json!(null),
        }
    }
    pub fn get_json(&self) -> serde_json::Value {
        self.tx_out_json.clone()
    }
    pub fn parse(stream: &mut Cursor<Vec<u8>>) -> Result<Self, std::io::Error> {
        let mut buffer = [0; 8];
        stream.read(&mut buffer)?;
        let script_pubkey = Script::parse(stream)?;
        let mut tx_out_json = json!({
            "amount": little_endian_to_int(buffer.as_slice()).to_u64().unwrap(),
            "script_json": script_pubkey.get_json(),
        });
        Ok(TxOutput {
            amount: little_endian_to_int(buffer.as_slice()).to_u64().unwrap(),
            script_pubkey: script_pubkey,
            tx_out_json:tx_out_json
        })
    }
    pub fn serialize(&self) -> Vec<u8> {
        let mut result = Vec::new();
        result.extend( int_to_little_endian(BigUint::from(self.amount), 8u32));
        result.extend(self.script_pubkey.serialize());
        result
    }
    pub fn amount(&self) -> u64 {
        self.amount
    }
    pub fn script_pubkey(&self) -> Script {
        self.script_pubkey.clone()
    }
}
impl fmt::Display for TxOutput {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "TxOutput {{ value: {}, script_pubkey: {} }}",
            self.amount(),
            self.script_pubkey()
        )
    }
}