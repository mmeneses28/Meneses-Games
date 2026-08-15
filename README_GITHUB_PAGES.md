# MENESES: ZOMBIES & VAMPIROS V4.5.1 — GitHub Pages

Esta pasta está pronta para publicação como site estático.

## Estrutura
- `index.html` — página principal / jogo
- `build/game.js` — lógica compilada
- `assets/` — imagens, áudio e música
- `.nojekyll` — impede processamento Jekyll
- `404.html` — redirecciona para a entrada do jogo

## Publicar no GitHub Pages
1. Criar um novo repositório no GitHub, por exemplo:
   `meneses-zombies-vampiros`
2. Colocar todo o conteúdo desta pasta na raiz do repositório.
3. Abrir:
   `Settings → Pages`
4. Em `Build and deployment`, escolher:
   `Deploy from a branch`
5. Branch:
   `main`
6. Folder:
   `/ (root)`
7. Guardar.

A página ficará normalmente em:
`https://SEU-UTILIZADOR.github.io/meneses-zombies-vampiros/`

## Importante
O deploy deve usar estes ficheiros separados e não o HTML Standalone de ~31 MB.
Assim o browser consegue fazer cache individual de imagens, áudio, música e JavaScript.

## Mobile
A V4.5.1 detecta touch automaticamente em Chrome/Android e Safari/iPhone:
- Single Player: joystick virtual + Airstrike + Settings
- Two Players: dois joysticks
- câmara centrada na área útil, zoom mobile e HUD compacto
- safe areas, viewport dinâmica e proporção de canvas preservada
- fullscreen + tentativa de bloqueio landscape quando o browser permite
- portrait continua jogável e mostra uma recomendação que pode ser dispensada

## Testes V4.5.1
- Chrome/Android landscape: 915×412 e 800×360
- Safari/iPhone landscape: 844×390
- Portrait: 412×915
- Desktop: 1280×720
- Single Player, cooperação, menus, selecção, definições, fullscreen e autotest de gameplay
