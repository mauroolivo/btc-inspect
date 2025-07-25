use chrono::{Utc, DateTime};
use std::{io::{Cursor, Read}};
use num::{pow, BigUint, ToPrimitive};
use crate::helpers::block_bits::bits_to_target;
use crate::helpers::endianness::{int_to_little_endian, little_endian_to_int};
use crate::helpers::hash256::hash256;
use num::Num;
use std::net::TcpStream;
use serde_json::json;
use crate::helpers::merkle_hash::merkle_root;
use crate::rpc_api::RpcApi;

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct Block {
    pub version: u32,
    pub prev_block: Vec<u8>,
    pub merkle_root: Vec<u8>,
    pub timestamp: u32,
    pub bits: Vec<u8>,
    pub nonce: Vec<u8>,
    pub tx_hashes: Vec<Vec<u8>>,
    pub(crate) block_json: serde_json::Value,
}
impl Block {
    pub fn new(version: u32, prev_block: Vec<u8>, merkle_root: Vec<u8>, timestamp: u32, bits: Vec<u8>, nonce: Vec<u8>) -> Self {
        Block {
            version, prev_block, merkle_root, timestamp, bits, nonce, tx_hashes: Vec::new(), block_json: json!({}),
        }
    }
    pub async fn new_from_id(block_id_str: String, testnet: bool) -> Option<Self>  {
        let block_id = block_id_str.as_str();
        let api = RpcApi::new(testnet);
        let block_unwrapped = api.get_block(block_id).await;

        match block_unwrapped {
            Ok(block) => Some(block),
            Err(_) => None
        }
    }
    pub fn block_json(&self) -> serde_json::Value {
        self.block_json.clone()
    }
    pub fn parse_tcp(stream: &mut TcpStream) -> Result<Self, std::io::Error> {
        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let version = little_endian_to_int(buffer.as_slice()).to_u32().unwrap();
        let mut buffer = [0; 32];
        stream.read(&mut buffer)?;
        let mut prev_block = buffer.to_vec();
        prev_block.reverse();
        let mut buffer = [0; 32];
        stream.read(&mut buffer)?;
        let mut merkle_root = buffer.to_vec();
        merkle_root.reverse();
        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let timestamp = little_endian_to_int(buffer.as_slice()).to_u32().unwrap();

        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let bits = buffer.to_vec();
        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let nonce = buffer.to_vec();

        Ok(Block::new(version, prev_block, merkle_root, timestamp, bits, nonce))
    }
    pub fn parse(stream: &mut Cursor<Vec<u8>>) -> Result<Self, std::io::Error> {
        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let version = little_endian_to_int(buffer.as_slice()).to_u32().unwrap();
        let mut buffer = [0; 32];
        stream.read(&mut buffer)?;
        let mut prev_block = buffer.to_vec();
        prev_block.reverse();
        let mut buffer = [0; 32];
        stream.read(&mut buffer)?;
        let mut merkle_root = buffer.to_vec();
        merkle_root.reverse();
        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let timestamp = little_endian_to_int(buffer.as_slice()).to_u32().unwrap();

        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let bits = buffer.to_vec();
        let mut buffer = [0; 4];
        stream.read(&mut buffer)?;
        let nonce = buffer.to_vec();

        Ok(Block::new(version, prev_block, merkle_root, timestamp, bits, nonce))
    }
    pub fn serialize(&self) -> Vec<u8> {
        // Returns the 80 byte block header
        let mut result = Vec::new();
        result.extend(int_to_little_endian(BigUint::from(self.version), 4));
        let mut prev_block = self.prev_block.clone();
        prev_block.reverse();
        result.extend(&prev_block);
        let mut merkle_root = self.merkle_root.clone();
        merkle_root.reverse();
        result.extend(&merkle_root);
        result.extend(int_to_little_endian(BigUint::from(self.timestamp), 4));
        result.extend(self.bits.clone());
        result.extend(self.nonce.clone());
        result
    }
    pub fn hash(&self) -> Vec<u8> {
        let bytes = self.serialize();
        let mut hash = hash256(&bytes);
        hash.reverse();
        hash.to_vec()
    }
    pub fn bip_readiness_check(&self, n: u32) -> Option<bool> {
        match n {
            9 => {
                Some(self.version >> 29 == 0b001)
            }
            91 => {
                let shift = self.version >> 4;
                Some(shift & 1 == 1)
            }
            141 => { //segwit
                let shift = self.version >> 1;
                Some(shift & 1 == 1)
            }
            341 => { //taproot
                let shift = self.version >> 2;
                println!("{:?}", shift.to_le_bytes());
                Some(shift & 1 == 1)
            }
            _ => None
        }
    }
    pub fn time_to_date(&self) -> DateTime<Utc> {
        DateTime::from_timestamp(self.timestamp as i64, 0).unwrap()
    }
    pub fn target(&self) -> BigUint {
        bits_to_target(&self.bits)
    }
    pub fn difficulty(&self) -> BigUint {
        // Returns the block difficulty based on the bits
        // lowest difficulty has bits that equal 0xffff001d
        let exponent = self.bits[self.bits.len() - 1];
        let coefficient = little_endian_to_int(&self.bits[0..self.bits.len() - 1]);
        let target = coefficient * BigUint::from(pow(BigUint::from(256u32), exponent as usize - 3));
        let exponent_lowest = 0x1dusize;
        let coefficient_lowest = BigUint::from_str_radix("ffff", 16).unwrap();
        let target_lowest = coefficient_lowest * BigUint::from(pow(BigUint::from(256u32), exponent_lowest - 3));
        target_lowest / target
    }
    pub fn check_pow(&self) -> bool {
        let proof = little_endian_to_int(&hash256(self.serialize().as_slice()));
        proof < self.target()
    }
    pub fn validate_merkle_root(&mut self) -> bool {
        let mut hashes = Vec::new();
        for h in self.tx_hashes.iter_mut() {
            h.reverse();
            hashes.push(h.clone());
        }
        let mut root = merkle_root(hashes);
        root.reverse();
        root == self.merkle_root
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use num::Num;
    use num::traits::Euclid;
    use crate::helpers::block_bits::{calculate_new_bits, target_to_bits, TWO_WEEKS};

    #[test]
    fn test_parse_block() {
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw);
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.version, 0x20000002);
        let want = hex::decode("000000000000000000fd0c220a0a8c3bc5a7b487e8c8de0dfa2373b12894c38e").unwrap();
        assert_eq!(block.prev_block, want);
        let want = hex::decode("be258bfd38db61f957315c3f9e9c5e15216857398d50402d5089a8e0fc50075b").unwrap();
        assert_eq!(block.merkle_root, want);
        assert_eq!(block.timestamp, 0x59a7771e);
        let want = hex::decode("e93c0118").unwrap();
        assert_eq!(block.bits, want);
        let want = hex::decode("a4ffd71d").unwrap();
        assert_eq!(block.nonce, want);
    }
    #[test]
    fn test_block_serialize() {
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.serialize(), block_raw);
    }
    #[test]
    fn test_hash() {
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        let hash = block.hash();
        let hash = hex::encode(hash);
        println!("{:?}", hash);
        assert_eq!(hash, "0000000000000000007e9e4c586439b0cdbe13b1370bdd9435d76a644d047523");
    }
    #[test]
    fn test_bip_9() {
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(9).unwrap(), true);
        let block_raw = hex::decode("0400000039fa821848781f027a2e6dfabbf6bda920d9ae61b63400030000000000000000ecae536a304042e3154be0e3e9a8220e5568c3433a9ab49ac4cbb74f8df8e8b0cc2acf569fb9061806652c27").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(9).unwrap(), false);
    }
    #[test]
    fn test_bip_91() {
        let block_raw = hex::decode("1200002028856ec5bca29cf76980d368b0a163a0bb81fc192951270100000000000000003288f32a2831833c31a25401c52093eb545d28157e200a64b21b3ae8f21c507401877b5935470118144dbfd1").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(91).unwrap(), true);
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(91).unwrap(), false);
    }
    #[test]
    fn test_bip_141() {
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(141).unwrap(), true);
        let block_raw = hex::decode("0000002066f09203c1cf5ef1531f24ed21b1915ae9abeb691f0d2e0100000000000000003de0976428ce56125351bae62c5b8b8c79d8297c702ea05d60feabb4ed188b59c36fa759e93c0118b74b2618").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(141).unwrap(), false);
    }
    #[test]
    fn test_bip_341() {
        let block_raw = hex::decode("04002020ccbcc674693ef8751c939c0e6d4728dde62e24fc12370100000000000000000077ec1447375fc68029ab7a85fd6989c5d31351b619e8f709de682008103bda6a6f9b9061ea690c1702730f54").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert_eq!(block.bip_readiness_check(341).unwrap(), true);
    }
    #[test]
    fn test_time_to_datetime() {
        let block_raw = hex::decode("04002020ccbcc674693ef8751c939c0e6d4728dde62e24fc12370100000000000000000077ec1447375fc68029ab7a85fd6989c5d31351b619e8f709de682008103bda6a6f9b9061ea690c1702730f54").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        println!("{}", block.time_to_date())
    }
    #[test]
    fn test_target() {
        let block_raw = hex::decode("020000208ec39428b17323fa0ddec8e887b4a7c53b8c0a0a220cfd0000000000000000005b0750fce0a889502d40508d39576821155e9c9e3f5c3157f961db38fd8b25be1e77a759e93c0118a4ffd71d").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        let target = format!("{:0>64}", "13ce9000000000000000000000000000000000000000000");
        println!("{}", BigUint::from_str_radix(target.as_str(), 16).unwrap());
        println!("{}", target);
        let hash = block.hash();
        let hash = hex::encode(hash);
        let hash = format!("{:0>64}", hash);
        println!("{}", hash);
        assert_eq!(block.target(), BigUint::from_str_radix(target.as_str(), 16).unwrap());
        assert_eq!(block.difficulty(), BigUint::from(888171856257u64));
    }
    #[test]
    fn test_check_pow() {
        let block_raw = hex::decode("04000000fbedbbf0cfdaf278c094f187f2eb987c86a199da22bbb20400000000000000007b7697b29129648fa08b4bcd13c9d5e60abb973a1efac9c8d573c71c807c56c3d6213557faa80518c3737ec1").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert!(block.check_pow());
        let block_raw = hex::decode("04000000fbedbbf0cfdaf278c094f187f2eb987c86a199da22bbb20400000000000000007b7697b29129648fa08b4bcd13c9d5e60abb973a1efac9c8d573c71c807c56c3d6213557faa80518c3737ec0").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();
        assert!(!block.check_pow());
    }
    #[test]
    fn test_target_to_bits() {
        let block_raw = hex::decode("02000020f1472d9db4b563c35f97c428ac903f23b7fc055d1cfc26000000000000000000b3f449fcbe1bc4cfbcb8283a0d2c037f961a3fdf2b8bedc144973735eea707e1264258597e8b0118e5f00474").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block = Block::parse(&mut cursor).unwrap();

        println!("{:?}", &block.bits);
        println!("{:?}", hex::encode(&block.bits));
        println!("{:?}", &block.target());
        println!("{:?}", bits_to_target(&block.bits));
        let res = target_to_bits(&block.target());
        println!("{:?}", res);
        println!("{:?}", hex::encode(&res));
        println!("{:?}", bits_to_target(&target_to_bits(&block.target())));
    }
    #[test]
    fn test_new_bits() {
        let block_raw = hex::decode("000000203471101bbda3fe307664b3283a9ef0e97d9a38a7eacd8800000000000000000010c8aba8479bbaa5e0848152fd3c2289ca50e1c3e58c9a4faaafbdf5803c5448ddb845597e8b0118e43a81d3").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block1 = Block::parse(&mut cursor).unwrap();
        let block_raw = hex::decode("02000020f1472d9db4b563c35f97c428ac903f23b7fc055d1cfc26000000000000000000b3f449fcbe1bc4cfbcb8283a0d2c037f961a3fdf2b8bedc144973735eea707e1264258597e8b0118e5f00474").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let block2 = Block::parse(&mut cursor).unwrap();
        let mut time_diff = block2.timestamp - block1.timestamp;
        assert_eq!(time_diff, 1214793);
        if time_diff > TWO_WEEKS * 4 {
            time_diff = TWO_WEEKS * 4
        }
        if time_diff < TWO_WEEKS.div_euclid(4) {
            time_diff = TWO_WEEKS.div_euclid(4);
        }
        println!("{:?}", block1.target());
        let new_target = (block1.target() * time_diff).div_euclid(&(BigUint::from(TWO_WEEKS)));
        println!("{:?}", &new_target);
        let bits = target_to_bits(&new_target);
        println!("{:?}", &bits);
        assert_eq!(hex::encode(bits),"308d0118")
    }
    #[test]
    pub fn test_calculate_new_bits() {
        let prev_bits = hex::decode("54d80118").unwrap();
        let time_differential = 302400u32;
        let want = hex::decode("00157617").unwrap();
        assert_eq!(calculate_new_bits(prev_bits, time_differential), want);
    }
    #[test]
    fn test_validate_merkle_root() {
        let hashes_hex = [
            "f54cb69e5dc1bd38ee6901e4ec2007a5030e14bdd60afb4d2f3428c88eea17c1",
            "c57c2d678da0a7ee8cfa058f1cf49bfcb00ae21eda966640e312b464414731c1",
            "b027077c94668a84a5d0e72ac0020bae3838cb7f9ee3fa4e81d1eecf6eda91f3",
            "8131a1b8ec3a815b4800b43dff6c6963c75193c4190ec946b93245a9928a233d",
            "ae7d63ffcb3ae2bc0681eca0df10dda3ca36dedb9dbf49e33c5fbe33262f0910",
            "61a14b1bbdcdda8a22e61036839e8b110913832efd4b086948a6a64fd5b3377d",
            "fc7051c8b536ac87344c5497595d5d2ffdaba471c73fae15fe9228547ea71881",
            "77386a46e26f69b3cd435aa4faac932027f58d0b7252e62fb6c9c2489887f6df",
            "59cbc055ccd26a2c4c4df2770382c7fea135c56d9e75d3f758ac465f74c025b8",
            "7c2bf5687f19785a61be9f46e031ba041c7f93e2b7e9212799d84ba052395195",
            "08598eebd94c18b0d59ac921e9ba99e2b8ab7d9fccde7d44f2bd4d5e2e726d2e",
            "f0bb99ef46b029dd6f714e4b12a7d796258c48fee57324ebdc0bbc4700753ab1",
        ];
        let mut hashes: Vec<Vec<u8>> = vec![];
        for h in hashes_hex {
            hashes.push(hex::decode(h).unwrap());
        }
        let block_raw = hex::decode("00000020fcb19f7895db08cadc9573e7915e3919fb76d59868a51d995201000000000000acbcab8bcc1af95d8d563b77d24c3d19b18f1486383d75a5085c4e86c86beed691cfa85916ca061a00000000").unwrap();
        let mut cursor = Cursor::new(block_raw.clone());
        let mut block = Block::parse(&mut cursor).unwrap();
        block.tx_hashes = hashes;
        assert!(block.validate_merkle_root())
    }
}
