//! ## Wallet.rs  - 지갑과 관련된 기능 구현
//!
//! `wallet_from_mnemonic`  - 니모닉을 통한 지갑 생성
//!
//! `get_eth_address` - 지갑 주소 반환
use std::str::FromStr;

use bip32::{DerivationPath, XPrv};
use ethers_core::types::Address;
use k256::ecdsa::SigningKey;

use crate::modules::mnemonic::derive_seed_from_mnemonic;

/// ## 니모닉을 통한 지갑 생성
/// Ethereum 기본 경로 ([`m/44'/60'/0'/0/0`]) 사용
pub fn wallet_from_mnemonic(mnemonic: &str, passphrase: &str) -> Result<SigningKey, String> {
    let seed = derive_seed_from_mnemonic(mnemonic, passphrase).map_err(|e| e.to_string())?;

    let xprv = XPrv::derive_from_path(seed, &DerivationPath::from_str("m/44'/60'/0'/0/0").unwrap())
        .map_err(|e| e.to_string())?;

    let signing_key =
        SigningKey::from_bytes(&xprv.private_key().to_bytes()).map_err(|e| e.to_string())?;
    Ok(signing_key)
}

/// ## 지갑 주소 반환
pub fn get_eth_address(signing_key: &SigningKey) -> Address {
    use sha3::{Digest, Keccak256};

    let verify_key = signing_key.verifying_key();
    let pubkey = verify_key.to_encoded_point(false);
    let pubkey_bytes = pubkey.to_bytes();

    // eth 주소는 Keccak256의 마지막 20 바이트와 같다.
    let hash = Keccak256::digest(&pubkey_bytes[1..]);
    Address::from_slice(&hash[12..])
}
