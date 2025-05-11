use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub struct Tx {
    id: String,
    raw: String
}
impl Tx {
    pub fn new(id: String, raw: String) -> Tx {
        Tx{id, raw}
    }
}
#[wasm_bindgen]
impl Tx {
    pub fn r_tx_raw(&self) -> String {
        self.raw.clone()
    }
}