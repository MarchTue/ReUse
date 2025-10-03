//! ## 니모닉 생성 및 시드 파생 구현
//!
//! `generate_new_mnemonic` - 니모닉 구문 생성
//!
//! `derive_seed_from_mnemonic` - 니모닉 문자열과 암호를 통한 시드 파생
use bip39::Mnemonic;
use std::str::FromStr;
/// ## 12단어 니모닉 구문을 생성.
pub fn generate_new_mnemonic() -> Result<Mnemonic, bip39::Error> {
    Mnemonic::generate(12)
}

/// ## 니모닉 문자열과 암호를 통한 시드 파생
pub fn derive_seed_from_mnemonic(
    mnemonic_str: &str,
    passphrase: &str,
) -> Result<[u8; 64], bip39::Error> {
    let mnemonic = Mnemonic::from_str(mnemonic_str)?;
    Ok(mnemonic.to_seed(passphrase))
}
