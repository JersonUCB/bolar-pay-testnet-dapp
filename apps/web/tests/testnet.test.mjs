import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateManifest, receiptId, settleOnTestnet, assertLocalRequest, TESTNET_PASSPHRASE, RPC } from '../server/stellar-cli.mjs';
const sender = 'G' + 'A'.repeat(55), recipient = 'G' + 'B'.repeat(55);
const config = { network: 'testnet', passphrase: TESTNET_PASSPHRASE, rpc: RPC, asset: 'XLM', sender, recipient, contractId: 'C' + 'A'.repeat(55) };
test('rejects every override to mainnet and arbitrary RPC', () => {
  for (const patch of [{ network: 'mainnet' }, { rpc: 'https://attacker.example' }, { passphrase: 'Public Global Stellar Network ; September 2015' }]) assert.throws(() => validateManifest({ ...config, ...patch }));
});
test('rejects invalid references and cross-origin submissions', () => {
  assert.throws(() => receiptId('../../file'));
  assert.throws(() => assertLocalRequest(new Request('http://localhost:3100/api/testnet/settle', { headers: { host: 'localhost:3100', origin: 'https://attacker.example', 'content-type': 'application/json' } })));
  assert.throws(() => assertLocalRequest(new Request('https://bolar.lat/api/testnet/settle', { headers: { host: 'bolar.lat', origin: 'https://bolar.lat', 'content-type': 'application/json' } })));
});
test('submission timeout is reconciled with the same receipt; retry does not send twice', async () => {
  const root = await mkdtemp(join(tmpdir(), 'bolar-test-'));
  try {
    await mkdir(join(root, '.local'));
    await writeFile(join(root, '.local/testnet.json'), JSON.stringify(config));
    let transfers = 0;
    const invoke = async (_root, args) => {
      if (args[0] === 'keys') return sender;
      assert.ok(args.includes(RPC)); assert.ok(args.includes(TESTNET_PASSPHRASE));
      if (args.includes('settle')) { transfers++; throw new Error('response lost'); }
      return transfers ? JSON.stringify({ sender, recipient, amount: '10000000', ledger: 100 }) : 'null';
    };
    const id = 'a6ac3b42-a4a5-4e0e-8a1a-7195d000cbbc';
    assert.equal((await settleOnTestnet(root, id, invoke)).mode, 'soroban-testnet');
    await settleOnTestnet(root, id, invoke);
    assert.equal(transfers, 1);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('allows the exact browser origin when Next reconstructs the loopback URL', () => {
  for (const host of ['127.0.0.1:3100', 'localhost:3100', '[::1]:3100']) {
    assert.doesNotThrow(() => assertLocalRequest(new Request('http://localhost:3100/api/testnet/settle', {
      headers: { host, origin: `http://${host}`, 'content-type': 'application/json' },
    })));
  }
});
test('rejects nonlocal hosts, cross-origin ports, missing headers and non-JSON requests', () => {
  const base = { host: '127.0.0.1:3100', origin: 'http://127.0.0.1:3100', 'content-type': 'application/json' };
  for (const patch of [
    { host: 'attacker.example:3100', origin: 'http://attacker.example:3100' },
    { host: '127.0.0.1:3100.attacker.example' },
    { host: '127.0.0.1:3100/path' },
    { host: '127.0.0.1:3101', origin: 'http://127.0.0.1:3101' },
    { origin: 'http://localhost:3100' },
    { origin: 'http://127.0.0.1:3101' },
    { origin: 'null' },
    { host: '' },
    { origin: '' },
    { 'content-type': 'text/plain' },
  ]) {
    assert.throws(() => assertLocalRequest(new Request('http://localhost:3100/api/testnet/settle', { headers: { ...base, ...patch } })));
  }
});
