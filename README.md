# خانه‌ی ما | Our Little Home

A cozy first-person two-player browser life simulation for Abolfazl and Razieh. The project now includes a small authoritative WebSocket room server, synchronized player transforms, remote avatars, shared state patches, synchronized couple interactions, quick chat, cooperative cooking signals, and shared driver/passenger vehicle state.

## Run locally

Requirements: Node.js 18+.

```bash
npm start
```

Open `http://localhost:5173` in two browser tabs or two devices on the same reachable host.

For the first player:

1. Click **شروع زندگی**.
2. Choose **من ابوالفضلم** or **من راضیه‌ام**.
3. Choose **ساختن اتاق**.
4. Share the generated room code.

For the second player:

1. Click **شروع زندگی**.
2. Choose **پیوستن به اتاق**.
3. Enter the room code and choose the other role.
4. Enter the shared house.

Three.js is vendored in `assets/three.module.js`; the playable scene does not require a runtime CDN. The supplied couple photo and moon image are used in the title scene, memory album, and in-world picture frames. The three newly supplied couple photos are included as optimized, EXIF-stripped gallery assets in `assets/memories/` and appear in the phone and memories album.

## Current multiplayer slice

- Real WebSocket room creation and joining using `server.mjs` and a dependency-free Node WebSocket upgrade/frame handler.
- Exactly two room slots with explicit Abolfazl/Razieh roles, reconnect tokens, connection status, partner-disconnected state, and room cleanup after inactivity.
- Server broadcasts player position, rotation, animation state, clothing appearance, quick chat, synchronized interactions, shared state, and driver/passenger vehicle state.
- Remote movement is interpolated instead of snapping. The remote character is a full-body articulated procedural humanoid with shoulders, torso, arms, hands, pelvis, legs, feet, hair, face planes, accessories, and lightweight idle/walk/run/couple animation cues.
- Synchronized hug, kiss, hold-hands, dance, high-five, talk, gift, and cooking activity events. Both clients lock local movement during affection alignment and receive the same remote animation event.
- Shared wallet, inventory, decorations, furniture layout (sofa, table, bed), objectives, memories, customization, day/time, relationship state, quick phrases, and local save data. Furniture movement/rotation is clamped and broadcast to both players.
- Driver/passenger seat assignment. The first player to enter the shared car becomes driver, the other becomes passenger; vehicle movement is broadcast through the room.
- Offline mode remains available when the WebSocket server is not reachable. Offline mode uses the existing AI companion and localStorage save flow without claiming to be multiplayer.

## Controls

- Desktop: `WASD` move, mouse look, `Shift` sprint, `E` contextual interaction, `F` quick affection, `Tab` phone, `Esc` pause.
- Mobile: virtual joystick, drag on the scene to look, contextual touch buttons.
- In a room, use the **گفت‌وگو** HUD button for natural Persian quick phrases.

## Architecture

### Client

`main.js` keeps the existing light-weight Three.js world and adds clear network boundaries:

- `runtime.network`: connection, room, role, session token, players, reconnect state.
- `connectToRoomServer()` / `handleNetworkMessage()`: transport and room lifecycle.
- `maybeSendNetworkState()`: throttled local transform/animation producer.
- `rebuildRemotePlayers()` / `updateRemotePlayers()`: remote avatar lifecycle and interpolation.
- `sendNetworkInteraction()` / `startSynchronizedInteraction()`: couple interaction command/event flow.
- `serializeSharedState()` / `applySharedState()` / `syncSharedState()`: shared world patch boundary.
- `applyVehicleState()`: authoritative driver/passenger state boundary.
- `saveGame()`: local persistence fallback and shared-state persistence trigger.

The local camera remains first-person during normal play. Character previews and short vehicle/affection moments can use controlled viewpoints without turning normal exploration into third person.

### Server

`server.mjs` serves static files and upgrades `/ws` on the same HTTP port. It maintains:

- room code and two role slots
- reconnect/session tokens
- connected/disconnected presence
- last known player state
- shared state patches
- validated interaction target existence and proximity
- driver/passenger vehicle state
- bounded quick chat messages

No third-party viewer, online character page, API key, or secret is needed at runtime.

## Tests

Syntax checks:

```bash
npm run check
```

With the server running in another terminal, run the two-client raw WebSocket smoke test:

```bash
npm run smoke
```

The smoke test creates a room, joins the second role, checks presence and remote state, synchronizes a furniture patch, broadcasts a hug interaction, verifies driver assignment, and exercises reconnect with the session token.

## Persistence

- `localStorage` stores the local save (`our-little-home-save-v1`).
- `sessionStorage` stores the reconnect token for the current room.
- The development room server keeps active room state in memory and holds disconnected slots for ten minutes. A production deployment should move room/shared state to a managed store or durable database if rooms must survive server restarts.

## Deployment

The app is ready to deploy as a Node service that supports WebSocket upgrades. A ready-to-use `render.yaml`, `Dockerfile`, and detailed Persian deployment guide are included in `docs/DEPLOYMENT.md`.

The simplest free demo path is a Render Free Web Service. It supports Node services and WebSocket connections while active, but sleeps after 15 minutes without inbound traffic and loses in-memory rooms when restarted. For an always-running low-traffic server, use a small Oracle Cloud Always Free VM or another VPS and run `npm start` behind HTTPS/reverse proxy.

Use `PORT` from the deployment platform:

```bash
PORT=5173 npm start
```

No secrets are required by the current build. If a managed realtime service is introduced later, use environment variables and do not commit `.env` files.

## Repository status and limitation

This workspace contains the complete source and a local Git-ready project, including `.gitignore`, package metadata, tests, and documentation. A private GitHub repository and production URL cannot be created from this environment without GitHub/deployment credentials or an authenticated integration. No fake repository URL or fake deployment claim is included.

## Known limitations / next upgrades

- The humanoids are procedural and articulated rather than imported GLB skeletal assets. The architecture is ready for replacing `makeAvatar()` with optimized local GLB rigs and an `AnimationMixer` without changing multiplayer messages.
- Shared room state is memory-backed on the server; durable multiplayer persistence needs Redis/Postgres/Supabase or another production store.
- Vehicle movement is synchronized for the compact prototype, but detailed door/seat/steering animations are next.
- Cooking, dates, and decoration are functional vertical-slice activities; a larger content pass can add shopping carts, cleaning zones, picnic placement, weather/rain, and richer spatial audio.
- Browser voice chat is not enabled. Quick Persian chat is live and the WebRTC insertion point is the room transport layer.
