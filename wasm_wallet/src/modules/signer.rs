//! ## 서명과 관련된 기능 구현
//!
//! `sign_eth_message` -  일반 메시지 서명 (EIP-191)
//!
//! `sign_eip2612_permit` - Permit 서명
use ethers_core::types::transaction::eip712::TypedData;
use ethers_signers::{LocalWallet, Signer as EthSigner};
use serde_json::json;

use crate::modules::wallet::wallet_from_mnemonic;

/// ## 일반 메시지 서명 (EIP-191)
pub async fn sign_eth_message(
    mnemonic: &str,
    passphrase: &str,
    message: &str,
) -> Result<String, String> {
    let signing_key = wallet_from_mnemonic(mnemonic, passphrase).map_err(|e| e.to_string())?;
    let private_key_bytes = signing_key.to_bytes();
    let wallet = LocalWallet::from_bytes(&private_key_bytes).map_err(|e| e.to_string())?;
    let signature = wallet
        .sign_message(message)
        .await
        .map_err(|e| e.to_string())?;

    Ok(signature.to_string())
}

/// ## EIP-2612 Permit 서명
pub async fn sign_eip2612_permit(
    mnemonic: &str,
    passphrase: &str,
    owner: &str,
    spender: &str,
    value: u128,
    nonce: u64,
    deadline: u64,
    contract: &str,
    chain_id: u64,
) -> Result<String, String> {
    let signing_key = wallet_from_mnemonic(mnemonic, passphrase).map_err(|e| e.to_string())?;
    let wallet: LocalWallet = LocalWallet::from(signing_key).with_chain_id(chain_id);

    let typed_data_json = json!({
        "types": {
            "EIP712Domain": [
                { "name": "name", "type": "string" },
                { "name": "version", "type": "string" },
                { "name": "chainId", "type": "uint256" },
                { "name": "verifyingContract", "type": "address" }
            ],
            "Permit": [
                { "name": "owner", "type": "address" },
                { "name": "spender", "type": "address" },
                { "name": "value", "type": "uint256" },
                { "name": "nonce", "type": "uint256" },
                { "name": "deadline", "type": "uint256" }
            ]
        },
        "primaryType": "Permit",
        "domain": {
            "name": "MyToken",
            "version": "1",
            "chainId": chain_id,
            "verifyingContract": contract
        },
        "message": {
            "owner": owner,
            "spender": spender,
            "value": value,
            "nonce": nonce,
            "deadline": deadline
        }
    });

    let typed_data: TypedData =
        serde_json::from_value(typed_data_json).map_err(|e| e.to_string())?;

    let sig = wallet
        .sign_typed_data(&typed_data)
        .await
        .map_err(|e| e.to_string())?;

    Ok(sig.to_string())
}
