# Pruebas y evidencia

## Automáticas

```sh
npm run lint
npm run typecheck
npm test
npm run test:contracts
npm run build
npm run build:contracts
```

En la construcción inicial pasaron 10 pruebas de web/servidor y 6 de Rust. Cubren orden del flujo, importes, repetición, separación de evidencia simulada y testnet, red inválida, restricciones HTTP y respuesta perdida después del envío. El contrato verifica transferencia, autorización, duplicados, importes inválidos, mainnet rechazada y rollback ante saldo insuficiente.

Las pruebas del adaptador usan una CLI inyectada ficticia. Las pruebas Rust ejecutan el entorno de pruebas Soroban. Ninguna de ellas demuestra por sí sola una transacción en la testnet pública.

## Revisión manual del simulador

1. Ejecutar `npm run dev` y abrir `http://127.0.0.1:3100`.
2. Confirmar franja LABORATORIO TESTNET y entrar. El acceso no es autenticación de un cliente.
3. Usar 100 BRL. Abrir Probar envío -> Simulación completa -> Continuar con datos ficticios.
4. Aprobar la identidad. Confirmar que la referencia dice NO ESCANEAR / NO PAGAR.
5. Simular depósito -> transferencia -> entrega. Debe mostrar 230 BOB **simulados** y una referencia DEMO, sin explorador blockchain.
6. Cerrar y repetir con verificación pendiente: no debe aparecer depósito hasta aprobarla. Repetir con rechazo: no debe habilitar depósito.
7. Repetir aprobado -> depósito -> devolución: no debe transferir ni entregar BOB.
8. Probar límites de monto, teclado, cierre con Escape y retorno del foco. Revisar tamaños móvil y escritorio. Revisión del 6 de octubre: los recorridos anteriores, el retorno del foco y las vistas 1440 × 900 y 390 × 844 fueron comprobados; no constituye cobertura de todos los navegadores.

## Prueba pública testnet

1. Compilar y ejecutar `npm run testnet:setup` con internet. El script conserva una configuración existente; no despliega otra silenciosamente.
2. Reiniciar/abrir el modal para que consulte de nuevo la disponibilidad y seleccionar Soroban testnet. La disponibilidad solo confirma configuración local; no garantiza que la red esté operativa.
3. Completar los pasos ficticios y pulsar Transferir 1 XLM en testnet.
4. Revisar el recibo guardado en `.local/receipts/` y la actividad del contrato en el enlace testnet. El enlace apunta al contrato, no pretende ser el hash de una transacción.
5. Verificar en el explorador el movimiento del token: el receptor aumenta 1 XLM; el remitente además paga las comisiones testnet correspondientes.
6. Para comprobar repetición, reutilizar el mismo UUID al llamar al adaptador local: debe devolver el recibo anterior. Una prueba nueva del modal genera un UUID diferente y sí permite una nueva transferencia.
7. Registrar dirección pública del contrato, identificador del recibo, ledger y resultado. No copiar archivos de identidad ni semillas a Notion/GitHub.

Si falla una petición, reintentar en el mismo modal. No cerrar y crear otra operación para resolver una confirmación incierta. El cliente conserva el mismo identificador mientras siga abierto.

## Límites operativos

- El historial del recorrido vive en memoria y se pierde al cerrar o recargar. Los recibos confirmados se guardan localmente y en el contrato mientras permanezcan disponibles.
- La cola evita colisiones en un proceso local, no coordina varios servidores.
- `.local/stellar` contiene claves privadas testnet. No está cifrado como una custodia de producción y está excluido de Git.
- Después de un reinicio público de testnet, o si se necesita un laboratorio nuevo, detener el servidor y **mover `.local` a un respaldo privado fuera del repositorio**, luego repetir setup. Esto genera identidades nuevas; el respaldo no debe publicarse. Los recibos anteriores no se deben atribuir al contrato nuevo.
- Si las entradas del contrato se archivan por TTL, se debe restaurarlas con las herramientas de Stellar antes de continuar. No recrear identificadores para eludir una operación incierta.
- La tasa BRL/BOB y el importe XLM del contrato son independientes; no hay conversión económica real.

## Estado inicial de verificación

Compilación Next, WASM y pruebas aprobadas. `npm run dev` fue bloqueado con `listen EPERM` en el entorno de ejecución. Acceso de terminal a npm falló por DNS. Por tanto, instalación limpia, revisión visual y despliegue/transferencia en red siguen pendientes.

## Verificación posterior: 6 de octubre de 2026

Se completaron la instalación limpia y la revisión en navegador. Pasaron 12 pruebas web/servidor y 6 de contrato, lint, TypeScript, build Next y build WASM. La revisión encontró y corrigió el retorno del foco al cerrar el diálogo y un rechazo HTTP 403: Next reconstruía `request.url` con `localhost` mientras el navegador enviaba `Origin: http://127.0.0.1:3100`. Ahora se valida un `Host` local y la coincidencia exacta de su origen, manteniendo el bloqueo de dominios/puertos externos. Las solicitudes reales con identificador inválido, origen externo y parámetro extra de red dieron 400, 403 y 400 respectivamente.

La interfaz confirmó 1 XLM testnet; el recibo, la transacción exitosa y el incremento exacto del destinatario se verificaron con datos públicos. La repetición del identificador se comprobó mediante simulación RPC (`--send no`), que devolvió el error 4 del contrato sin cambiar saldos ni secuencias. No se probó una pérdida real de respuesta de red; ese caso sigue cubierto por el adaptador ficticio de las pruebas automáticas.

Consulta [la guía y evidencia](07-guia-practica-y-comparacion.md). Los límites operativos anteriores siguen aplicando.
