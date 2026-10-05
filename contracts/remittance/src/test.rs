use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{Client, StellarAssetClient},
};

fn setup(env: &Env) -> (Address, Address, Address, Address) {
    let network: BytesN<32> = env
        .crypto()
        .sha256(&Bytes::from_slice(env, TESTNET.as_bytes()))
        .into();
    env.ledger().with_mut(|info| {
        info.network_id = network.to_array();
        info.sequence_number = 10;
        info.max_entry_ttl = 6_312_000;
    });
    let admin = Address::generate(env);
    let sender = Address::generate(env);
    let recipient = Address::generate(env);
    let token = env.register_stellar_asset_contract_v2(admin).address();
    let contract = env.register(Remittance, (token.clone(),));
    env.mock_all_auths();
    StellarAssetClient::new(env, &token).mint(&sender, &20_000_000);
    (contract, token, sender, recipient)
}

#[test]
fn transfers_tokens_and_records_receipt() {
    let env = Env::default();
    let (contract, token, sender, recipient) = setup(&env);
    let id = BytesN::from_array(&env, &[1; 32]);
    let client = RemittanceClient::new(&env, &contract);
    let receipt = client.settle(&id, &sender, &recipient, &10_000_000);
    assert_eq!(Client::new(&env, &token).balance(&recipient), 10_000_000);
    assert_eq!(Client::new(&env, &token).balance(&sender), 10_000_000);
    assert_eq!(client.receipt(&sender, &id), Some(receipt));
}

#[test]
fn duplicate_cannot_transfer_twice() {
    let env = Env::default();
    let (contract, token, sender, recipient) = setup(&env);
    let id = BytesN::from_array(&env, &[2; 32]);
    let client = RemittanceClient::new(&env, &contract);
    client.settle(&id, &sender, &recipient, &10_000_000);
    assert_eq!(
        client.try_settle(&id, &sender, &recipient, &10_000_000),
        Err(Ok(Error::Duplicate))
    );
    assert_eq!(Client::new(&env, &token).balance(&recipient), 10_000_000);
}

#[test]
fn rejects_invalid_amount_and_same_account() {
    let env = Env::default();
    let (contract, _, sender, recipient) = setup(&env);
    let id = BytesN::from_array(&env, &[3; 32]);
    let client = RemittanceClient::new(&env, &contract);
    for amount in [-1, 0, 10_000_001] {
        assert_eq!(
            client.try_settle(&id, &sender, &recipient, &amount),
            Err(Ok(Error::InvalidAmount))
        );
    }
    assert_eq!(
        client.try_settle(&id, &sender, &sender, &1),
        Err(Ok(Error::SameAccount))
    );
}

#[test]
#[should_panic]
fn requires_sender_authorization() {
    let env = Env::default();
    let (contract, _, sender, recipient) = setup(&env);
    env.mock_auths(&[]);
    RemittanceClient::new(&env, &contract).settle(
        &BytesN::from_array(&env, &[4; 32]),
        &sender,
        &recipient,
        &1,
    );
}

#[test]
fn rejects_mainnet_network_id() {
    let env = Env::default();
    let (contract, _, sender, recipient) = setup(&env);
    let public: BytesN<32> = env
        .crypto()
        .sha256(&Bytes::from_slice(
            &env,
            b"Public Global Stellar Network ; September 2015",
        ))
        .into();
    env.ledger()
        .with_mut(|info| info.network_id = public.to_array());
    assert_eq!(
        RemittanceClient::new(&env, &contract).try_settle(
            &BytesN::from_array(&env, &[5; 32]),
            &sender,
            &recipient,
            &1
        ),
        Err(Ok(Error::WrongNetwork))
    );
}

#[test]
fn insufficient_balance_does_not_create_receipt() {
    let env = Env::default();
    let (contract, _, _, recipient) = setup(&env);
    let empty = Address::generate(&env);
    let id = BytesN::from_array(&env, &[6; 32]);
    let client = RemittanceClient::new(&env, &contract);
    assert!(client.try_settle(&id, &empty, &recipient, &1).is_err());
    assert_eq!(client.receipt(&empty, &id), None);
}
