use serde::Deserialize;

#[derive(Deserialize)]
pub struct RpcTxResponse {
    pub(crate) result: RpcTxResult,
}
#[derive(Deserialize)]
pub struct RpcTxResult {
    pub(crate) hex: String,
}