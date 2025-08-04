use serde::Deserialize;

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
pub struct RpcBlockCountResponse {
    pub(crate) result: u32
}