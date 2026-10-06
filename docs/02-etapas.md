# Etapas y criterios de avance

| Etapa | Entrega | Estado y condición de cierre |
|---|---|---|
| 1. Base independiente | Git local, Next.js, assets y estructura Cargo | Implementada y publicada en GitHub. Instalación limpia verificada. |
| 2. Recorrido simulado | Identidad ficticia, estados, depósito, transferencia, entrega y devolución | Implementado y revisado en navegador: aprobación, pendiente, rechazo, devolución, límites y teclado. |
| 3. Contrato Soroban | Autorización, transferencia atómica y recibo único | 6 pruebas aprobadas y WASM compilado. |
| 4. Red testnet | Cuentas dedicadas, Friendbot, despliegue y adaptador local | Despliegue y transferencia de 1 XLM confirmados; saldos, recibo y rechazo de duplicado por simulación RPC registrados en la guía práctica. |
| 5. Pollar testnet | Aplicación y credenciales exclusivas, login y wallet verificable | Pendiente; no se copió la configuración de producción. |
| 6. Bridge sandbox | Probar esquemas y estados que permita su API | Pendiente acceso y confirmación con Oscar. Separado de Stellar testnet. |
| 7. Piloto de remesa real | Remitente elegible, depósito, conciliación y pago al destinatario | Fuera de este laboratorio; requiere proveedores y operación confirmados. |

## Qué podemos enseñar en el bootcamp

Primero el flujo con sus casos de error y el razonamiento de arquitectura. Después, cuando termine la etapa 4, una transferencia verificable del contrato en Stellar testnet. La presentación debe decir qué tramo es simulado y cuál tiene evidencia en blockchain.

No presentar una demo con KYC simulado como un cliente verificado, una entrega BOB ficticia como un pago real ni un contrato compilado como uno desplegado. Para medir clientes del piloto, registrar personas que realmente completaron el corredor habilitado, separándolas de pruebas internas.

## Cómo trabajar cada etapa

Crear una rama pequeña (`codex/<tema>`), formular un resultado observable, implementar una parte completa, revisar evidencia y registrar limitaciones. En el repositorio de producción continuamos las reglas del equipo; este laboratorio no implica un merge automático allí.

Orden siguiente: repasar la evidencia y repetir el laboratorio -> confirmar Pollar testnet y capacidad de sandbox con Oscar -> integrar solo lo confirmado. Así el equipo aprende y avanza aunque el proveedor bancario tenga requisitos pendientes.

Evidencia y comparación: [Guía práctica del 6 de octubre](07-guia-practica-y-comparacion.md).
