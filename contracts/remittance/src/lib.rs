#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, token, Address, Bytes,
    BytesN, Env,
};

const TESTNET: &str = "Test SDF Network ; September 2015";
const MAX_AMOUNT: i128 = 10_000_000; // 1 XLM when initialized with the native SAC by setup-testnet.

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Token,
    Receipt(Address, BytesN<32>),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Receipt {
    pub sender: Address,
    pub recipient: Address,
    pub amount: i128,
    pub ledger: u32,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    WrongNetwork = 1,
    InvalidAmount = 2,
    SameAccount = 3,
    Duplicate = 4,
}

#[contractevent(topics = ["settled"])]
pub struct Settled {
    #[topic]
    pub id: BytesN<32>,
    pub sender: Address,
    pub recipient: Address,
    pub amount: i128,
}

fn require_testnet(env: &Env) -> Result<(), Error> {
    let expected: BytesN<32> = env
        .crypto()
        .sha256(&Bytes::from_slice(env, TESTNET.as_bytes()))
        .into();
    if env.ledger().network_id() != expected {
        return Err(Error::WrongNetwork);
    }
    Ok(())
}

#[contract]
pub struct Remittance;

#[contractimpl]
impl Remittance {
    pub fn __constructor(env: Env, token: Address) -> Result<(), Error> {
        require_testnet(&env)?;
        env.storage().instance().set(&DataKey::Token, &token);
        Ok(())
    }

    // Atomic token transfer + receipt. This does NOT certify PIX, KYC or a BOB payout.
    pub fn settle(
        env: Env,
        id: BytesN<32>,
        sender: Address,
        recipient: Address,
        amount: i128,
    ) -> Result<Receipt, Error> {
        require_testnet(&env)?;
        sender.require_auth();
        if amount <= 0 || amount > MAX_AMOUNT {
            return Err(Error::InvalidAmount);
        }
        if sender == recipient {
            return Err(Error::SameAccount);
        }
        let key = DataKey::Receipt(sender.clone(), id.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::Duplicate);
        }
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        token::Client::new(&env, &token).transfer(&sender, &recipient, &amount);
        let receipt = Receipt {
            sender: sender.clone(),
            recipient: recipient.clone(),
            amount,
            ledger: env.ledger().sequence(),
        };
        env.storage().persistent().set(&key, &receipt);
        // Archived entries must be restored; a testnet reset removes all guarantees.
        env.storage().persistent().extend_ttl(&key, 17_280, 120_960);
        env.storage().instance().extend_ttl(17_280, 120_960);
        Settled {
            id,
            sender,
            recipient,
            amount,
        }
        .publish(&env);
        Ok(receipt)
    }

    pub fn receipt(env: Env, sender: Address, id: BytesN<32>) -> Option<Receipt> {
        env.storage()
            .persistent()
            .get(&DataKey::Receipt(sender, id))
    }
}

#[cfg(test)]
mod test;
