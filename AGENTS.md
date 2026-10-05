# BOLAR testnet lab

- Explain decisions and progress in Spanish to the team.
- This is independent from `bolar-dapp`. Do not modify that repository or import its secrets.
- Read `README.md` and `docs/01-arquitectura.md` before changing architecture.
- Before editing Next.js code read relevant installed guides under `apps/web/node_modules/next/dist/docs/` and follow `apps/web/AGENTS.md`.
- Preserve the BOLAR landing's palette, typography and assets. Label all simulation clearly.
- Default mode has no external provider calls, real identity data or money movement.
- Only Stellar testnet is allowed. Keep network passphrase and RPC pinned. Never accept destination, amount, secret seed or network from the settlement HTTP request.
- `.local/` contains private test identities; never commit or print them. Do not inherit a developer's global Stellar identity/configuration.
- Domain logic must remain independent of React, CLI and provider SDKs. Monetary values are integer minor units.
- Require sender authorization and enforce duplicate receipt prevention atomically in the contract. Reuse an operation ID after uncertain submission; never turn a network error into simulated success.
- The CLI adapter is local single-process tooling. Do not deploy it publicly as a custodial service.
- Pollar/Bridge integration is a separate stage requiring confirmed sandbox credentials and documented capabilities. Do not relabel mock responses as provider results.
- Validate changed behavior: `npm test`, `npm run test:contracts`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run build:contracts` as appropriate. Report unverified network/UI steps explicitly.
- Do not add microservices, production custody or unrelated dependencies to a learning slice.
