mod utils;
mod load_transaction;

use wasm_bindgen::prelude::*;
use crate::load_transaction::Tx;
// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

#[wasm_bindgen]
pub fn r_uppercase(str: String) -> String {
    str.to_uppercase()
}
#[wasm_bindgen]
pub fn r_load_tx(id: String) -> Tx {
    Tx::new(id, "0200000001c0991c761944c46f6759a248c430c11469a1caed3ffc0941f984065558433f15000000006a4730440220013d94fb505f2a40e3a2ec03bae715d11b5603691b3c2f281997b9d7e5dd7407022001ab320c0e9cb29ba92695be46c372f7d3881dac641d5f96bd2e6b7ffedff36d012103938dc19b318fc549ca6dcbc85ec6d77e3006426d544a9aef2b48b30cb7beb76ffdffffff01e4d5c70100000000160014bdf69ce4a150aa1b689ea8397c7090907c62ddc800000000".to_string())
}