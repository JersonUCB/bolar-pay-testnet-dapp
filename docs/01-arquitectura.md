# Arquitectura y decisiones

## Objetivo

Aprender cómo una remesa cambia de estado y comprobar una transferencia autorizada en Soroban, manteniendo el diseño de BOLAR. Los bancos y los proveedores de identidad se prueban por separado de la blockchain.

## Qué tomamos de los mentores

El `dia-2` del repositorio de Jerson, basado en el material de Fabián, utiliza un workspace Cargo con varios contratos y coloca las pruebas junto al contrato. El de Oppia utiliza un paquete Rust pequeño con `src/lib.rs` y `src/test.rs`, apropiado para explicar autorización y reglas del contrato.

Aquí usamos un workspace Cargo aunque empezamos con un solo contrato: permite añadir uno cuando exista una necesidad concreta. Conservamos `lib.rs`/`test.rs`, errores tipados, almacenamiento tipado, eventos y autorización explícita. No copiamos los ejercicios sin terminar ni sus omisiones didácticas de autorización. Los enlaces están en [Referencias](REFERENCIAS.md).

## Monorepo pequeño

La web y el contrato pertenecen a un mismo repositorio para revisar juntos un cambio de interfaz, reglas y contrato. `apps/web` mantiene Next.js; `contracts/remittance` mantiene Rust. No agregamos Turborepo, microservicios ni una base de datos para esta primera pieza: todavía no hay varias aplicaciones, despliegues ni usuarios persistentes que los justifiquen.

## Separar reglas de herramientas

Aplicamos puertos y adaptadores en una escala pequeña:

```text
Interfaz React
  -> reglas de dominio (transition)
  -> caso de uso (settleRemittance)
  -> SettlementPort
       -> simulación local
       -> HTTP local -> Stellar CLI -> contrato Soroban testnet
```

Un **puerto** es una interfaz TypeScript: define qué necesita el flujo para transferir. Un **adaptador** implementa esa operación con una herramienta concreta. Esto permite probar las reglas sin red y sustituir la herramienta sin reescribir la landing. Por ahora solo la transferencia tiene ese puerto; no afirmamos haber implementado adaptadores reales para KYC o PIX.

La máquina de estados evita entregar BOB antes de completar la transferencia o aceptar un depósito antes de aprobar la identidad ficticia. Los importes se almacenan como centavos enteros; la tasa 1 BRL = 2,3 BOB es ilustrativa y no consulta un mercado.

## Responsabilidad del contrato

`settle(id, sender, recipient, amount)` pide autorización al remitente, valida importe y destinatario, transfiere el token y registra un recibo en la misma transacción. Si falla la transferencia, no queda un recibo exitoso. La clave del recibo combina remitente e identificador: repetir una solicitud no debe pagar dos veces.

El contrato comprueba el identificador criptográfico de Stellar testnet, incluso en su constructor. Acepta el token del constructor; nuestro script lo configura con el token nativo XLM. El límite es 10.000.000 unidades mínimas, equivalente a 1 XLM para esa configuración. No es un escrow ni implementa cambio de divisas, puente cripto o validación de depósitos bancarios.

Los recibos persistentes tienen TTL y pueden requerir restauración después de archivarse. Un reinicio de testnet destruye el historial de esa red. La idempotencia no es una promesa de almacenamiento eterno ni se conserva entre contratos nuevos.

## Por qué usamos Stellar CLI inicialmente

El CLI y el SDK Rust ya estaban disponibles localmente. Un adaptador local con argumentos explícitos permite preparar cuentas y aprender a desplegar sin introducir claves de producción en la web. El servidor fija destinatarios, importe y red; el navegador solo envía un identificador UUID.

La ejecución no usa un shell para construir comandos. Una cola serializa solicitudes en un proceso para evitar colisiones de secuencia. Si una respuesta se pierde después de enviar, se consulta el recibo del mismo identificador antes de reintentar.

Esta solución es adecuada para una demo local de un desarrollador. Para varias instancias o clientes reales se necesita autorización de usuario, almacenamiento duradero, conciliación, firma gestionada de forma adecuada y coordinación entre procesos. El puerto permite evolucionar hacia Stellar SDK o un servicio de firma sin cambiar las reglas centrales.

## Diseño conservado

Se reutilizaron componentes, CSS y recursos de la landing original, incluyendo sus colores e ilustración. Cambiamos el acceso por una entrada a datos ficticios y añadimos una franja visible de laboratorio. Quitamos del pie las referencias ajenas a BOLAR que venían en la plantilla. El 6 de octubre de 2026 se revisaron el simulador y el recibo en navegador, incluyendo vistas de escritorio y móvil; no afirmamos equivalencia píxel a píxel con el original.
