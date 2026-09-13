# ClickGuard Component Catalog

Este catálogo define los componentes más importantes para una librería de monitoreo de tráfico publicitario. Cada entrada sirve como checklist de implementación y de documentación en Storybook.

## 1. Foundations

| Componente | Props/contrato | Stories obligatorias | Accesibilidad y notas |
|---|---|---|---|
| `ColorTokens` | light/dark, semantic roles | Brand, status, surface, contrast | No usar color como único significado; validar contraste |
| `TypographyTokens` | display, body, mono, weights | Heading scale, table text, diagnostic values | Mantener lectura en densidad alta |
| `FocusRing` | focus-visible style | Button, table, drawer, pagination | Nunca eliminar outline sin reemplazo |
| `MotionTokens` | duration, easing, reduced motion | Drawer, toast, hover | Respetar `prefers-reduced-motion` |

## 2. Primitives

### `Button`

**Propósito:** acciones primarias, secundarias, reversibles y peligrosas.

**Contrato:** `variant`, `size`, `disabled`, `loading`, `leadingIcon`, `trailingIcon`.

**Stories:** `Primary`, `Secondary`, `Ghost`, `Danger`, `Loading`, `Disabled`, `IconOnly`, `LongLabel`, `FocusVisible`.

**Documentar:** cuándo usar `Danger`, cómo expresar undo, tamaños disponibles y que los icon-only buttons requieren `aria-label`.

### `Badge`

**Propósito:** etiquetas compactas no interactivas.

**Contrato:** `tone`, `icon`, `children`.

**Stories:** channel, platform, blocked, trusted, diagnostic, long text, dark theme.

**Regla:** no usarlo para reemplazar `ChannelChip`, `StatusChip` o `SignalEvidence` cuando exista semántica específica.

### `SearchInput`

**Contrato:** `value`, `onChange`, `onClear`, `invalid`, `shortcut`.

**Stories:** empty, IP search, ISP search, invalid query, no results, clearable, keyboard `/`.

**A11y:** label visible o `sr-only`, descripción de formato y botón clear con nombre accesible.

### `PageControls`

**Contrato:** `page`, `pageCount`, `total`, `pageSize`, `onPageChange`.

**Stories:** first page, middle page, last page, one page, zero results, mobile wrap.

**A11y:** `nav aria-label`, `aria-current="page"`, botones deshabilitados correctamente y foco visible.

## 3. Domain components

### `ChannelChip`

**Valores:** `paid`, `organic`, `direct`, `referral`.

**Contenido:** icono, etiqueta y tooltip explicando si aplica gasto publicitario.

**Stories:** todos los canales, compact table mode, long label, dark theme.

**Regla:** `Paid` debe ser distinguible de `Organic` sin depender solo del color.

### `StatusChip`

**Valores:** `monitoring`, `needs-look`, `excluded`, `whitelisted`, `auto-cleared`.

**Stories:** watching first timer, needs a look, blocked with platform, trusted, auto-cleared, long substate.

**Copy recomendado:** `Watching`, `Needs a look`, `Blocked`, `Trusted`.

### `RiskGauge`

**Contrato:** `band`, opcionalmente `score`, `detail`, `density`.

**Stories:** low, medium, high, diagnostic score, no score, compact table, large drawer.

**Nota:** mostrar siempre que el score es diagnóstico, no una sentencia automática.

### `SpendChip`

**Contrato:** `amount`, `context` (`paid-visit` o `spend-avoided`).

**Stories:** paid spend, spend avoided, zero spend, large amount, compact row.

**A11y:** comunicar el valor como texto; el símbolo `$` no debe ser el único indicador.

### `SignalTag`

**Valores:** click speed, device, VPN/proxy, IP reputation, pages, conversion, prior flags.

**Stories:** neutral signal, danger clue, positive evidence, diagnostic-only, unknown fallback.

### `SignalEvidence`

**Contrato:** `label`, `value`, `meaning`, `diagnostic`, `tone`.

**Estructura:** señal → valor → qué significa → etiqueta de diagnóstico/evidencia.

**Stories:** click speed 184ms, conversion confirmed, VPN detected, no evidence yet, long explanation.

**Regla:** separar evidencia positiva de heurística diagnóstica.

### `VisitorIdentity`

**Contenido:** identicon, IP, ciudad/país, ISP, device fingerprint opcional, last seen.

**Stories:** table compact, drawer header, missing geo, IPv6, long ISP, anonymized.

## 4. Operations

### `FilterBar`

**Filtros:** status, channel, risk band, search.

**Stories:** default, active filters, needs-a-look, query no-match, reset, mobile stacked.

**A11y:** labels explícitos, orden lógico de tabulación y estado de filtro anunciado.

### `DataTable`

**Contrato:** `columns`, `rows`, `sort`, `selection`, `onSort`, `onSelectionChange`, `loading`, `emptyState`.

**Stories:** default visitor queue, sorted ascending/descending, selected rows, partial select, loading, zero results, long content, responsive overflow.

**Requisitos:** headers accionables, `aria-sort`, caption, checkbox labels, row focus y paginación arriba/abajo.

### `BulkActionsBar`

**Stories:** one selected, multiple, all visible, exclude, trust, export, undo, mobile wrap.

**Regla:** la selección masiva debe indicar alcance y mantener acción reversible.

### `EmptyState`

**Variantes:** no threats yet, zero results, disconnected account, error/retry.

**Stories:** cada variante con CTA y copy de dominio.

### `UndoToast`

**Stories:** excluded, trusted, unblocked, exported, multi-record, countdown, dismissed.

**A11y:** `role="status"`, texto claro y botón Undo navegable.

## 5. Reasoning

### `VerdictBanner`

**Variantes:** blocked, under review, watching, trusted, auto-cleared.

**Debe mostrar:** veredicto, detalle, plataforma/acción y timestamp cuando aplique.

### `JourneyTimeline`

**Stories:** normal journey, mixed channels, dense burst, suspicious-then-converted, ambiguous, trusted reversal, empty, loading.

**Regla:** conservar cada señal junto a la visita donde fue observada.

### `VisitNode`

**Estados:** collapsed, expanded, paid, organic, converted, high evidence, low evidence.

**A11y:** expand/collapse con `aria-expanded` y nombre que incluya timestamp o página.

### `BurstNode`

**Contrato:** `count`, `duration`, `range`, `bounceRate`, `expanded`, `onToggle`.

**Stories:** 14 visits / 92 min / 100% bounce, expanded, mixed signals, long range label.

### `ReEvaluationCard`

**Contrato:** `confidence`, `prognosis`, `diagnostics`.

**Stories:** low, medium, high confidence, positive evidence, multiple diagnostics, long prognosis.

**Copy:** documentar explícitamente “what would change the verdict?”.

### `ConversionResolution`

**Flujo:** suspicious → purchase confirmed → auto-cleared → removed from exclusion lists.

**Stories:** purchase, form conversion, demo booked, auto-cleared, override available.

## 6. Overlays

### `Drawer`

**Stories:** open, long content, mobile full width, focus trap, Escape, focus return, sticky actions.

### `VisitorActionBar`

**Acciones:** unblock, whitelist/trust, mark for review, re-block override.

**Stories:** blocked, monitoring, trusted, converted, disabled action, undo result.

### `ConfirmationDialog`

**Stories:** single exclude, bulk exclude, trust, re-block converted visitor.

**Regla:** explicar impacto, alcance y reversibilidad antes de la acción.

## 7. Compositions

| Composición | Debe demostrar |
|---|---|
| `ThreatMonitoringHeader` | cuenta, plataformas, estado live, theme toggle, CTA |
| `ProtectionOverview` | blocked visits, spend avoided, monitoring, accuracy |
| `VisitorQueue` | filtros, summary, tabla, paginación arriba/abajo, bulk actions, empty |
| `VisitorInvestigationDrawer` | identidad, veredicto, meta, timeline, evidencia, reevaluación, acciones |

## Matriz de cobertura recomendada

| Área | Base | Estados borde | A11y | Responsive | Dark |
|---|---:|---:|---:|---:|---:|
| Primitives | Sí | Sí | Sí | Sí | Sí |
| Domain | Sí | Sí | Sí | Sí | Sí |
| Operations | Sí | Sí | Sí | Sí | Sí |
| Reasoning | Sí | Sí | Sí | Sí | Sí |
| Overlays | Sí | Sí | Sí | Sí | Sí |
| Compositions | Sí | Sí | Sí | Sí | Sí |

## Definition of Done para Storybook

- Cada componente tiene nombre de story orientado a uso.
- Las props principales aparecen en autodocs o en la descripción de la story.
- Los estados vacíos, loading, error, disabled y long content están cubiertos donde aplican.
- La paginación aparece arriba y abajo en la composición de tabla.
- Las interacciones principales se pueden realizar con teclado.
- Las stories no dependen de backend ni de datos impredecibles.
- Storybook compila en CI y la aplicación pasa typecheck/build.
