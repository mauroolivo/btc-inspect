use crate::script::Script;

#[derive(Debug, Eq, PartialEq, Clone)]
pub struct VerifyInputRes {
    pub is_valid: bool,
    pub script_pubkey: Option<Script>
}
impl VerifyInputRes {
    pub fn new(is_valid: bool, script_pubkey: Option<Script>) -> Self {
        Self { is_valid, script_pubkey }
    }
}