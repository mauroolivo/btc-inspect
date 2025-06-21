use std::fmt;

pub enum OutputType {
    undef,
    p2pk,
    p2pkh,
    p2wpkh,
}
impl fmt::Display for OutputType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OutputType::undef => write!(f, "{}", "undef"),
            OutputType::p2pk => write!(f, "{}", "p2pk"),
            OutputType::p2pkh => write!(f, "{}", "p2pkh"),
            OutputType::p2wpkh => write!(f, "{}", "p2wpkh"),
        }
    }
}