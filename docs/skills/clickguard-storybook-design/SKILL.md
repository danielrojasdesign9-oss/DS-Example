---
name: clickguard-storybook-design
description: Diseñar y documentar interfaces operativas de monitoreo de tráfico publicitario con componentes React y Storybook. Usar para convertir dashboards genéricos en sistemas UI de dominio, extraer componentes ClickGuard, añadir paginación accesible y crear stories con estados, props, casos límite y criterios de QA.
license: Complete terms in LICENSE.txt
---

# ClickGuard Storybook Design

## Objetivo

Construir interfaces de monitoreo de tráfico que se sientan como una herramienta de PPC y forensics, no como un dashboard genérico de IA. Priorizar evidencia, journey, gasto, conversión, reversibilidad y control humano.

## Flujo obligatorio

1. **Inspeccionar el producto existente.** Localizar el dashboard, el paquete UI, los tokens, los datos mock y las stories actuales. No tocar backend cuando el trabajo sea frontend.
2. **Definir el lenguaje de dominio.** Convertir conceptos genéricos en conceptos ClickGuard: `visitor`, `journey`, `channel`, `paid click`, `spend avoided`, `signal evidence`, `threat band`, `reasoning trail`, `conversion resolution`.
3. **Extraer componentes antes de pulir la página.** Separar primitives, componentes de dominio, componentes operativos y composiciones. Evitar repetir markup de badges, estados, tablas o timelines dentro de las páginas.
4. **Implementar paginación cerca del contenido.** Renderizar controles arriba y abajo de las tablas largas. Paginar datos derivados del filtro y del sort; reiniciar a la página 1 cuando cambien filtros o sort; mantener la selección masiva limitada a la página visible.
5. **Crear stories útiles.** Cada componente importante debe tener una story base, estados de borde, tema oscuro cuando aplique, contenido largo, loading/empty/error cuando aplique y un caso de teclado o accesibilidad.
6. **Documentar el contrato.** Para cada story importante incluir qué resuelve, cuándo usarlo, props principales, estados, semántica de color, comportamiento responsive y restricciones de accesibilidad.
7. **Verificar.** Ejecutar typecheck, build de la aplicación, build de Storybook y revisión visual del preview. Corregir errores antes de entregar.

## Arquitectura recomendada

```text
ClickGuard
├── Foundations
├── Primitives
├── Domain
├── Operations
├── Reasoning
├── Overlays
└── Compositions
```

### Foundations

Usar tokens semánticos para color, tipografía, spacing, radio, elevación, foco y motion. No introducir colores literales en componentes o páginas fuera del archivo de tokens.

### Primitives

`Button`, `Badge`, `Tooltip`, `SearchInput`, `Select`, `Checkbox`, `Pagination`, `Skeleton`.

### Domain

`ChannelChip`, `StatusChip`, `RiskGauge`, `SpendChip`, `SignalTag`, `SignalEvidence`, `DiagnosticTag`, `VisitorIdentity`.

### Operations

`FilterBar`, `FilterPopover`, `ActiveFilter`, `DataTable`, `BulkActionsBar`, `EmptyState`, `UndoToast`, `ConfirmationDialog`.

### Reasoning

`VerdictBanner`, `JourneyTimeline`, `VisitNode`, `BurstNode`, `ReEvaluationCard`, `ConversionResolution`.

### Overlays

`Drawer`, `VisitorActionBar`, `VisitorInvestigationDrawer`.

### Compositions

`ThreatMonitoringHeader`, `ProtectionOverview`, `VisitorQueue`, `VisitorInvestigationDrawer`.

## Reglas de diseño

- Tratar la tabla y el drawer como productos principales, no como tarjetas auxiliares.
- Usar colores para comunicar estado, nunca como único canal de significado.
- Mantener separado el veredicto de la evidencia diagnóstica: un score no es el veredicto.
- Mostrar acciones reversibles y conservar el historial visible.
- Usar copy de dominio: `Blocked`, `Needs a look`, `Watching`, `Trusted`, `Paid`, `Spend avoided`, `Click Forensics`.
- Mantener motion breve, interrumpible y compatible con `prefers-reduced-motion`.
- Dar focus visible a botones, filas accionables, filtros, paginación y controles del drawer.
- Para tablas responsive, preservar la capacidad de escaneo mediante overflow horizontal; no ocultar columnas semánticamente importantes sin alternativa.

## Paginación de tablas

Implementar un componente controlado con este contrato conceptual:

```tsx
<PageControls
  page={page}
  pageCount={pageCount}
  total={filteredRows.length}
  pageSize={pageSize}
  onPageChange={setPage}
/>
```

Requisitos:

- Mostrar `start–end of total`.
- Deshabilitar `Previous` en la primera página y `Next` en la última.
- Marcar la página activa con `aria-current="page"`.
- Colocar el control antes y después de la tabla.
- Derivar las filas visibles después de filtros y ordenamiento.
- Reiniciar página al cambiar filtros, búsqueda u orden.
- Seleccionar todos solo dentro de la página visible.
- Permitir navegación por teclado y foco visible.

## Stories mínimas por componente

Cada story debe demostrar el caso real del producto, no solo una muestra estética. Usar el catálogo en `references/component-catalog.md` como contrato de implementación y documentación.

## QA mínimo

- `pnpm typecheck`
- `pnpm build`
- `CI=1 pnpm build:storybook`
- Verificar tabla inicial, filtros, búsqueda, sort, paginación arriba/abajo, selección masiva, drawer, Escape, focus return, empty state y tema oscuro.
- Confirmar que no queden colores literales fuera de tokens.
- Eliminar output generado de Storybook antes del checkpoint si el repositorio no lo versiona.

## Entrega

Entregar un checkpoint del proyecto con resumen de cambios, pruebas ejecutadas, riesgos conocidos y enlace al preview. Si se solicita la skill, entregar el archivo `SKILL.md` y mencionar también el catálogo de componentes de `references/`.

## Referencia

Leer `references/component-catalog.md` cuando se necesite la lista completa de componentes, contratos, stories y criterios de accesibilidad.

## No hacer

- No usar un `Badge` genérico para representar todos los conceptos del producto.
- No colocar la paginación únicamente al final de una tabla extensa.
- No afirmar que se consultaron referencias externas si el conector no está disponible.
- No agregar backend, endpoints o esquemas de base de datos para resolver una necesidad de UI.
- No documentar solo el estado feliz.

## Criterio de finalización

Considerar el trabajo completo cuando los componentes de dominio estén extraídos, la tabla sea navegable desde arriba y abajo, las stories cubran estados reales y bordes, el código pase typecheck/build/Storybook y la revisión visual confirme jerarquía, contraste y densidad operativa.
