use std::f32::consts::E;
use std::io::{Cursor, Error, ErrorKind};
use std::num::IntErrorKind;
use crate::tx::Tx;
use serde_json::json;
use crate::cache::HASHMAP;

pub struct TxFetcher {
    api_url: String,
    testnet: bool,
}

impl TxFetcher {
    pub fn new(testnet: bool) -> Self {
        TxFetcher{api_url: "https://blockstream.info/api".to_string(), testnet }
    }
    pub async fn fetch_async(&self, tx_id: &str) -> Result<Tx, reqwest::Error> {

        if self.testnet {
            panic!("Not implemented");
        }
        let url = format!("{}/tx/{}/hex", self.api_url, tx_id);

        let mut hashmap = HASHMAP.lock().unwrap();

        let data = hashmap.get(&tx_id.to_string());
        match data {
            Some(data) => {
                log::info!("RETURNING FROM CACHE: {:?}", tx_id);
                let raw_tx = hex::decode(data.clone()).unwrap();
                let mut stream = Cursor::new(raw_tx.clone());
                let mut tx = Tx::parse(&mut stream, false).unwrap();
                let mut tx_json = tx.tx_json();
                tx_json["hex"] = json!(data.clone());
                tx.tx_json = tx_json;
                let res = Ok::<Tx, reqwest::Error>(tx);
                res
            }
            _ => {
                // log::info!("{:#?}", hashmap);

                println!("{}", url);
                log::info!("FETCH: {:?}", tx_id);

                let client = reqwest::Client::new();
                let response = client
                    .get(url)
                    .send()
                    .await
                    .unwrap()
                    .text()
                    .await;
                match response {
                    Ok(result) => {
                        println!("{:#?}", result);
                        let raw_tx = hex::decode(result.clone()).unwrap();

                        log::info!("ADDING: {:#?}", tx_id);
                        let tid = tx_id;
                        let k = format!("{}", tid);
                        hashmap.insert(k.clone(), result.clone());

                        let mut stream = Cursor::new(raw_tx.clone());
                        let mut tx = Tx::parse(&mut stream, false).unwrap();
                        let mut tx_json = tx.tx_json();
                        tx_json["hex"] = json!(result);
                        tx.tx_json = tx_json;
                        Ok(tx)
                    }
                    Err(e) => {
                        println!("Error: {}", e);
                        Err(reqwest::Error::from(e))
                    }
                }


            }
        }


    }
    /*
    pub fn fetch_sync(&self, tx_id: &str) -> Result<Tx, reqwest::Error> {

        let url = format!("{}/tx/{}/hex", self.api_url, tx_id);
        println!("{}", url);
        let client = reqwest::blocking::Client::new();
        let response = client
            .get(url)
            .send()?
            .text();

        match response {
            Ok(result) => {
                println!("{:#?}", result);
                let raw_tx = hex::decode(result).unwrap();
                // coming soon segwit
                // if raw_tx[4] == 0 {
                //    raw_tx.remove(4);
                //    raw_tx.remove(4);
                // }
                let mut stream = Cursor::new(raw_tx);
                let tx = Tx::parse(&mut stream, self.testnet).unwrap();

                Ok(tx)
            }
            Err(e) => {
                println!("Error: {}", e);
                Err(reqwest::Error::from(e))
            }
        }
    }*/
}
#[cfg(test)]
mod tests {

    use super::*;
/*    #[ignore]
    #[tokio::test]
    async fn fetch_async_test() {
        // segwit testnet, to do c202201f6c18beb46710e5d3a46bd8775c57648cd9d7aef1be441d170ca8cdb5
        // main legacy 452c629d67e41baec3ac6f04fe744b4b9617f8f859c63b3002f8684e7a4fee03
        let tx_id = "ee51510d7bbabe28052038d1deb10c03ec74f06a79e21913c6fcf48d56217c87"; // main legacy
        let tf = TxFetcher::new(false);
        let result = tf.fetch_async(tx_id);

        match result.await {
            Ok(result) => {
                assert_eq!(result.tx_id(), tx_id);
            }
            Err(e) => {
                println!("Error: {}", e);
            }
        }
    }
    #[ignore]
    #[test]
    fn fetch_sync_test() {
        let tx_id = "ee51510d7bbabe28052038d1deb10c03ec74f06a79e21913c6fcf48d56217c87"; // main legacy
        let tf = TxFetcher::new(false);
        let result = tf.fetch_sync(tx_id);
        match result {
            Ok(result) => {
                assert_eq!(result.tx_id(), tx_id);
            }
            Err(e) => {
                println!("Error: {}", e);
            }
        }
    }*/
}