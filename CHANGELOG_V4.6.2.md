# V4.6.2 — MISSIONS FIX

Base exacta: V4.5.1 deployed.

## Correcções críticas
- Corrigido crash de renderização ao iniciar a Missão 2: o JavaScript tentava actualizar `#mission` mas o HUD da V4.5.1 não tinha esse elemento.
- Corrigido reset que voltava `mission` para `deserto` mesmo depois de escolher Thriller.
- Missão seleccionada passa a persistir no restart.

## Missões
- Missão 1 — DESERTO: mapa e inimigos originais da V4.5.1.
- Missão 2 — THRILLER: mapa nocturno aprovado, inimigos temáticos, clarões, gargalhada e apparition do Thriller Boss.

## QA
Testado em Chromium real via CDP com HTML/assets embebidos: menu → Thriller → personagem → gameplay; background, player e enemy assets prontos; estado RUNNING; HUD THRILLER. Também testado arranque da missão DESERTO.
