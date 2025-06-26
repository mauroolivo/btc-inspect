use std::fmt;

pub enum OutputType {
    unknown,
    p2pk,
    p2pkh,
    p2sh,
    p2wpkh,
}
impl fmt::Display for OutputType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OutputType::unknown => write!(f, "{}", "unknown"),
            OutputType::p2pk => write!(f, "{}", "p2pk"),
            OutputType::p2pkh => write!(f, "{}", "p2pkh"),
            OutputType::p2sh => write!(f, "{}", "p2sh"),
            OutputType::p2wpkh => write!(f, "{}", "p2wpkh"),
        }
    }
}