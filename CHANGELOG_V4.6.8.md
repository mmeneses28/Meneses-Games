# V4.6.8 — MOBILE LANDSCAPE & PERFORMANCE

## Mobile landscape obrigatório
- Em dispositivos touch, portrait fica bloqueado por overlay `LANDSCAPE OBRIGATÓRIO`.
- O gameplay é automaticamente pausado se o telefone for rodado para vertical.
- Ao voltar para landscape, a partida retoma sem perder estado.
- Removida a opção `JOGAR ASSIM` em portrait.
- Continua a tentar `screen.orientation.lock('landscape')` quando o browser permite.

## Escala do mapa
- Mobile usa `zoom = 1.0`, igual ao browser/desktop.
- Joysticks e HUD são overlays e não alteram a escala do mundo.
- DPR interno do canvas em mobile limitado a 1.25 para reduzir fill-rate sem alterar escala CSS.

## Performance
- Colisões bala/inimigo usam broad-phase spatial grid em vez de varrer toda a horda para cada projéctil.
- Render culling para inimigos, projécteis, explosões, pickups, caixas, SAM, Rescue NPC e helicóptero fora do viewport.
- O background desenha apenas a região visível do mapa.
- HUD/DOM reduzido para actualização a 10 Hz em vez de todos os frames.
- Removidas alocações desnecessárias no `EnemyMotion.targetFor()` e na separação de hordas.
- Render mobile limitado a 60 fps para evitar custo duplicado em ecrãs 90/120 Hz.

## Compatibilidade preservada
- Helicóptero V2 animado.
- Rescue AI da mulher de jeans.
- Mystery Crate / Extra Life / Rage / Rampage.
- Boss Arc Thriller e Carnage.
