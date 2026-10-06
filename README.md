# BOLAR · laboratorio de remesas

Proyecto independiente para aprender y probar el flujo de BOLAR sin depósitos bancarios reales. Conserva la landing, los colores y los recursos del proyecto original. No está conectado a `bolar.lat`.

## Qué funciona

- Landing Next.js + React + Tailwind y recorrido interactivo con datos ficticios.
- Simulación de verificación aprobada, pendiente y rechazada; depósito, transferencia, entrega y devolución.
- Contrato Soroban que autoriza una transferencia de tokens y guarda un recibo para impedir repetirla con el mismo identificador.
- Preparación y adaptador local para ejecutar ese contrato exclusivamente en Stellar testnet, transfiriendo **1 XLM de prueba**, independientemente del importe BRL ilustrativo.
- Pruebas del dominio, del adaptador y del contrato.

**PIX, KYC y entrega BOB están simulados en ambos modos. No hay conversión BRL/USDC ni USDC real. Pollar y Bridge todavía no están conectados a este laboratorio.**

## Iniciar

Requiere Node.js 20.9 o superior compatible con Next 16 y npm. Desde esta carpeta:

```sh
npm ci --prefix apps/web
npm run dev
```

Abre <http://127.0.0.1:3100>. Pulsa **Entrar al laboratorio**, introduce entre 1 y 1.000 BRL ficticios y pulsa **Probar envío**. No necesitas `.env`, Google, CPF ni una cuenta bancaria.

La instalación limpia con `npm ci --prefix apps/web` fue verificada el 6 de octubre de 2026, después de sincronizar el lockfile con las dependencias declaradas.

## Ejecutar el tramo blockchain

Requiere Rust, el target `wasm32v1-none`, Stellar CLI y conexión a la testnet pública. La implementación se compiló con SDK 27.0.6 y Stellar CLI 28.0.0.

```sh
rustup target add wasm32v1-none
npm run build:contracts
npm run testnet:setup
npm run dev
```

El script genera dos identidades nuevas dentro de `.local/stellar`, solicita fondos ficticios a Friendbot y despliega el contrato con el token nativo. Después selecciona **Soroban testnet** en el modal. Nunca importes semillas ni archivos `.env` de producción.

Las claves locales son exclusivamente de laboratorio, no una solución de custodia para clientes. El servidor escucha solamente en `127.0.0.1`. No publiques este ejecutor local de transacciones en un hosting.

## Estructura

```text
apps/web/                  Next.js: landing y laboratorio
  domain/                  Estados y reglas del recorrido
  application/             Caso de uso y contrato del adaptador
  infrastructure/          Simulación y petición al ejecutor testnet
  server/                  Stellar CLI, red fija y recibos
contracts/remittance/      Contrato Rust + pruebas
scripts/                   Preparación de cuentas y despliegue testnet
docs/                      Decisiones, etapas, prompts y verificación
```

## Recorrido de aprendizaje

1. [Arquitectura y por qué](docs/01-arquitectura.md).
2. [Etapas y estado real](docs/02-etapas.md).
3. [Prompts para continuar](docs/03-prompts.md).
4. [Pruebas manuales y automatizadas](docs/04-pruebas.md).
5. [Pollar, Bridge y alcance del piloto](docs/05-proveedores.md).
6. [Referencias y procedencia](docs/REFERENCIAS.md).
7. [Guía práctica, evidencia testnet y comparación con el repositorio original](docs/07-guia-practica-y-comparacion.md).

## Verificación del 6 de octubre de 2026

Pasaron lint, TypeScript, 12 pruebas web/servidor, 6 pruebas Rust, build de Next.js y compilación WASM. Se revisaron los recorridos de simulación en navegador, el cierre con teclado y vistas de escritorio/móvil. Se desplegó el contrato y se confirmó una transferencia de 1 XLM de prueba en la testnet pública, con recibo y saldos verificados. El duplicado se rechazó en simulación RPC sin enviar otra transacción. La [guía práctica](docs/07-guia-practica-y-comparacion.md) incluye la evidencia y sus límites. Pollar, Bridge y la entrega bancaria siguen pendientes.

```sh
npm run check
npm run build:contracts
```

Este repositorio es un laboratorio técnico. Una demostración completada aquí no demuestra que un cliente sea elegible para PIX ni que haya recibido dinero en Bolivia.
