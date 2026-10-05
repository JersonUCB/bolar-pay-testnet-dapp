# Pollar, Bridge y el piloto

## Tres entornos distintos

| Entorno | Qué demuestra | Qué no demuestra |
|---|---|---|
| Simulador de BOLAR | Interfaz, reglas, errores y orden del recorrido | KYC, recepción PIX o fondos en blockchain |
| Stellar testnet | Autorización y transferencia del contrato con token de prueba | Depósito bancario, cambio BRL/USDC o pago BOB |
| Sandbox de Bridge | Esquemas y estados permitidos de su API | Dinero real o conexión a Stellar testnet |

Bridge documenta que sandbox no soporta testnet, usa datos ficticios para operaciones y direcciones, y no emite webhooks relacionados con pagos. La creación de clientes se realiza mediante API y su aprobación es simulada. Por tanto no existe aquí un flujo demostrado de PIX sandbox que libere USDC hacia nuestro contrato. [Documentación oficial](https://apidocs.bridge.xyz/get-started/introduction/quick-start/setting-up-sandbox).

Pollar publica una demo Next.js sobre testnet con autenticación y pagos, y distingue las claves testnet. En la página consultada, el depósito fiat SEP-24 con Anclap figura como pendiente. Eso no confirma una conexión Bridge sandbox mediante Pollar. Hay que verificar las capacidades de la aplicación que Oscar habilite. [Demo oficial documentada](https://github.com/pollar-xyz/pollar-docs/blob/main/docs/getting-started/example-app.md).

## Estado del código

La dependencia `@pollar/react` se conserva de la base, pero no está montada ni se llama a sus APIs. Entrar al laboratorio solo habilita datos ficticios. No se copiaron archivos de entorno, cookies, sesión de Google ni claves de producción.

El contrato usa XLM testnet para reducir pasos de preparación. Añadir un activo que represente USDC de prueba requiere definir emisor, distribución y trustlines; su nombre no lo convierte en USDC emitido o redimible por Circle.

## Roles para explicarlo al equipo

- **BOLAR:** aplicación que integra servicios y organiza la experiencia; el equipo desarrolla y prueba.
- **Cliente remitente:** persona que deposita sus BRL y debe cumplir los requisitos reales del proveedor para ese corredor.
- **Destinatario:** quien recibe el pago en Bolivia por el medio de salida habilitado.
- **Pollar:** SDK/servicios utilizados por BOLAR para funciones de wallet e integración disponibles.
- **Bridge:** proveedor de la rampa seleccionada; aceptar términos y aprobar identidad son pasos distintos.

Ser fundador o tener una cuenta empresarial no reemplaza automáticamente el KYC del remitente. Ninguna simulación de este repositorio autoriza un pago real ni resuelve el caso de los BRL retenidos que contó Rafa.

## Mensaje propuesto para Oscar (no enviado)

> Estamos creando BOLAR testnet en un repo separado. ¿Nos pueden habilitar una aplicación Pollar exclusiva de testnet y confirmar los orígenes locales? Queremos probar login/wallet y transferencia de activos de prueba. Para Bridge, ¿Pollar expone un sandbox con credenciales separadas o debemos probar su API directamente? ¿Qué escenarios BRL/PIX se pueden simular y cuáles requieren producción? ¿Cómo verificamos los estados y errores sin depositar BRL? También necesitamos aclarar cómo conciliar o recuperar la operación pendiente de Rafa mediante su identificador, sin volver a pagar.

## Antes de clientes reales

Cerrar el corredor con el proveedor: elegibilidad del remitente, titularidad del pago, requisitos de CPF cuando correspondan, límites, costos, tiempos, fallos y devolución. Confirmar también quién paga al destinatario en Bolivia y cómo se prueba esa entrega. Un piloto pequeño necesita esa definición además de una interfaz y un contrato.
