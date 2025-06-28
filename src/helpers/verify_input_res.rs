use crate::script::Script;

#[derive(Debug, Eq, PartialEq, Clone)]
pub struct VerifyInputRes {
    pub is_valid: bool,
    pub script_pubkey: Option<Script>,
    pub redeem_script: Option<Script> // to find p2wpkh nested in p2sh
}
impl VerifyInputRes {
    pub fn new(is_valid: bool, script_pubkey: Option<Script>, redeem_script: Option<Script>) -> Self {
        Self { is_valid, script_pubkey, redeem_script }
    }
}