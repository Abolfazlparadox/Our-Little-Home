import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 5173);
const ROOT = __dirname;
const rooms = new Map();
const SESSION_TTL = 10 * 60 * 1000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function randomId(size = 8) {
  return crypto.randomBytes(Math.ceil(size / 2)).toString('hex').slice(0, size);
}

function roomCode() {
  let code = '';
  do code = `HM-${randomId(4).toUpperCase()}`; while (rooms.has(code));
  return code;
}

function sessionToken() {
  return crypto.randomBytes(18).toString('base64url');
}

function sanitizeCharacter(character = {}) {
  return {
    name: typeof character.name === 'string' ? character.name.slice(0, 24) : '',
    skin: typeof character.skin === 'string' ? character.skin.slice(0, 16) : '#c58b70',
    hair: typeof character.hair === 'string' ? character.hair.slice(0, 16) : '#171516',
    hairStyle: typeof character.hairStyle === 'string' ? character.hairStyle.slice(0, 16) : 'short',
    outfit: typeof character.outfit === 'string' ? character.outfit.slice(0, 16) : 'linen',
    eye: typeof character.eye === 'string' ? character.eye.slice(0, 16) : '#3b2925',
    eyeColor: typeof character.eyeColor === 'string' ? character.eyeColor.slice(0, 16) : (typeof character.eye === 'string' ? character.eye.slice(0, 16) : '#3b2925'),
    faceShape: typeof character.faceShape === 'string' ? character.faceShape.slice(0, 16) : 'soft',
    bodyBuild: typeof character.bodyBuild === 'string' ? character.bodyBuild.slice(0, 16) : 'natural',
    height: typeof character.height === 'string' ? character.height.slice(0, 16) : 'average',
    preset: typeof character.preset === 'string' ? character.preset.slice(0, 16) : 'casual',
    accessory: typeof character.accessory === 'string' ? character.accessory.slice(0, 16) : 'watch',
  };
}

function sanitizeSharedState(raw = {}) {
  const allowed = ['day', 'minutes', 'weather', 'wallet', 'characters', 'stats', 'inventory', 'decorations', 'tasks', 'memories'];
  const result = {};
  allowed.forEach((key) => { if (raw[key] !== undefined) result[key] = raw[key]; });
  if (result.characters) {
    result.characters = {
      abolfazl: sanitizeCharacter(result.characters.abolfazl),
      razieh: sanitizeCharacter(result.characters.razieh),
    };
  }
  if (result.memories && Array.isArray(result.memories)) result.memories = result.memories.slice(0, 80);
  return result;
}

function mergeSharedState(room, patch = {}) {
  const safe = sanitizeSharedState(patch);
  Object.entries(safe).forEach(([key, value]) => {
    if (key === 'characters' && value && typeof value === 'object') {
      room.sharedState.characters = { ...(room.sharedState.characters || {}), ...value };
    } else if (key === 'stats' || key === 'inventory' || key === 'decorations' || key === 'tasks') {
      room.sharedState[key] = { ...(room.sharedState[key] || {}), ...(value || {}) };
    } else {
      room.sharedState[key] = value;
    }
  });
}

function connectedPlayers(room) {
  return [...room.players.values()].map((player) => ({
    clientId: player.clientId,
    role: player.role,
    name: player.name,
    connected: Boolean(player.connected && player.socket),
    character: player.character,
    state: player.lastState || null,
    animation: player.lastState?.animation || 'idle',
  }));
}

function serialisePlayer(player) {
  return {
    clientId: player.clientId,
    role: player.role,
    name: player.name,
    connected: Boolean(player.connected && player.socket),
    character: player.character,
    state: player.lastState || null,
  };
}

function send(socket, payload) {
  if (!socket || socket.destroyed) return;
  const body = Buffer.from(JSON.stringify(payload));
  let header;
  if (body.length < 126) {
    header = Buffer.from([0x81, body.length]);
  } else if (body.length < 65536) {
    header = Buffer.alloc(4); header[0] = 0x81; header[1] = 126; header.writeUInt16BE(body.length, 2);
  } else {
    header = Buffer.alloc(10); header[0] = 0x81; header[1] = 127; header.writeBigUInt64BE(BigInt(body.length), 2);
  }
  socket.write(Buffer.concat([header, body]));
}

function sendError(socket, code, message) { send(socket, { type: 'error', code, message }); }

function broadcast(room, payload, exceptClientId = null) {
  room.players.forEach((player) => {
    if (player.clientId !== exceptClientId && player.connected && player.socket) send(player.socket, payload);
  });
}

function roomSnapshot(room) {
  return { roomCode: room.code, players: connectedPlayers(room), sharedState: room.sharedState, vehicle: room.vehicle };
}

function findAvailableRole(room, requested) {
  const occupied = new Set([...room.players.values()].filter((p) => p.connected || p.sessionActive).map((p) => p.role));
  if (requested && !occupied.has(requested)) return requested;
  return ['abolfazl', 'razieh'].find((role) => !occupied.has(role)) || null;
}

function createRoom(message, client) {
  const requested = message.role === 'razieh' ? 'razieh' : 'abolfazl';
  const code = roomCode();
  const role = requested;
  const room = { code, createdAt: Date.now(), sharedState: sanitizeSharedState(message.sharedState || {}), players: new Map(), vehicle: { driverId: null, passengerId: null, x: 0, z: 16.6, heading: 0, speed: 0 }, cleanupTimer: null };
  rooms.set(code, room);
  attachClient(room, client, role, message.character, true);
}

function joinRoom(message, client) {
  const code = String(message.roomCode || '').trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) { sendError(client.socket, 'roomNotFound', 'این کد اتاق پیدا نشد.'); return; }
  let role = message.role === 'razieh' || message.role === 'abolfazl' ? message.role : null;
  if (!role) role = findAvailableRole(room, null);
  const existing = [...room.players.values()].find((p) => p.role === role && p.sessionToken === message.sessionToken);
  if (existing) {
    reconnectClient(room, existing, client, message.character);
    return;
  }
  role = findAvailableRole(room, role);
  if (!role) { sendError(client.socket, 'roomFull', 'این خانه همین حالا دو نفر دارد.'); return; }
  attachClient(room, client, role, message.character, false);
}

function attachClient(room, client, role, character, isCreator) {
  const player = {
    clientId: client.clientId,
    role,
    name: role === 'razieh' ? 'راضیه' : 'ابوالفضل',
    character: sanitizeCharacter(character || room.sharedState.characters?.[role] || {}),
    socket: client.socket,
    connected: true,
    sessionActive: true,
    sessionToken: sessionToken(),
    lastState: null,
    lastSeen: Date.now(),
  };
  room.players.set(player.clientId, player);
  client.roomCode = room.code; client.player = player;
  if (!room.sharedState.characters) room.sharedState.characters = {};
  room.sharedState.characters[role] = player.character;
  send(client.socket, {
    type: isCreator ? 'roomCreated' : 'roomJoined',
    roomCode: room.code,
    clientId: player.clientId,
    sessionToken: player.sessionToken,
    role: player.role,
    sharedState: room.sharedState,
    players: connectedPlayers(room),
    vehicle: room.vehicle,
  });
  room.players.forEach((other) => {
    if (other.clientId !== player.clientId && other.connected && other.socket) {
      send(other.socket, { type: 'presence', ...roomSnapshot(room) });
      if (player.lastState) send(other.socket, { type: 'remoteState', player: serialisePlayer(player) });
    }
  });
  cleanupRoomLater(room);
}

function reconnectClient(room, player, client, character) {
  player.socket = client.socket;
  player.connected = true;
  player.lastSeen = Date.now();
  player.character = sanitizeCharacter(character || player.character);
  client.roomCode = room.code; client.player = player;
  send(client.socket, { type: 'reconnected', roomCode: room.code, clientId: player.clientId, sessionToken: player.sessionToken, role: player.role, sharedState: room.sharedState, players: connectedPlayers(room), vehicle: room.vehicle });
  broadcast(room, { type: 'presence', ...roomSnapshot(room) });
}

function leaveClient(client, permanent = false) {
  const room = client.roomCode ? rooms.get(client.roomCode) : null;
  const player = client.player;
  if (!room || !player) return;
  if (permanent) {
    room.players.delete(player.clientId);
  } else {
    player.connected = false;
    player.socket = null;
    player.lastSeen = Date.now();
  }
  if (room.vehicle.driverId === player.clientId) room.vehicle.driverId = room.vehicle.passengerId || null;
  if (room.vehicle.passengerId === player.clientId) room.vehicle.passengerId = null;
  if (!room.vehicle.driverId) room.vehicle.passengerId = null;
  broadcast(room, { type: 'presence', ...roomSnapshot(room) });
  broadcast(room, { type: 'vehicleState', vehicle: room.vehicle });
  cleanupRoomLater(room);
}

function cleanupRoomLater(room) {
  if (room.cleanupTimer) clearTimeout(room.cleanupTimer);
  room.cleanupTimer = setTimeout(() => {
    const now = Date.now();
    const active = [...room.players.values()].some((player) => player.connected && player.socket);
    if (!active && [...room.players.values()].every((player) => now - player.lastSeen > SESSION_TTL)) rooms.delete(room.code);
    else cleanupRoomLater(room);
  }, SESSION_TTL);
}

function handleMessage(client, message) {
  if (!message || typeof message.type !== 'string') return;
  if (message.type === 'createRoom') { createRoom(message, client); return; }
  if (message.type === 'joinRoom') { joinRoom(message, client); return; }
  if (message.type === 'ping') { send(client.socket, { type: 'pong', at: Date.now() }); return; }
  const room = client.roomCode ? rooms.get(client.roomCode) : null;
  const player = client.player;
  if (!room || !player) { sendError(client.socket, 'notInRoom', 'ابتدا یک اتاق بسازید یا وارد اتاق شوید.'); return; }
  player.lastSeen = Date.now();
  if (message.type === 'playerState') {
    player.lastState = {
      position: { x: Number(message.state?.position?.x || 0), y: Number(message.state?.position?.y || 0), z: Number(message.state?.position?.z || 0) },
      rotation: { yaw: Number(message.state?.rotation?.yaw || 0), pitch: Number(message.state?.rotation?.pitch || 0) },
      animation: String(message.state?.animation || 'idle').slice(0, 24),
      interaction: message.state?.interaction ? String(message.state.interaction).slice(0, 32) : null,
      car: message.state?.car ? { mode: Boolean(message.state.car.mode), x: Number(message.state.car.x || 0), z: Number(message.state.car.z || 0), heading: Number(message.state.car.heading || 0) } : null,
      at: Date.now(),
    };
    player.character = sanitizeCharacter(message.character || player.character);
    broadcast(room, { type: 'remoteState', player: serialisePlayer(player) }, player.clientId);
  } else if (message.type === 'characterUpdate') {
    player.character = sanitizeCharacter(message.character || player.character);
    room.sharedState.characters = { ...(room.sharedState.characters || {}), [player.role]: player.character };
    broadcast(room, { type: 'characterUpdate', clientId: player.clientId, role: player.role, character: player.character });
    broadcast(room, { type: 'sharedState', sharedState: room.sharedState });
  } else if (message.type === 'interaction') {
    const targetId = String(message.targetClientId || '');
    const target = room.players.get(targetId);
    if (!target || !target.connected) { sendError(client.socket, 'targetUnavailable', 'همراه شما در دسترس نیست.'); return; }
    const action = String(message.action || '').slice(0, 24);
    const a = player.lastState?.position; const b = target.lastState?.position;
    if (a && b && Math.hypot((a.x || 0) - (b.x || 0), (a.z || 0) - (b.z || 0)) > 4.5) { sendError(client.socket, 'tooFar', 'برای این تعامل کمی نزدیک‌تر بایستید.'); return; }
    broadcast(room, { type: 'interaction', eventId: randomId(10), action, initiatorId: player.clientId, targetId, initiatorRole: player.role, targetRole: target.role, at: Date.now() });
  } else if (message.type === 'sharedPatch') {
    mergeSharedState(room, message.patch || {});
    broadcast(room, { type: 'sharedState', sharedState: room.sharedState });
  } else if (message.type === 'activity') {
    const action = String(message.action || '').slice(0, 24);
    const status = message.status === 'end' ? 'end' : 'start';
    broadcast(room, { type: 'activity', action, status, initiatorId: player.clientId, role: player.role, at: Date.now() });
  } else if (message.type === 'vehicleRequest') {
    const action = String(message.action || '');
    if (action === 'enter') {
      if (!room.vehicle.driverId) room.vehicle.driverId = player.clientId;
      else if (!room.vehicle.passengerId && room.vehicle.driverId !== player.clientId) room.vehicle.passengerId = player.clientId;
      else { sendError(client.socket, 'vehicleFull', 'ماشین همین حالا دو سرنشین دارد.'); return; }
      broadcast(room, { type: 'vehicleState', vehicle: room.vehicle });
    } else if (action === 'exit') {
      if (room.vehicle.driverId === player.clientId) room.vehicle.driverId = room.vehicle.passengerId || null;
      else if (room.vehicle.passengerId === player.clientId) room.vehicle.passengerId = null;
      if (!room.vehicle.driverId) room.vehicle.passengerId = null;
      broadcast(room, { type: 'vehicleState', vehicle: room.vehicle });
    }
  } else if (message.type === 'vehicleUpdate') {
    if (room.vehicle.driverId !== player.clientId) return;
    room.vehicle.x = Math.max(-14, Math.min(14, Number(message.vehicle?.x || room.vehicle.x)));
    room.vehicle.z = Math.max(14.3, Math.min(24.1, Number(message.vehicle?.z || room.vehicle.z)));
    room.vehicle.heading = Number(message.vehicle?.heading || room.vehicle.heading);
    room.vehicle.speed = Number(message.vehicle?.speed || 0);
    broadcast(room, { type: 'vehicleState', vehicle: room.vehicle }, player.clientId);
  } else if (message.type === 'chat') {
    const text = String(message.text || '').trim().slice(0, 120);
    if (text) broadcast(room, { type: 'chat', clientId: player.clientId, role: player.role, text, at: Date.now() });
  } else if (message.type === 'leaveRoom') {
    leaveClient(client, true);
    client.roomCode = null; client.player = null;
    send(client.socket, { type: 'leftRoom' });
  }
}

function createClient(socket) {
  return { socket, clientId: randomId(12), roomCode: null, player: null, buffer: Buffer.alloc(0) };
}

function consumeFrames(client, chunk) {
  client.buffer = Buffer.concat([client.buffer, chunk]);
  while (client.buffer.length >= 2) {
    const first = client.buffer[0]; const second = client.buffer[1];
    const opcode = first & 0x0f; const masked = (second & 0x80) !== 0;
    let length = second & 0x7f; let offset = 2;
    if (length === 126) { if (client.buffer.length < 4) return; length = client.buffer.readUInt16BE(2); offset = 4; }
    else if (length === 127) { if (client.buffer.length < 10) return; const big = client.buffer.readBigUInt64BE(2); if (big > BigInt(Number.MAX_SAFE_INTEGER)) return; length = Number(big); offset = 10; }
    const maskOffset = masked ? 4 : 0;
    if (client.buffer.length < offset + maskOffset + length) return;
    let payload = client.buffer.subarray(offset + maskOffset, offset + maskOffset + length);
    if (masked) {
      const mask = client.buffer.subarray(offset, offset + 4);
      const unmasked = Buffer.alloc(length);
      for (let i = 0; i < length; i += 1) unmasked[i] = payload[i] ^ mask[i % 4];
      payload = unmasked;
    }
    client.buffer = client.buffer.subarray(offset + maskOffset + length);
    if (opcode === 0x8) { client.socket.end(); return; }
    if (opcode === 0x9) { client.socket.write(Buffer.from([0x8a, payload.length])); if (payload.length) client.socket.write(payload); continue; }
    if (opcode === 0x1) {
      try { handleMessage(client, JSON.parse(payload.toString('utf8'))); } catch (error) { sendError(client.socket, 'badMessage', 'پیام نامعتبر بود.'); }
    }
  }
}

function serveStatic(req, res) {
  let requestPath = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  try { requestPath = decodeURIComponent(requestPath); } catch (_) { /* keep original */ }
  if (requestPath === '/') requestPath = '/index.html';
  const filePath = path.resolve(ROOT, `.${requestPath}`);
  if (!(filePath === ROOT || filePath.startsWith(`${ROOT}${path.sep}`)) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(serveStatic);
server.on('upgrade', (req, socket) => {
  if (!req.url?.startsWith('/ws') || req.headers.upgrade?.toLowerCase() !== 'websocket') { socket.destroy(); return; }
  const key = req.headers['sec-websocket-key'];
  if (!key) { socket.destroy(); return; }
  const accept = crypto.createHash('sha1').update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  const client = createClient(socket);
  socket.on('data', (chunk) => consumeFrames(client, chunk));
  socket.on('error', () => leaveClient(client));
  socket.on('close', () => leaveClient(client));
});

server.listen(PORT, '0.0.0.0', () => console.log(`Our Little Home server listening on http://0.0.0.0:${PORT}`));
