# Prompts para trabajar y aprender por etapas

Estos prompts se usan por separado, después de revisar el resultado anterior. Ya existe la base; no pedir que se regenere todo desde cero. El agente debe explicar en español problema, decisión, cambio y evidencia.

## 1. Entender el proyecto

> Lee AGENTS.md, README.md y docs/01-arquitectura.md. Recorre un envío desde el botón de la landing hasta SettlementPort y el contrato. Explícame con un ejemplo dónde viven las reglas, qué está simulado y qué puede ejecutarse en testnet. No cambies código ni uses cuentas de producción. Identifica el siguiente resultado verificable.

## 2. Revisar el diseño y el flujo manualmente

> Ejecuta este repositorio en 127.0.0.1:3100 y revisa desktop y móvil. Antes de editar Next.js, lee las guías instaladas pertinentes. Conserva paleta, tipografía y assets de BOLAR. Prueba aprobado, pendiente, rechazado y devolución; verifica foco del modal, teclado, textos y ausencia de desbordes. Corrige solo problemas observados. Entrega evidencia visual y aclara lo que no se pudo comprobar.

## 3. Comprobar la transferencia Soroban

> Revisa scripts/setup-testnet.mjs y el adaptador local. Usa solo las identidades nuevas de .local y la red testnet fija. Compila, prepara las cuentas con Friendbot, despliega y ejecuta una transferencia de 1 XLM ficticio. Guarda evidencia pública de contrato, recibo y saldos, nunca semillas. Repite la misma operación y comprueba que no paga dos veces. Si falla la red, informa el fallo sin sustituirlo por una simulación exitosa.

## 4. Integrar autenticación Pollar testnet

> Consulta la documentación oficial vigente y confirma que tenemos una aplicación Pollar exclusiva de testnet y orígenes locales habilitados. Integra únicamente login y wallet en una pantalla separada del modo simulado. Valida la red reportada por la aplicación antes de habilitar operaciones. No uses la API key de bolar.lat ni expongas claves secretas. Mantén estable la instancia del cliente React para evitar bucles de render. Comprueba entrada, salida, error y dirección de wallet testnet; explica que login no equivale a KYC. Documenta qué credencial falta sin inventarla.

## 5. Integrar Bridge sandbox

> Lee docs/05-proveedores.md y vuelve a consultar la documentación oficial. Confirma con la configuración disponible si la integración será directa o mediante Pollar. Implementa solo el alcance que permita sandbox: cliente ficticio y estados de verificación documentados, usando claves exclusivamente en servidor. No afirmes que Bridge sandbox deposita USDC en Stellar testnet. Añade un adaptador separado, pruebas de contrato de API y manejo de rechazos. Conserva el simulador para pruebas sin credenciales. Nunca ingreses datos de personas reales.

## 6. Persistencia y conciliación

> Propón primero un diseño mínimo para persistir operaciones y eventos, diferenciando identificación del usuario y estado del proveedor. Considera duplicados, notificaciones fuera de orden, autenticación de webhooks, respuesta perdida y reinicio del servidor. Mantén idempotencia duradera. Implementa una sola parte verificable y sus pruebas; no añadas infraestructura distribuida sin necesidad. No despliegues el ejecutor CLI local como servicio público.

## 7. Preparar presentación

> Revisa evidencia existente y arma un guion de cinco minutos para el bootcamp. Describe el problema, usuario del corredor Brasil-Bolivia, flujo, contrato y resultado de pruebas. Distingue simulación, transferencia testnet y pagos reales. No inventes usuarios, volúmenes, aprobaciones KYC ni métricas. Termina con el siguiente experimento y la ayuda concreta que necesitamos del mentor.

## Definición de terminado para cada cambio

> Explica qué cambió, por qué, cómo lo verificaste y qué falta. Ejecuta las comprobaciones relevantes de AGENTS.md. Revisa git diff y no agregues .local, .env, claves ni archivos generados. Si un bloqueo impide terminar, conserva el avance y documenta exactamente qué paso debe ejecutarse después.
