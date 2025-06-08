#[macro_use]
use lazy_static::lazy_static;
use std::{collections::HashMap, sync::Mutex};

lazy_static! {
    pub static ref HASHMAP: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
}