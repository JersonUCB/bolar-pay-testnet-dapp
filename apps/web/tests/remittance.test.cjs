const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRemittance, transition } = require('../.test-build/domain/remittance.js');
const { settleRemittance } = require('../.test-build/application/settlement.js');
const { parseAmount, convertAmount } = require('../.test-build/lib/remittance-quote.js');
const initial = () => createRemittance('test', 10000, 'simulation');
const evidence = { mode: 'simulation', reference: 'DEMO-test', amount: '1', asset: 'fake' };
test('quote uses cents and accepts decimal comma without floating point parsing', () => {
  assert.equal(parseAmount('1,25'), 125); assert.equal(parseAmount('1.234'), null);
  assert.equal(convertAmount('10', 'send'), '23');
});
test('rejects negative, fractional, zero and excessive amounts', () => {
  for (const amount of [-1, 0, 1.5, 100001, NaN]) assert.throws(() => createRemittance('test', amount, 'simulation'));
});
test('pending and rejected KYC cannot receive deposits', () => {
  for (const scenario of ['pending', 'rejected']) {
    const run = transition(initial(), { type: 'verify', scenario });
    assert.throws(() => transition(run, { type: 'deposit' }));
  }
});
test('completed journey is ordered and duplicate events do not duplicate settlement', () => {
  let run = transition(initial(), { type: 'verify', scenario: 'approved' });
  run = transition(run, { type: 'deposit' });
  assert.strictEqual(transition(run, { type: 'deposit' }), run);
  run = transition(run, { type: 'settle', evidence });
  assert.strictEqual(transition(run, { type: 'settle', evidence }), run);
  run = transition(run, { type: 'payout' });
  assert.equal(run.status, 'completed'); assert.equal(run.bobCents, 23000); assert.equal(run.events.length, 5);
});
test('no payout before settlement and no refund after settlement', () => {
  assert.throws(() => transition(initial(), { type: 'payout' }));
  const deposited = transition(transition(initial(), { type: 'verify', scenario: 'approved' }), { type: 'deposit' });
  assert.equal(transition(deposited, { type: 'refund' }).status, 'refunded');
  assert.throws(() => transition(transition(deposited, { type: 'settle', evidence }), { type: 'refund' }));
});
test('rejects fabricated blockchain links in simulation and mainnet evidence', () => {
  const deposited = transition(transition(initial(), { type: 'verify', scenario: 'approved' }), { type: 'deposit' });
  assert.throws(() => transition(deposited, { type: 'settle', evidence: { ...evidence, explorerUrl: 'https://stellar.expert/explorer/public/tx/fake' } }));
  assert.throws(() => transition({ ...deposited, mode: 'soroban-testnet' }, { type: 'settle', evidence: { ...evidence, mode: 'soroban-testnet', explorerUrl: 'https://stellar.expert/explorer/public/tx/fake' } }));
});
test('application never calls adapter before deposit', async () => {
  let called = false;
  await assert.rejects(settleRemittance(initial(), { settle: async () => { called = true; return evidence; } }));
  assert.equal(called, false);
});
