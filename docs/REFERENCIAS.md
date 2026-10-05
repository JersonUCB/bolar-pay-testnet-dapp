# Referencias y procedencia

Consultadas durante la preparación del laboratorio, 5 de octubre de 2026.

- [Material de Fabián en el repositorio de Jerson, dia-2](https://github.com/JersonUCB/smart-contracts-starter-soroban/tree/main/dia-2): workspace Cargo y organización de contratos/pruebas.
- [Material de Oppia / Sebastián, dia-2](https://github.com/Oppia-Software-Labs/rwa-launchpad-bootcamp/tree/main/dia-2): paquete de contrato y pruebas junto al código; ejercicios didácticos que no se trasladaron como lógica de producción.
- [BOLAR original](https://github.com/bolarpay/bolar-dapp): landing y recursos reutilizados del checkout local `main`, commit `436bd2a` (`add png banner`). No se cambiaron sus archivos como parte de este trabajo.
- [Pollar, example app](https://github.com/pollar-xyz/pollar-docs/blob/main/docs/getting-started/example-app.md).
- [Bridge, sandbox](https://apidocs.bridge.xyz/get-started/introduction/quick-start/setting-up-sandbox).

La implementación del contrato de remesas es específica de este laboratorio; no es un fork completo de los contratos de clase. Se mantuvo un SDK Rust único fijado en Cargo para evitar mezclar las versiones de los dos ejemplos.

Las fuentes Inter y Open Sans se tomaron de los archivos locales ya descargados por la compilación de la web original para evitar una descarga durante cada build. Se incluyen sus licencias SIL OFL en `apps/web/public/fonts`, obtenidas del repositorio oficial google/fonts. Los componentes/assets mantienen su procedencia y derechos originales; este repositorio no declara una nueva licencia sobre el diseño de BOLAR.
