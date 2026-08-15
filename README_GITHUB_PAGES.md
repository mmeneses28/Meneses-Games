# MENESES: ZOMBIES & VAMPIROS — V4.6.2 MISSIONS FIX

Base: V4.5.1 deployed.

## Missões
- Missão 1 — DESERTO: mapa e inimigos originais.
- Missão 2 — THRILLER: mapa nocturno aprovado, inimigos temáticos, clarões, gargalhada e Thriller Boss vermelho.

## Deploy GitHub Pages
Substituir os ficheiros do repositório pelos ficheiros deste pacote, mantendo a estrutura `assets/`, `build/` e `index.html` na raiz.
GitHub: Settings → Pages → Deploy from a branch → main → /(root).

## Hotfix crítico
A V4.6.1 podia tocar áudio mas não desenhar nada porque o JavaScript actualizava um elemento `#mission` inexistente no HUD da V4.5.1. Também havia um reset que voltava a missão para Deserto. Ambos foram corrigidos.
