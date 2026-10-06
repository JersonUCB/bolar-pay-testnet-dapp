# Guía práctica: simulador, Soroban testnet y repositorio original

Verificación realizada el 6 de octubre de 2026. Proyecto local: `/Users/jersonalangarciavacaflor/bolar-pay-testnet-dapp`. El repositorio original `bolarpay/bolar-dapp` se inspeccionó en su copia local, commit `436bd2a`, sin modificarlo ni ejecutar sus pagos. No se inspeccionaron sus credenciales ni se confirmó su configuración remota actual.

## 1. Abrir el laboratorio

Desde la carpeta de este proyecto:

```sh
npm run dev
```

Abrir http://127.0.0.1:3100. Si ya está ejecutándose en VS Code, usar esa sesión; iniciar otra en el mismo puerto produce `EADDRINUSE`. Las dependencias ya están instaladas. Para una copia nueva, ejecutar primero `npm ci --prefix apps/web`.

La franja superior debe decir **LABORATORIO TESTNET**. Entrar al laboratorio solo habilita la demostración: no inicia una sesión de Pollar ni verifica la identidad de una persona.

## 2. Completar una simulación

1. Introducir **100 BRL**. La calculadora mostrará **230 BOB** con una tasa ilustrativa fija, sin cotización externa ni comisiones.
2. Pulsar **Probar envío** y elegir **Simulación completa**.
3. Pulsar **Continuar con datos ficticios**. Aparecen Alex Demo y Camila Demo; no hacen falta datos personales.
4. Elegir **Aprobada** y pulsar **Simular verificación**. Esto representa una respuesta ficticia de verificación, no KYC realizado por un proveedor.
5. Comprobar **PIX SIMULADO / NO ESCANEAR / NO PAGAR**. Pulsar **Simular depósito PIX recibido** solo cambia el estado del laboratorio.
6. Pulsar **Simular transferencia**. La referencia comienza por `DEMO-`; no hay transacción ni enlace a blockchain.
7. Pulsar **Simular entrega bancaria en Bolivia**. El resultado dice **230 BOB simulados**. Ninguna cuenta bancaria recibe fondos.
8. Cerrar con Escape o con el botón. El foco del teclado vuelve a **Probar envío**.

## 3. Probar los casos alternativos

| Caso | Acciones | Resultado esperado y observado |
|---|---|---|
| Revisión pendiente | Elegir En revisión y simular verificación | El depósito no aparece. Se puede cambiar a Aprobada y continuar. |
| Identidad rechazada | Elegir Rechazada y simular verificación | No se habilita depósito; cerrar e iniciar otra prueba. |
| Devolución | Aprobar, simular depósito y elegir Probar devolución antes de transferir | Termina como devolución simulada; no se ejecuta la transferencia. |
| Importe cero | Escribir 0 y pulsar Probar envío | Se solicita un importe mayor que cero. |
| Importe superior al límite | Escribir 1001, abrir el diálogo y continuar | Se muestra el límite entre 1 y 1000 BRL ficticios. |
| Navegación por teclado | Abrir con Enter y cerrar con Escape | El foco regresa al botón que abrió el diálogo. |

Los recorridos y el recibo se revisaron en navegador; se inspeccionó el diálogo en 1440 × 900 y 390 × 844, sin desbordamiento horizontal en las vistas revisadas. Esto no sustituye una auditoría completa de accesibilidad ni pruebas en todos los navegadores.

## 4. Transferir en Stellar testnet

En esta máquina **ya se ejecutaron** las pruebas Rust, la compilación WASM y `npm run testnet:setup`. Se crearon dos cuentas exclusivas de laboratorio y se desplegó un contrato. La configuración y las identidades privadas permanecen en `.local/`, fuera de Git.

Para otra máquina, después de instalar las herramientas necesarias:

```sh
rustup target add wasm32v1-none
npm run test:contracts
npm run build:contracts
npm run testnet:setup
npm run dev
```

El script conserva una configuración existente. No hace falta repetir el despliegue para cada envío. Si testnet se reinicia, consultar el procedimiento de respaldo en [Pruebas](04-pruebas.md).

Para repetir desde la interfaz:

1. Cerrar cualquier prueba anterior y abrir **Probar envío**.
2. Elegir **Soroban testnet · transferir 1 XLM de prueba**.
3. Completar los mismos pasos ficticios de identidad y depósito.
4. Pulsar **Transferir 1 XLM en testnet** y esperar el recibo. El navegador pide al servidor local que firme con la cuenta del laboratorio; no aparece una autorización de Pollar.
5. Comprobar el recibo y el enlace al contrato. El importe es siempre **1 XLM de prueba**, aunque se hayan escrito 100 o 500 BRL. No representa una conversión BRL/XLM/BOB.
6. La entrega final en Bolivia sigue siendo un botón de simulación.

Cerrar y abrir otra prueba genera otro identificador y permite otra transferencia. Si hay una confirmación incierta, reintentar en el mismo diálogo; no empezar una operación distinta para resolver la anterior.

## 5. Evidencia obtenida

- Contrato: `CAQM2X5GTKUW5NLCUZHWARZOCSYNP3UUMKJNHH6XUAE6JZUMNANJUY7Q`.
- [Transacción exitosa en testnet](https://stellar.expert/explorer/testnet/tx/455788d671a1a1c87eac26cf0a0ac3d61457a08f8b1e2601c5c141874bff0458).
- Ledger: `5060873`.
- Recibo: `8e26f398cf129aad34286de6f060383b9817f13b61ed1cc3f7e23738fc4c15d8`.
- Destinatario: **10000.0000000 → 10001.0000000 XLM de prueba**.
- Remitente: **9997.8984571 → 9996.8783671 XLM de prueba**. La diferencia es 1 XLM más 0.0200900 XLM de comisión de esta transacción; no es una tarifa fija prometida.
- El mismo identificador se volvió a evaluar contra el contrato con `--send no`: la simulación RPC rechazó el duplicado con `Error(Contract, #4)` y no cambió saldos ni secuencias. No se envió una segunda transacción para esta comprobación.

El adaptador también tiene una prueba automática con CLI ficticia que verifica la reutilización del recibo tras perder una respuesta. Eso es distinto de la comprobación pública de duplicado descrita arriba; no se simuló una caída real de red durante esta transferencia.

[Datos públicos de la verificación](evidence/2026-10-06-testnet.json) · [Captura de escritorio](evidence/2026-10-06-desktop.jpg) · [Captura móvil](evidence/2026-10-06-mobile.jpg).

## 6. Comparación con el otro repositorio

El nombre de una rama `main` no determina la red blockchain. En el repositorio original, la aplicación usa la red que entrega la configuración de Pollar; revisar el código no demuestra por sí solo que la sesión o el despliegue actual usen mainnet.

| Función | Este laboratorio | Copia local de `bolar-dapp` revisada |
|---|---|---|
| Diseño y stack | Landing BOLAR, Next.js, React y Tailwind | Misma base visual y tecnológica |
| Cálculo BRL/BOB | Tasa ilustrativa 1:2,3 | También es ilustrativa; no consulta una cotización real |
| Entrada | Botón local sin autenticación | Integra Pollar; el recorrido puede pedir login con Google según configuración |
| Datos de destinatario | Personajes ficticios | Pide nombre, motivo e imagen de QR; la imagen queda en el navegador y no se valida el contenido del QR |
| Identidad/KYC | Selector Aprobada/Pendiente/Rechazada | La lógica consulta autenticación y `verified` de Pollar; esto no demuestra KYC bancario ni elegibilidad PIX |
| Depósito PIX | Evento simulado | QR de demostración; finalizar no verifica un depósito |
| Transferencia | Simulación o contrato Soroban que envía 1 XLM testnet | Botón separado que llama `runTx("payment")` para 10 USDC, con emisor y destino configurados |
| Firma | CLI local con identidad exclusiva del laboratorio | Flujo de transacción proporcionado por Pollar |
| Contrato de remesa | Transferencia atómica y recibo que bloquea identificadores repetidos | No se encontró una invocación de este contrato en el flujo revisado; el botón de USDC usa otra vía |
| Red | Testnet fijada tanto en adaptador como en contrato | Depende de la configuración de Pollar; no se cambió ni ejecutó en esta revisión |
| Entrega BOB | Simulada | La pantalla final declara que no se envió dinero ni se verificó depósito |
| Bridge | Sin integración | No se encontraron llamadas directas a Bridge en el código de la aplicación revisado; eso no permite afirmar qué servicios usa Pollar internamente |

Por tanto, pasar las pruebas de este laboratorio no valida automáticamente el botón de 10 USDC del otro repositorio: cambian el activo, la firma, la integración y la operación blockchain.

## 7. Qué cambia entre testnet y mainnet

En Stellar, ambas redes permiten probar transacciones, firmas, contratos, saldos y comisiones. Testnet utiliza XLM ficticio que puede obtenerse de Friendbot y su historial se reinicia periódicamente; mainnet usa XLM real y no ofrece Friendbot. Las redes tienen identificadores distintos. [Documentación oficial de redes Stellar](https://developers.stellar.org/docs/networks).

En este proyecto, cambiar una URL no basta para usar mainnet: el adaptador valida la configuración de testnet y el contrato rechaza cualquier otro identificador de red. No debe quitarse esa restricción para convertir este laboratorio en producción.

Para una remesa operativa aún se necesita comprobar por separado autenticación, elegibilidad y verificación del cliente, recepción y conciliación del depósito, activo y emisor correctos, firma, tasas/comisiones, estados del proveedor y evidencia del pago al destinatario. El saldo XLM del laboratorio no acredita ninguno de esos pasos bancarios.

## 8. Próximas etapas

1. Repetir manualmente el simulador y leer el recibo junto al código del contrato.
2. Confirmar una aplicación Pollar exclusiva de testnet, credenciales de prueba y orígenes locales; después integrar y verificar login, wallet y firma.
3. Confirmar con el proveedor el acceso y las capacidades de Bridge sandbox antes de implementar sus escenarios. No asumir que Bridge sandbox y Stellar testnet son el mismo entorno ni que estén conectados.
4. Probar por separado las operaciones del repositorio original en un entorno de prueba confirmado. La revisión actual fue de código; no se ejecutó ningún pago en mainnet.
