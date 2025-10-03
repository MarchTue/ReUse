// src/modules/keys.rs
use bip32::{DerivationPath, XPrv};
use hex::ToHex;
use k256::ecdsa::SigningKey;
use k256::elliptic_curve::sec1; // <--- 수정: sec1만 임포트
use sha3::{Digest, Keccak256};

#[derive(Debug, Clone)]
pub enum KeyError {
    DerivationFailed(String),
    InvalidPrivateKey,
}

impl std::fmt::Display for KeyError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", self)
    }
}

/// 시드와 HD 경로로부터 서명 키를 파생합니다.
pub fn derive_signing_key_from_seed(seed: &[u8], path: &str) -> Result<SigningKey, KeyError> {
    let master_xprv = XPrv::new(seed).map_err(|e| KeyError::DerivationFailed(e.to_string()))?;
    let derivation_path: DerivationPath = path
        .parse()
        .map_err(|e| KeyError::DerivationFailed(e.to_string()))?;
    let derived_xprv = master_xprv
        .derive(&derivation_path)
        .map_err(|e| KeyError::DerivationFailed(e.to_string()))?;

    SigningKey::from_slice(derived_xprv.private_key().as_bytes())
        .map_err(|_| KeyError::InvalidPrivateKey)
}

/// 서명 키에서 공개키와 이더리움 주소를 추출합니다.
pub fn get_address_from_signing_key(signing_key: &SigningKey) -> (String, String) {
    let verifying_key = signing_key.verifying_key();
    let public_key_encoded = verifying_key.to_encoded_point(sec1::point::Compression::Uncompressed); // <--- 수정: `sec1::point`를 직접 사용

    let public_key_uncompressed = &public_key_encoded.as_bytes()[1..];
    let address_bytes = Keccak256::digest(public_key_uncompressed);
    let address = format!("0x{}", hex::encode(&address_bytes[12..]));

    (public_key_encoded.encode_hex::<String>(), address)
}
