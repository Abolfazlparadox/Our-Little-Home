import assert from 'node:assert/strict';
import net from 'node:net';

class RawWebSocketClient {
  constructor(label, port = Number(process.env.PORT || 5173)) {
    this.label = label;
    this.port = port;
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this.handshakeBuffer = Buffer.alloc(0);
    this.handshake = false;
    this.messages = [];
    this.waiters = [];
  }

  async connect() {
    this.socket = net.createConnection(this.port, '127.0.0.1');
    this.socket.on('data', (chunk) => this.receive(chunk));
    await new Promise((resolve, reject) => {
      this.socket.once('connect', resolve);
      this.socket.once('error', reject);
    });
    const key = Buffer.from(`our-little-home-${this.label}`).toString('base64');
    this.socket.write(`GET /ws HTTP/1.1\r\nHost: localhost\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`);
    await this.waitForHandshake();
    return this;
  }

  receive(chunk) {
    if (!this.handshake) {
      this.handshakeBuffer = Buffer.concat([this.handshakeBuffer, chunk]);
      const marker = this.handshakeBuffer.indexOf(Buffer.from('\r\n\r\n'));
      if (marker === -1) return;
      this.handshake = true;
      const rest = this.handshakeBuffer.subarray(marker + 4);
      this.handshakeBuffer = Buffer.alloc(0);
      if (rest.length) this.buffer = Buffer.concat([this.buffer, rest]);
    } else this.buffer = Buffer.concat([this.buffer, chunk]);
    this.parseFrames();
  }

  parseFrames() {
    while (this.buffer.length >= 2) {
      let length = this.buffer[1] & 0x7f;
      let offset = 2;
      if (length === 126) { if (this.buffer.length < 4) return; length = this.buffer.readUInt16BE(2); offset = 4; }
      else if (length === 127) throw new Error('Unexpected oversized test frame');
      if (this.buffer.length < offset + length) return;
      const payload = this.buffer.subarray(offset, offset + length);
      this.buffer = this.buffer.subarray(offset + length);
      const message = JSON.parse(payload.toString('utf8'));
      const waiter = this.waiters.find((candidate) => candidate.predicate(message));
      if (waiter) { this.waiters = this.waiters.filter((candidate) => candidate !== waiter); waiter.resolve(message); }
      else this.messages.push(message);
    }
  }

  waitForHandshake() {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        if (this.handshake) return resolve();
        if (Date.now() - started > 2500) return reject(new Error(`${this.label} websocket handshake timeout`));
        setTimeout(check, 15);
      };
      check();
    });
  }

  send(payload) {
    const body = Buffer.from(JSON.stringify(payload));
    const mask = Buffer.from([17, 29, 43, 61]);
    let header;
    if (body.length < 126) header = Buffer.from([0x81, 0x80 | body.length]);
    else { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 0xfe; header.writeUInt16BE(body.length, 2); }
    const masked = Buffer.alloc(body.length);
    for (let index = 0; index < body.length; index += 1) masked[index] = body[index] ^ mask[index % 4];
    this.socket.write(Buffer.concat([header, mask, masked]));
  }

  waitFor(predicate, timeout = 2500) {
    const buffered = this.messages.find(predicate);
    if (buffered) { this.messages = this.messages.filter((message) => message !== buffered); return Promise.resolve(buffered); }
    return new Promise((resolve, reject) => {
      const waiter = { predicate, resolve, reject };
      this.waiters.push(waiter);
      setTimeout(() => {
        if (this.waiters.includes(waiter)) { this.waiters = this.waiters.filter((item) => item !== waiter); reject(new Error(`${this.label} timed out waiting for multiplayer message`)); }
      }, timeout);
    });
  }

  close() { this.socket?.destroy(); }
}

let abolfazl = await new RawWebSocketClient('abolfazl').connect();
const razieh = await new RawWebSocketClient('razieh').connect();
let reconnect = null;
try {
  abolfazl.send({ type: 'createRoom', role: 'abolfazl', character: { name: 'ابوالفضل' }, sharedState: { wallet: 100 } });
  const created = await abolfazl.waitFor((message) => message.type === 'roomCreated');
  assert.match(created.roomCode, /^HM-[A-Z0-9]{4}$/);

  razieh.send({ type: 'joinRoom', roomCode: created.roomCode, role: 'razieh', character: { name: 'راضیه' } });
  const joined = await razieh.waitFor((message) => message.type === 'roomJoined');
  assert.equal(joined.players.length, 2);
  await abolfazl.waitFor((message) => message.type === 'presence' && message.players.length === 2);

  abolfazl.send({ type: 'sharedPatch', patch: { furniture: { sofa: { x: -4.2, z: -1.1, rotation: 0.5 } } } });
  const shared = await razieh.waitFor((message) => message.type === 'sharedState' && message.sharedState.furniture?.sofa?.x === -4.2);
  assert.equal(shared.sharedState.furniture.sofa.z, -1.1);

  const nearState = (x) => ({ position: { x, y: 1.62, z: 0 }, rotation: { yaw: 0, pitch: 0 }, animation: 'idle', car: { mode: false } });
  abolfazl.send({ type: 'playerState', state: nearState(0), character: { name: 'ابوالفضل' } });
  razieh.send({ type: 'playerState', state: nearState(.6), character: { name: 'راضیه' } });
  const remote = await razieh.waitFor((message) => message.type === 'remoteState');
  assert.equal(remote.player.role, 'abolfazl');

  abolfazl.send({ type: 'interaction', targetClientId: joined.clientId, action: 'hug' });
  const interaction = await razieh.waitFor((message) => message.type === 'interaction' && message.action === 'hug');
  assert.equal(interaction.targetId, joined.clientId);

  abolfazl.send({ type: 'vehicleRequest', action: 'enter' });
  const vehicle = await razieh.waitFor((message) => message.type === 'vehicleState');
  assert.equal(vehicle.vehicle.driverId, created.clientId);

  abolfazl.close();
  await razieh.waitFor((message) => message.type === 'presence' && message.players.some((player) => player.clientId === created.clientId && !player.connected));
  reconnect = await new RawWebSocketClient('reconnect').connect();
  reconnect.send({ type: 'joinRoom', roomCode: created.roomCode, role: 'abolfazl', sessionToken: created.sessionToken, character: { name: 'ابوالفضل' } });
  const reconnected = await reconnect.waitFor((message) => message.type === 'reconnected');
  assert.equal(reconnected.clientId, created.clientId);
  await razieh.waitFor((message) => message.type === 'presence' && message.players.some((player) => player.clientId === created.clientId && player.connected));

  console.log('multiplayer smoke passed:', created.roomCode);
} finally {
  abolfazl.close(); razieh.close(); reconnect?.close();
}
