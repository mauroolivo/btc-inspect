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
pub struct RpcBlockResponse0 {
    pub(crate) result: String,
}
// #[derive(Deserialize)]
// pub struct RpcBlockResult {
//     pub(crate) hash: String,
// }
