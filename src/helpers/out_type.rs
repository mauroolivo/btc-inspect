use std::fmt;

pub enum OutputType {
    Unknown,
    P2pk,
    P2pkh,
    P2sh,
    P2wpkh,
    P2shP2wpkh,
    P2wsh,
    P2shP2wsh,
    P2tr,
    OpReturn
}
impl fmt::Display for OutputType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OutputType::Unknown => write!(f, "{}", "unknown"),
            OutputType::P2pk => write!(f, "{}", "p2pk"),
            OutputType::P2pkh => write!(f, "{}", "p2pkh"),
            OutputType::P2sh => write!(f, "{}", "p2sh"),
            OutputType::P2wpkh => write!(f, "{}", "v0_p2wpkh"),
            OutputType::P2shP2wpkh => write!(f, "{}", "p2sh-p2wpkh"),
            OutputType::P2wsh => write!(f, "{}", "p2wsh"),
            OutputType::P2shP2wsh => write!(f, "{}", "p2sh-p2wsh"),
            OutputType::P2tr => write!(f, "{}", "v1_p2tr"),
            OutputType::OpReturn => write!(f, "{}", "op_return"),
        }
    }
}