//! ## 라이브러리 엔트리포인트 (WASM)
//!
//! `#[wasm_bindgen]`을 통해 Rust 함수를 JS/TS에서 호출 가능하도록 export.
mod modules;
use wasm_bindgen::prelude::*;

use crate::modules::{mnemonic, signer, wallet};

// use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main_js() {
    console_error_panic_hook::set_once();
}

/// 니모닉 구문 생성
#[wasm_bindgen]
pub fn generate_new_mnemonic() -> Result<String, String> {
    mnemonic::generate_new_mnemonic()
        .map(|m| m.to_string())
        .map_err(|e| e.to_string())
}

/// 니모닉 + 패스프레이즈 => `Seed`
#[wasm_bindgen]
pub fn derive_seed_from_mnemonic(mnemonic: &str, passpharse: &str) -> Result<Vec<u8>, String> {
    mnemonic::derive_seed_from_mnemonic(mnemonic, passpharse)
        .map(|seed| seed.to_vec())
        .map_err(|e| e.to_string())
}

/// 니모닉과 패스프레이즈를 통한 이더리움 지갑 주소 생성 및 반환
#[wasm_bindgen]
pub fn get_eth_address(mnemonic: &str, passphrase: &str) -> Result<String, String> {
    let signing_key = wallet::wallet_from_mnemonic(mnemonic, passphrase)?;
    let address = wallet::get_eth_address(&signing_key);
    Ok(format!("{:?}", address))
}

/// EIP-191 표준 서명
#[wasm_bindgen]
pub async fn sign_eth_message(
    mnemonic: &str,
    passphrase: &str,
    message: &str,
) -> Result<String, String> {
    signer::sign_eth_message(mnemonic, passphrase, message).await
}

/// EIP-2612 Permit 서명
#[wasm_bindgen]
pub async fn sign_eip2612_permit(
    mnemonic: &str,
    passphrase: &str,
    owner: &str,
    spender: &str,
    value: f64,
    nonce: f64,
    deadline: f64,
    contract: &str,
    chain_id: f64,
) -> Result<String, String> {
    let value = value as u128;
    let nonce = nonce as u64;
    let deadline = deadline as u64;
    let chain_id = chain_id as u64;

    signer::sign_eip2612_permit(
        mnemonic, passphrase, owner, spender, value, nonce, deadline, contract, chain_id,
    )
    .await
}
