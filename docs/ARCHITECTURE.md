# Architecture notes

## Runtime boundaries

```text
index.html / styles.css
        |
        +-- main.js
        |     +-- Three.js scene + input
        |     +-- data-driven interaction registry
        |     +-- procedural articulated avatars
        |     +-- animation/alignment layer
        |     +-- shared state serializer
        |     +-- room WebSocket adapter
        |     +-- localStorage/sessionStorage persistence
        |
        +-- server.mjs
              +-- static file server
              +-- WebSocket upgrade + frame parser
              +-- two-slot room registry
              +-- presence/reconnect tokens
              +-- shared patch relay
              +-- interaction proximity validation
              +-- vehicle authority
```

## Roles and ownership

- **Local player state**: camera yaw/pitch, input keys, local movement velocity, local interaction lock, local UI panels, local audio, local save position.
- **Remote player state**: last server broadcast transform, role, character appearance, animation, interaction, seat, and interpolation target.
- **Shared world state**: day/time/weather, wallet, inventory, relationship stats, memories, tasks, decorations, furniture transforms, character appearance.
- **Server authority**: room slots, role assignment, session/reconnect tokens, interaction target existence/proximity, vehicle seat assignment and vehicle movement relay.

## Message protocol

Client to server:

- `createRoom`: create a `HM-XXXX` room and claim the requested role.
- `joinRoom`: claim the open role in an existing room.
- `playerState`: throttled transform, animation, appearance, and car snapshot.
- `characterUpdate`: update the sender's appearance and shared character record.
- `interaction`: request an interaction with the other room client.
- `activity`: start/end a visible cooperative activity such as cooking.
- `sharedPatch`: send shared slice changes from the prototype client; the server allowlists and clamps state, including furniture layout.
- `vehicleRequest` / `vehicleUpdate`: claim/release a seat and update driver movement.
- `chat`: send a bounded quick phrase.

Server to client:

- `roomCreated`, `roomJoined`, `reconnected`
- `presence`
- `remoteState`
- `characterUpdate`
- `sharedState`
- `interaction`
- `activity`
- `vehicleState`
- `chat`
- `error`

## Interaction lifecycle

1. The client finds the nearest `registerInteractable()` target.
2. `E` opens `actionsFor(target.id)`.
3. Online partner actions become `interaction` requests; server checks both room membership and last known distance.
4. Server broadcasts one event to both clients.
5. Each client aligns the remote avatar to the local player anchor, locks local movement, sets the same action timer, animates articulated limbs, and restores movement.
6. Only the initiator applies shared relationship/memory/wallet effects to avoid double counting, then sends a shared patch.
7. Furniture edits use the same shared-state boundary; the server clamps sofa/table/bed positions and rotation before rebroadcasting.
8. Offline mode uses the same contextual actions with the AI companion and local state.

## Replacing the procedural avatar

`makeAvatar(character)` returns a root with `userData.parts` and `animateAvatar()` consumes animation names. A production GLB replacement can keep this interface:

- load a local optimized GLB/GLTF
- map named bones to `userData.parts`
- use `THREE.AnimationMixer` clips inside `animateAvatar`
- keep the network animation names (`idle`, `walk`, `run`, `hug`, `kiss`, `hold`, `dance`, `cook`, `drive`)

No multiplayer message schema change is needed.
