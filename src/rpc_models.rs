use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct RpcTxResponse {
    pub(crate) result: RpcTxResult,
}
#[derive(Deserialize)]
pub struct RpcTxResult {
    pub(crate) hex: String,
    pub(crate) blockhash: String,
    pub(crate) blocktime: u64,
    pub(crate) confirmations: u64,
}
#[derive(Deserialize)]
pub struct RpcBlock0Response {
    pub(crate) result: String,
}
#[derive(Deserialize)]
pub struct RpcBlock1Response {
    jsonrpc: String,
    pub result: RpcBlock1Result,
}
#[derive(Deserialize)]
pub struct RpcBlock1Result {
    pub hash: String,
    pub confirmations: u64,
    pub height: u64,
    pub version: u64,
    pub versionHex: String,
    pub merkleroot: String,
    pub time: u64,
    pub mediantime: u64,
    pub nonce: u64,
    pub bits: String,
    pub difficulty: f64,
    pub chainwork: String,
    pub nTx: u64,
    pub previousblockhash: String,
    pub nextblockhash: String,
    pub strippedsize: u64,
    pub size: u64,
    pub weight: u64,
    pub tx: Vec<String>,
}
#[derive(Deserialize)]
pub struct RpcBlock2Response {
    pub result: RpcBlock2Result,
}
#[derive(Deserialize)]
pub struct RpcBlock2Result {
    pub tx: Vec<RpcBlock2Tx>,
}
#[derive(Deserialize)]
pub struct RpcBlock2Tx {
    pub(crate) txid: String,
    pub(crate) fee: Option<f64>,
    pub(crate) vin: Option<Vec<Vin>>,
    pub(crate) vout: Option<Vec<Vout>>
}
#[derive(Deserialize)]
pub struct Vin {
    pub(crate) txid: Option<String>,
}
#[derive(Deserialize)]
pub struct Vout {
    pub(crate) value: Option<f32>
}
#[derive(Deserialize)]
pub struct RpcBlockCountResponse {
    pub(crate) result: u32
}
#[derive(Deserialize)]
pub struct RpcBlockchaininfoResponse {
    pub(crate) result: RpcBlockchaininfoResult
}
#[derive(Deserialize, Serialize)]
pub struct RpcBlockchaininfoResult {
    pub chain: String,
    pub blocks: u32,
    pub headers: u32,
    pub bestblockhash: String,
    pub difficulty: f32,
    pub time: u32,
    pub mediantime: u32,
    pub verificationprogress: f32,
    pub initialblockdownload: bool,
    pub chainwork: String,
    pub size_on_disk: f32,
    pub pruned: bool,
    pub warnings: Vec<String>,
}