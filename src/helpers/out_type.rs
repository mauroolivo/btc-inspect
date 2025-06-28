use std::fmt;

pub enum OutputType {
    unknown,
    p2pk,
    p2pkh,
    p2sh,
    p2wpkh,
    p2sh_p2wpkh,
    p2wsh,
    p2sh_p2wsh,
    p2tr,
    op_return
}
impl fmt::Display for OutputType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OutputType::unknown => write!(f, "{}", "unknown"),
            OutputType::p2pk => write!(f, "{}", "p2pk"),
            OutputType::p2pkh => write!(f, "{}", "p2pkh"),
            OutputType::p2sh => write!(f, "{}", "p2sh"),
            OutputType::p2wpkh => write!(f, "{}", "v0_p2wpkh"),
            OutputType::p2sh_p2wpkh => write!(f, "{}", "p2sh-p2wpkh"),
            OutputType::p2wsh => write!(f, "{}", "p2wsh"),
            OutputType::p2sh_p2wsh => write!(f, "{}", "p2sh-p2wsh"),
            OutputType::p2tr => write!(f, "{}", "v1_p2tr"),
            OutputType::op_return => write!(f, "{}", "op_return"),
        }
    }
}