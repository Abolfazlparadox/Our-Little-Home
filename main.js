import * as THREE from './assets/three.module.js';

const STORAGE_KEY = 'our-little-home-save-v1';
const NETWORK_SESSION_KEY = 'our-little-home-network-session-v1';
const SOUND_KEY = 'our-little-home-sound-v1';
const SERVER_URL_KEY = 'our-little-home-server-url-v1';
const fa = (value) => Number(value || 0).toLocaleString('fa-IR');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const SKINS = [
  { value: '#a96f59', label: 'گندمی' },
  { value: '#c58b70', label: 'گرم' },
  { value: '#e1a88c', label: 'هلویی' },
  { value: '#f0c2a4', label: 'روشن' },
];
const HAIR_COLORS = [
  { value: '#171516', label: 'مشکی' },
  { value: '#3b2521', label: 'قهوه‌ای' },
  { value: '#8b5d45', label: 'بلوطی' },
  { value: '#c4996f', label: 'فندقی' },
];
const HAIR_STYLES = [
  { value: 'short', label: 'کوتاه' },
  { value: 'waves', label: 'موج‌دار' },
  { value: 'long', label: 'بلند' },
];
const OUTFITS = [
  { value: 'linen', label: 'کتان روشن', color: '#e7dfd1' },
  { value: 'olive', label: 'سبز زیتونی', color: '#657d68' },
  { value: 'terracotta', label: 'آجری آرام', color: '#b8715d' },
  { value: 'home', label: 'راحتی خانه', color: '#c99e82' },
  { value: 'date', label: 'قرار شبانه', color: '#4f5e64' },
  { value: 'sleep', label: 'خواب آرام', color: '#9aa6a3' },
];
const FACE_SHAPES = [
  { value: 'soft', label: 'نرم' },
  { value: 'oval', label: 'بیضی' },
  { value: 'defined', label: 'مشخص' },
];
const EYE_COLORS = [
  { value: '#3b2925', label: 'قهوه‌ای' },
  { value: '#30484a', label: 'سبز تیره' },
  { value: '#5b3b2d', label: 'عسلی' },
  { value: '#263b57', label: 'آبی شب' },
];
const BODY_BUILDS = [
  { value: 'slim', label: 'ظریف' },
  { value: 'natural', label: 'طبیعی' },
  { value: 'strong', label: 'قوی' },
];
const HEIGHTS = [
  { value: 'short', label: 'کوتاه' },
  { value: 'average', label: 'متوسط' },
  { value: 'tall', label: 'بلند' },
];
const ACCESSORIES = [
  { value: 'none', label: 'بدون اکسسوری' },
  { value: 'watch', label: 'ساعت' },
  { value: 'necklace', label: 'گردنبند' },
  { value: 'glasses', label: 'عینک' },
];

const DIALOGUE_LINES = [
  'خسته نباشی ❤️',
  'امروز چیکار کنیم؟',
  'بیا یه چایی برات بریزم.',
  'دلم برات تنگ شده بود.',
  'این خونه با تو قشنگ‌تره.',
  'شام چی بخوریم؟ چیزی سبک؟',
  'بریم بیرون؟ حتی یه دور کوتاه.',
  'امروز خیلی خسته‌ام، ولی دیدنت حالمو بهتر کرد.',
];
const REPLY_LINES = [
  'منم همین‌طور. اول یه نفس بکشیم.',
  'هر جا تو باشی، همون‌جا خوبه.',
  'باشه، امشب رو برای خودمون نگه می‌داریم.',
];
const MEMORY_PHOTOS = [
  { src: 'assets/memories/memory-car-flowers.jpg', title: 'یک شب پر از گل', detail: 'دست‌های ما، راه کوتاه خانه' },
  { src: 'assets/memories/memory-mirror.jpg', title: 'یک قاب دونفره', detail: 'کنار هم، نزدیک آینه' },
  { src: 'assets/memories/memory-picnic.jpg', title: 'قرار زیر درخت', detail: 'یک بعدازظهر آرام بیرون از خانه' },
];

function createDefaultState() {
  return {
    version: 1,
    day: 1,
    minutes: 18 * 60 + 30,
    weather: 'clear',
    wallet: 2450000,
    characters: {
      abolfazl: { name: 'ابوالفضل', skin: '#c58b70', hair: '#171516', hairStyle: 'short', outfit: 'linen', eye: '#3b2925', eyeColor: '#3b2925', faceShape: 'defined', bodyBuild: 'natural', height: 'average', accessory: 'watch', preset: 'casual' },
      razieh: { name: 'راضیه', skin: '#e1a88c', hair: '#171516', hairStyle: 'long', outfit: 'terracotta', eye: '#3b2925', eyeColor: '#3b2925', faceShape: 'soft', bodyBuild: 'natural', height: 'average', accessory: 'necklace', preset: 'date' },
    },
    stats: { relationship: 78, happiness: 72, energy: 82, hunger: 67, hygiene: 86, trust: 84, comfort: 64, stress: 17 },
    inventory: { tea: 4, egg: 2, rice: 1, pasta: 1, preparedFood: 0 },
    decorations: { lamp: false, plant: false, photo: true, rug: false },
    furniture: {
      sofa: { x: -6.1, z: -1.65, rotation: 0 },
      table: { x: -5.5, z: .8, rotation: 0 },
      bed: { x: 7.2, z: 1.7, rotation: 0 },
    },
    tasks: { greet: false, cook: false, outside: false, date: false, decorate: false },
    memories: [
      { icon: '☾', title: 'اولین شب در خانه‌ی ما', detail: 'روز اول · چراغ‌های کوچک روشن شدند' },
    ],
    playerPosition: { x: 1.2, z: 6.6 },
    lastSaved: null,
  };
}

function normaliseState(raw) {
  const base = createDefaultState();
  if (!raw || typeof raw !== 'object') return base;
  const merged = {
    ...base,
    ...raw,
    characters: {
      abolfazl: { ...base.characters.abolfazl, ...((raw.characters && raw.characters.abolfazl) || {}) },
      razieh: { ...base.characters.razieh, ...((raw.characters && raw.characters.razieh) || {}) },
    },
    stats: { ...base.stats, ...(raw.stats || {}) },
    inventory: { ...base.inventory, ...(raw.inventory || {}) },
    decorations: { ...base.decorations, ...(raw.decorations || {}) },
    furniture: {
      sofa: { ...base.furniture.sofa, ...((raw.furniture && raw.furniture.sofa) || {}) },
      table: { ...base.furniture.table, ...((raw.furniture && raw.furniture.table) || {}) },
      bed: { ...base.furniture.bed, ...((raw.furniture && raw.furniture.bed) || {}) },
    },
    tasks: { ...base.tasks, ...(raw.tasks || {}) },
    memories: Array.isArray(raw.memories) ? raw.memories : base.memories,
    playerPosition: { ...base.playerPosition, ...(raw.playerPosition || {}) },
  };
  return merged;
}

let state = createDefaultState();
let savedStateExists = false;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = normaliseState(JSON.parse(saved));
    savedStateExists = true;
  }
} catch (error) {
  console.warn('Save data could not be loaded.', error);
}

const runtime = {
  gameReady: false,
  previewReady: false,
  modalPreviewReady: false,
  renderer: null,
  scene: null,
  camera: null,
  clock: null,
  animationFrame: null,
  previewRenderer: null,
  previewScene: null,
  previewCamera: null,
  previewAvatar: null,
  modalRenderer: null,
  modalScene: null,
  modalCamera: null,
  modalAvatar: null,
  worldGroup: null,
  decorationGroup: null,
  furnitureGroups: new Map(),
  furnitureColliders: new Map(),
  partner: null,
  partnerRole: 'razieh',
  partnerTarget: null,
  partnerTimer: 0,
  partnerAction: null,
  remotePlayers: new Map(),
  localAction: null,
  localAnimation: 'idle',
  interactionLock: false,
  cameraShake: 0,
  seated: null,
  localRole: 'abolfazl',
  chatLog: [],
  network: {
    ws: null,
    online: false,
    status: 'offline',
    roomCode: null,
    clientId: null,
    sessionToken: null,
    role: null,
    players: [],
    reconnectTimer: null,
    reconnectAttempts: 0,
    lastStateSent: 0,
    lastSharedClock: 0,
    pendingJoin: null,
    intentionalClose: false,
  },
  car: null,
  carMode: false,
  vehicleSeat: null,
  vehicleState: { driverId: null, passengerId: null, x: 0, z: 16.6, heading: 0, speed: 0 },
  carSpeed: 0,
  carHeading: 0,
  playerPos: new THREE.Vector3(1.2, 1.62, 6.6),
  velocity: new THREE.Vector3(),
  yaw: 0,
  pitch: -0.035,
  keys: {},
  touchMove: { x: 0, y: 0 },
  touchLooking: false,
  lastTouchLook: null,
  currentTarget: null,
  lastTargetId: null,
  colliders: [],
  interactables: [],
  dynamicLights: [],
  heartTimers: [],
  lastTime: 0,
  lastFootstep: 0,
  saveTimer: 0,
  hudTimer: 0,
  bobTime: 0,
  moving: false,
  paused: false,
  overlayOpen: false,
  customizingCharacter: 'abolfazl',
  startCustomizationCharacter: 'abolfazl',
  cooking: null,
  modalDate: null,
  previewAnimationStarted: false,
  introShown: false,
  worldNeedsReset: false,
  timeBucket: '',
  soundEnabled: true,
};

function normalizeServerWsUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let str = raw.trim();
  if (!str) return null;
  if (!str.startsWith('ws://') && !str.startsWith('wss://')) {
    if (str.startsWith('http://')) str = 'ws://' + str.slice(7);
    else if (str.startsWith('https://')) str = 'wss://' + str.slice(8);
    else {
      const isHttps = location.protocol === 'https:';
      str = (isHttps ? 'wss://' : 'ws://') + str;
    }
  }
  try {
    const u = new URL(str);
    if (!u.pathname || u.pathname === '/') u.pathname = '/ws';
    return u.toString();
  } catch (_) {
    return str.endsWith('/ws') ? str : `${str.replace(/\/+$/, '')}/ws`;
  }
}

function isStaticWorkerDomain() {
  const host = (location.hostname || '').toLowerCase();
  return host.endsWith('.workers.dev') || host.endsWith('.pages.dev') || host.endsWith('.github.io');
}

function getActiveWsUrl() {
  let custom = null;
  try { custom = localStorage.getItem(SERVER_URL_KEY); } catch (_) {}
  if (custom) {
    const normalized = normalizeServerWsUrl(custom);
    if (normalized) return normalized;
  }
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${location.host}/ws`;
}

try {
  const savedSound = localStorage.getItem(SOUND_KEY);
  if (savedSound !== null) runtime.soundEnabled = savedSound !== '0';
} catch (_) { /* sound preference is optional */ }

try {
  const savedNetworkSession = sessionStorage.getItem(NETWORK_SESSION_KEY);
  if (savedNetworkSession) {
    const restored = JSON.parse(savedNetworkSession);
    runtime.network.roomCode = restored.roomCode || null;
    runtime.network.clientId = restored.clientId || null;
    runtime.network.sessionToken = restored.sessionToken || null;
    runtime.network.role = restored.role || null;
    runtime.localRole = restored.role || runtime.localRole;
  }
} catch (_) { /* reconnect is optional */ }

try {
  const urlParams = new URLSearchParams(window.location.search);
  const serverParam = urlParams.get('server') || urlParams.get('ws') || urlParams.get('backend');
  if (serverParam) {
    const normalized = normalizeServerWsUrl(serverParam);
    if (normalized) localStorage.setItem(SERVER_URL_KEY, normalized);
  }
} catch (_) { /* url params optional */ }

function isGameVisible() { return $('#game-screen').classList.contains('active'); }
function isMobile() { return window.matchMedia('(max-width: 760px)').matches || 'ontouchstart' in window; }
function hasOpenPanel() { return runtime.overlayOpen || runtime.paused; }

function setScreen(id) {
  $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.id === id));
}

function saveGame(showFeedback = true) {
  try {
    state.playerPosition = { x: Number(runtime.playerPos.x.toFixed(2)), z: Number(runtime.playerPos.z.toFixed(2)) };
    state.lastSaved = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    savedStateExists = true;
    updateContinueButton();
    if (runtime.network.online) syncSharedState();
    if (showFeedback) {
      $('#save-toast').classList.add('show');
      setTimeout(() => $('#save-toast').classList.remove('show'), 1900);
      playTone('save');
    }
  } catch (error) {
    console.warn('Save data could not be written.', error);
    showToast('ذخیره انجام نشد؛ حافظه‌ی مرورگر را بررسی کنید.');
  }
}

function updateContinueButton() {
  const button = $('#continue-btn');
  if (!button) return;
  button.style.opacity = savedStateExists ? '1' : '.48';
  button.querySelector('small').textContent = savedStateExists ? 'از آخرین ذخیره' : 'هنوز ذخیره‌ای نیست';
}

function clearSave() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* no-op */ }
  savedStateExists = false;
  updateContinueButton();
}

function openCustomize(fromStart = true) {
  if (fromStart && !runtime.network.online) runtime.localRole = 'abolfazl';
  runtime.startCustomizationCharacter = fromStart ? 'abolfazl' : runtime.customizingCharacter;
  runtime.customizingCharacter = runtime.startCustomizationCharacter;
  setScreen('customize-screen');
  renderCustomizationScreen();
  initPreviewRenderer();
}

function openGame() {
  runtime.paused = false;
  setScreen('game-screen');
  if (!runtime.gameReady) initGame();
  else if (runtime.worldNeedsReset) {
    runtime.scene.clear();
    buildWorld();
    addWorldPartner();
    runtime.worldNeedsReset = false;
  }
  runtime.playerPos.set(state.playerPosition.x, 1.62, state.playerPosition.z);
  if (runtime.network.roomCode && runtime.network.sessionToken && !runtime.network.online) {
    runtime.network.pendingJoin = { type: 'joinRoom', roomCode: runtime.network.roomCode, role: runtime.network.role, sessionToken: runtime.network.sessionToken, character: state.characters[runtime.network.role || 'abolfazl'] };
    connectToRoomServer();
  }
  closePanels();
  updateHUD(true);
  if (!runtime.introShown) {
    runtime.introShown = true;
    setTimeout(() => showToast('برای حرکت کلیک کنید · WASD برای قدم زدن', true), 500);
    setTimeout(() => showToast('راضیه نزدیک نشیمن منتظر شماست.', false), 3100);
  }
}

function backToTitle() {
  saveGame(false);
  runtime.paused = false;
  closePanels();
  if (document.pointerLockElement) document.exitPointerLock();
  setScreen('start-screen');
  updateContinueButton();
}

function handleAction(action) {
  switch (action) {
    case 'new-game':
      leaveNetworkSession();
      state = createDefaultState();
      runtime.worldNeedsReset = true;
      clearSave();
      openMultiplayerModal('create');
      break;
    case 'continue-game':
      if (!savedStateExists) {
        showStartNotice('هنوز خانه‌ای ذخیره نشده؛ اول یک زندگی تازه شروع کنید.');
        break;
      }
      try { state = normaliseState(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch (_) { /* state already loaded */ }
      openGame();
      break;
    case 'open-customize-start': openCustomize(true); break;
    case 'toggle-server-settings': toggleServerSettings(); break;
    case 'save-server-url': saveServerUrlFromInput(); break;
    case 'close-multiplayer': closeMultiplayerModal(); break;
    case 'create-room': createCoupleRoom(); break;
    case 'join-room': joinCoupleRoom(); break;
    case 'enter-multiplayer-room': openCustomize(false); break;
    case 'offline-mode': closeMultiplayerModal(); leaveNetworkSession(); openCustomize(true); break;
    case 'copy-room-code': copyRoomCode(); break;
    case 'open-chat': openQuickChat(); break;
    case 'open-memories-start':
      openGame();
      setTimeout(() => openMemoryModal(), 120);
      break;
    case 'open-settings-start': openStartSettings(); break;
    case 'back-to-start': backToTitle(); break;
    case 'enter-home': saveGame(false); openGame(); break;
    case 'open-phone': openPhone('home'); break;
    case 'open-phone-money': openPhone('home'); break;
    case 'save-game': saveGame(true); break;
    case 'pause-game': openPause(); break;
    case 'resume-game': closePause(); break;
    case 'back-to-title': backToTitle(); break;
    case 'close-panels': closePanels(); break;
    case 'dialogue-reply':
      applyDelta({ relationship: 2, happiness: 2, stress: -1 });
      $('#dialogue-text').textContent = REPLY_LINES[Math.floor(Math.random() * REPLY_LINES.length)];
      showToast('یک گفت‌وگوی کوتاه، یک حال بهتر.', true);
      setTimeout(closePanels, 1250);
      break;
    case 'save-custom-modal': saveModalCustomization(); break;
    case 'open-decor': openDecorPanel(); break;
    case 'new-life-settings': openStartSettings(); break;
    default: break;
  }
}

function showStartNotice(message) {
  const note = $('.header-note');
  const old = note.textContent;
  note.textContent = message;
  note.style.color = 'var(--gold)';
  setTimeout(() => { note.textContent = old; note.style.color = ''; }, 2600);
}

function setSoundEnabled(enabled) {
  runtime.soundEnabled = Boolean(enabled);
  try { localStorage.setItem(SOUND_KEY, runtime.soundEnabled ? '1' : '0'); } catch (_) { /* preference is optional */ }
}

function openStartSettings() {
  const existing = $('#start-settings-modal');
  if (existing) existing.remove();
  const panel = document.createElement('div');
  panel.id = 'start-settings-modal';
  panel.className = 'start-settings-modal';
  panel.innerHTML = `<div class="start-settings-card"><button class="close-btn" data-close-start-settings>×</button><span class="eyebrow">تنظیمات آرام</span><h3>خانه‌ی ما</h3><p>بازی از اول شخص و موبایل پشتیبانی می‌کند؛ اتاق دونفره از منوی «شروع زندگی» ساخته می‌شود و پیشرفت روی همین دستگاه هم ذخیره می‌ماند.</p><div class="settings-row"><span>زبان رابط</span><b>فارسی · راست‌چین</b></div><div class="settings-row"><span>کنترل پیشنهادی</span><b>WASD + ماوس</b></div><div class="settings-row"><span>صدا</span><button class="settings-toggle ${runtime.soundEnabled ? 'active' : ''}" data-toggle-sound>${runtime.soundEnabled ? 'روشن' : 'خاموش'}</button></div><button class="secondary-btn full" data-close-start-settings>متوجه شدم</button></div>`;
  $('#start-screen').appendChild(panel);
  panel.querySelectorAll('[data-close-start-settings]').forEach((button) => button.addEventListener('click', () => panel.remove()));
  panel.querySelector('[data-toggle-sound]').addEventListener('click', (event) => {
    const enabled = !runtime.soundEnabled;
    setSoundEnabled(enabled);
    event.currentTarget.classList.toggle('active', enabled);
    event.currentTarget.textContent = enabled ? 'روشن' : 'خاموش';
  });
}

/* ---------- realtime room / multiplayer ---------- */
function updateServerSettingsUI() {
  let custom = null;
  try { custom = localStorage.getItem(SERVER_URL_KEY); } catch (_) {}
  const input = $('#server-url-input');
  const summary = $('#mp-server-summary');
  if (input && custom) input.value = custom;
  if (summary) {
    if (custom) {
      try {
        const u = new URL(custom);
        summary.textContent = `سرور: ${u.host}`;
      } catch (_) {
        summary.textContent = 'سرور: سفارشی';
      }
    } else if (isStaticWorkerDomain()) {
      summary.textContent = 'سرور: نیاز به تنظیم بک‌اند';
    } else {
      summary.textContent = 'سرور اتاق: خودکار';
    }
  }
  if (isStaticWorkerDomain() && !custom) {
    $('#mp-server-box')?.classList.remove('hidden');
    const arrow = $('#mp-server-arrow');
    if (arrow) arrow.textContent = '▴';
  }
}

function toggleServerSettings() {
  const box = $('#mp-server-box');
  const arrow = $('#mp-server-arrow');
  if (!box) return;
  const isHidden = box.classList.toggle('hidden');
  if (arrow) arrow.textContent = isHidden ? '▾' : '▴';
}

function saveServerUrlFromInput() {
  const input = $('#server-url-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    try { localStorage.removeItem(SERVER_URL_KEY); } catch (_) {}
    updateServerSettingsUI();
    showToast('آدرس سرور به حالت پیش‌فرض بازگشت.', false);
    leaveNetworkSession();
    connectToRoomServer();
    return;
  }
  const normalized = normalizeServerWsUrl(val);
  if (!normalized) {
    showToast('آدرس سرور نامعتبر است.', false);
    return;
  }
  try { localStorage.setItem(SERVER_URL_KEY, normalized); } catch (_) {}
  updateServerSettingsUI();
  showToast('آدرس سرور اتاق با موفقیت ذخیره شد.', true);
  leaveNetworkSession();
  connectToRoomServer();
}

function openMultiplayerModal(mode = 'create') {
  const modal = $('#multiplayer-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  setMultiplayerMode(mode);
  const role = runtime.network.role || runtime.localRole || 'abolfazl';
  setSelectedRole(role);
  updateServerSettingsUI();
  setRoomStatus('برای شروع، نقش خودتان را انتخاب کنید.', 'idle');
  setConnectionIndicator(runtime.network.status || 'offline');
  connectToRoomServer();
}

function closeMultiplayerModal() {
  $('#multiplayer-modal')?.classList.add('hidden');
}

function leaveNetworkSession() {
  const network = runtime.network;
  network.intentionalClose = true;
  if (network.ws && network.ws.readyState === WebSocket.OPEN) {
    try { network.ws.send(JSON.stringify({ type: 'leaveRoom' })); } catch (_) { /* optional */ }
    network.ws.close();
  }
  network.online = false; network.status = 'offline'; network.roomCode = null; network.clientId = null; network.sessionToken = null; network.players = []; network.pendingJoin = null;
  try { sessionStorage.removeItem(NETWORK_SESSION_KEY); } catch (_) { /* optional */ }
  setConnectionIndicator('offline');
  setTimeout(() => { network.intentionalClose = false; }, 200);
}

function setMultiplayerMode(mode = 'create') {
  const isJoin = mode === 'join';
  $$('.mp-mode-tabs button').forEach((button) => button.classList.toggle('active', button.dataset.mpMode === mode));
  $('#mp-join-field')?.classList.toggle('hidden', !isJoin);
  $('#create-room-btn')?.classList.toggle('hidden', isJoin || Boolean(runtime.network.roomCode));
  $('#join-room-btn')?.classList.toggle('hidden', !isJoin || Boolean(runtime.network.roomCode));
  $('#enter-room-btn')?.classList.toggle('hidden', !runtime.network.roomCode);
  $('#mp-code-box')?.classList.toggle('hidden', !runtime.network.roomCode);
}

function setSelectedRole(role) {
  const safeRole = role === 'razieh' ? 'razieh' : 'abolfazl';
  runtime.localRole = safeRole;
  runtime.network.role = safeRole;
  $$('.mp-role').forEach((button) => button.classList.toggle('active', button.dataset.role === safeRole));
  updateCustomizationRoleStatus();
}

function setRoomStatus(message, kind = 'idle') {
  const node = $('#mp-status');
  if (!node) return;
  node.className = `mp-status ${kind}`;
  node.innerHTML = `<span class="status-dot"></span><span>${message}</span>`;
}

function setConnectionIndicator(status) {
  const dot = $('#mp-connection-dot');
  const text = $('#mp-connection-text');
  const labels = { connecting: 'در حال اتصال به سرور اتاق…', connected: 'سرور اتاق متصل است', offline: 'حالت آفلاین', disconnected: 'اتصال قطع شد؛ تلاش برای وصل شدن…' };
  if (dot) dot.className = `connection-dot ${status}`;
  if (text) text.textContent = labels[status] || status;
  updateNetworkHUD();
}

function connectToRoomServer() {
  const network = runtime.network;
  if (network.ws && (network.ws.readyState === WebSocket.OPEN || network.ws.readyState === WebSocket.CONNECTING)) return;
  if (!window.WebSocket || !location.host) {
    network.status = 'offline'; setConnectionIndicator('offline');
    setRoomStatus('این پیش‌نمایش سرور اتاق ندارد؛ حالت آفلاین همچنان آماده است.', 'error');
    return;
  }

  let custom = null;
  try { custom = localStorage.getItem(SERVER_URL_KEY); } catch (_) {}
  if (!custom && isStaticWorkerDomain()) {
    network.status = 'offline';
    setConnectionIndicator('offline');
    setRoomStatus('بازی روی Workers.dev اجرا شده است. برای اتاق آنلاین، آدرس سرور بک‌اند (مانند Render) را در کادر تنظیم سرور وارد کنید.', 'error');
    $('#mp-server-box')?.classList.remove('hidden');
    const arrow = $('#mp-server-arrow');
    if (arrow) arrow.textContent = '▴';
    return;
  }

  network.status = 'connecting'; setConnectionIndicator('connecting');
  const wsUrl = getActiveWsUrl();
  try {
    network.ws = new WebSocket(wsUrl);
  } catch (error) {
    network.status = 'offline'; setConnectionIndicator('offline'); setRoomStatus('اتصال اتاق در دسترس نیست؛ آدرس سرور را بررسی کنید.', 'error'); return;
  }
  network.ws.addEventListener('open', () => {
    network.status = 'connected'; network.reconnectAttempts = 0; setConnectionIndicator('connected');
    setRoomStatus('سرور اتاق متصل شد؛ آماده ساختن یا ورود به اتاق.', 'success');
    if (network.pendingJoin) { const pending = network.pendingJoin; network.pendingJoin = null; sendNetwork(pending); }
  });
  network.ws.addEventListener('message', (event) => {
    try { handleNetworkMessage(JSON.parse(event.data)); } catch (_) { setRoomStatus('پیام اتاق قابل خواندن نبود.', 'error'); }
  });
  network.ws.addEventListener('error', () => {
    network.status = 'disconnected'; setConnectionIndicator('disconnected');
    if (!network.roomCode) {
      if (isStaticWorkerDomain() && !custom) {
        setRoomStatus('سرور اتاق در Workers.dev فعال نیست؛ لطفاً در کادر تنظیم سرور، آدرس سرور بک‌اند را وارد کنید.', 'error');
        $('#mp-server-box')?.classList.remove('hidden');
      } else {
        setRoomStatus('سرور اتاق پاسخ نداد؛ آدرس سرور را بررسی کنید یا آفلاین بازی کنید.', 'error');
      }
    }
  });
  network.ws.addEventListener('close', () => {
    network.ws = null;
    if (network.intentionalClose) { network.status = 'offline'; setConnectionIndicator('offline'); return; }
    network.status = network.roomCode ? 'disconnected' : 'offline'; setConnectionIndicator(network.status);
    if (network.roomCode) scheduleRoomReconnect();
  });
}

function scheduleRoomReconnect() {
  const network = runtime.network;
  if (network.reconnectTimer || network.intentionalClose) return;
  const delay = Math.min(8000, 800 + network.reconnectAttempts * 900);
  network.reconnectAttempts += 1;
  network.reconnectTimer = setTimeout(() => {
    network.reconnectTimer = null;
    connectToRoomServer();
    if (network.ws) network.pendingJoin = { type: 'joinRoom', roomCode: network.roomCode, role: network.role, sessionToken: network.sessionToken, character: state.characters[network.role] };
  }, delay);
}

function sendNetwork(message) {
  const socket = runtime.network.ws;
  if (!socket || socket.readyState !== WebSocket.OPEN) { runtime.network.pendingJoin = message; connectToRoomServer(); return false; }
  socket.send(JSON.stringify(message));
  return true;
}

function serializeSharedState() {
  return {
    day: state.day,
    minutes: state.minutes,
    weather: state.weather,
    wallet: state.wallet,
    characters: state.characters,
    stats: state.stats,
    inventory: state.inventory,
    decorations: state.decorations,
    furniture: state.furniture,
    tasks: state.tasks,
    memories: state.memories,
  };
}

function applySharedState(shared) {
  if (!shared || typeof shared !== 'object') return;
  const currentPosition = { ...state.playerPosition };
  state = normaliseState({ ...state, ...shared, playerPosition: currentPosition });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); savedStateExists = true; updateContinueButton(); } catch (_) { /* local persistence is optional */ }
  if (runtime.gameReady) {
    applyFurnitureLayout();
    addDecorations();
    if (runtime.network.online) rebuildRemotePlayers();
    updateHUD(true);
  }
  renderCustomizationScreen();
}

function syncSharedState() {
  if (!runtime.network.online) return;
  sendNetwork({ type: 'sharedPatch', patch: serializeSharedState() });
}

function syncLocalCharacter() {
  if (!runtime.network.online || !runtime.network.role) return;
  const character = state.characters[runtime.network.role];
  sendNetwork({ type: 'characterUpdate', character });
  syncSharedState();
}

function createCoupleRoom() {
  setSelectedRole(runtime.network.role || 'abolfazl');
  runtime.network.pendingJoin = { type: 'createRoom', role: runtime.network.role, character: state.characters[runtime.network.role], sharedState: serializeSharedState() };
  setRoomStatus('در حال ساختن اتاق خصوصی…', '');
  connectToRoomServer();
  if (runtime.network.ws?.readyState === WebSocket.OPEN) { const pending = runtime.network.pendingJoin; runtime.network.pendingJoin = null; sendNetwork(pending); }
}

function joinCoupleRoom() {
  const input = $('#room-code-input');
  const roomCode = input?.value.trim().toUpperCase();
  if (!roomCode || roomCode.length < 5) { setRoomStatus('کد اتاق را کامل وارد کنید.', 'error'); input?.focus(); return; }
  runtime.network.pendingJoin = { type: 'joinRoom', roomCode, role: runtime.network.role, character: state.characters[runtime.network.role] };
  setRoomStatus('در حال پیدا کردن خانه‌ی مشترک…', '');
  connectToRoomServer();
  if (runtime.network.ws?.readyState === WebSocket.OPEN) { const pending = runtime.network.pendingJoin; runtime.network.pendingJoin = null; sendNetwork(pending); }
}

function handleRoomConnected(message) {
  const network = runtime.network;
  network.online = true; network.status = 'connected'; network.roomCode = message.roomCode; network.clientId = message.clientId; network.sessionToken = message.sessionToken || network.sessionToken; network.role = message.role; runtime.localRole = message.role; network.players = message.players || [];
  try { sessionStorage.setItem(NETWORK_SESSION_KEY, JSON.stringify({ roomCode: network.roomCode, clientId: network.clientId, sessionToken: network.sessionToken, role: network.role })); } catch (_) { /* optional */ }
  applySharedState(message.sharedState);
  updateRoomPresence(message.players || []);
  if (message.vehicle) applyVehicleState(message.vehicle);
  $('#room-code-label').textContent = message.roomCode;
  $('#mp-code-box').classList.remove('hidden');
  $('#enter-room-btn').classList.remove('hidden');
  $('#create-room-btn').classList.add('hidden'); $('#join-room-btn').classList.add('hidden');
  setRoomStatus(message.type === 'roomCreated' ? 'اتاق ساخته شد؛ کد را برای همراهتان بفرستید.' : 'به خانه‌ی مشترک وصل شدید.', 'success');
  updateNetworkHUD();
  if (runtime.gameReady) switchToOnlineWorld();
}

function handleNetworkMessage(message) {
  switch (message.type) {
    case 'roomCreated': case 'roomJoined': case 'reconnected': handleRoomConnected(message); break;
    case 'presence':
      runtime.network.players = message.players || [];
      applySharedState(message.sharedState);
      updateRoomPresence(message.players || []);
      if (message.vehicle) applyVehicleState(message.vehicle);
      if (runtime.gameReady) rebuildRemotePlayers();
      break;
    case 'remoteState': receiveRemoteState(message.player); break;
    case 'characterUpdate':
      if (message.clientId !== runtime.network.clientId) {
        state.characters[message.role] = { ...state.characters[message.role], ...(message.character || {}) };
        rebuildRemotePlayers();
      }
      break;
    case 'sharedState': applySharedState(message.sharedState); break;
    case 'interaction': handleNetworkInteraction(message); break;
    case 'activity': handleNetworkActivity(message); break;
    case 'vehicleState': applyVehicleState(message.vehicle); break;
    case 'chat': addChatMessage(message.text, message.role !== runtime.network.role, message.role); break;
    case 'error':
      setRoomStatus(message.message || 'اتاق نتوانست درخواست را انجام دهد.', 'error');
      showToast(message.message || 'اتاق در دسترس نیست.', false);
      break;
    case 'pong': break;
    default: break;
  }
}

function updateRoomPresence(players = []) {
  const other = players.find((player) => player.clientId !== runtime.network.clientId);
  if (other) {
    setRoomStatus(other.connected ? `${other.name} هم وارد خانه شد.` : `${other.name} فعلاً قطع است؛ خانه حفظ می‌شود.`, other.connected ? 'success' : '');
  }
  updateNetworkHUD();
}

function updateNetworkHUD() {
  const pill = $('#network-pill'); const label = $('#network-status-label'); const room = $('#network-room-label');
  if (!pill || !label || !room) return;
  const players = runtime.network.players || [];
  const remote = players.find((player) => player.clientId !== runtime.network.clientId);
  pill.classList.toggle('online', runtime.network.online);
  pill.classList.toggle('warn', runtime.network.status === 'disconnected');
  const dot = pill.querySelector('.connection-dot');
  if (dot) dot.className = `connection-dot ${runtime.network.online ? 'connected' : runtime.network.status}`;
  label.textContent = runtime.network.online ? (remote?.connected ? 'همراه متصل' : 'منتظر همراه') : 'آفلاین';
  room.textContent = runtime.network.online ? `${runtime.network.roomCode || 'اتاق'} · ${runtime.localRole === 'razieh' ? 'راضیه' : 'ابوالفضل'}` : 'اتصال محلی';
}

function copyRoomCode() {
  const code = runtime.network.roomCode;
  if (!code) return;
  const write = navigator.clipboard?.writeText(code);
  if (write) write.then(() => showToast('کد اتاق کپی شد.', true)).catch(() => showToast(`کد اتاق: ${code}`, true));
  else showToast(`کد اتاق: ${code}`, true);
}

function updateCustomizationRoleStatus() {
  const label = $('#custom-role-status');
  if (!label) return;
  if (runtime.network.online && runtime.network.roomCode) label.textContent = `${runtime.localRole === 'razieh' ? 'راضیه' : 'ابوالفضل'} · اتاق ${runtime.network.roomCode}`;
  else label.textContent = 'تغییرات خودکار ذخیره می‌شوند';
}

function switchToOnlineWorld() {
  runtime.network.online = true;
  runtime.partnerAction = null;
  if (runtime.gameReady) {
    removeAIPartner();
    rebuildRemotePlayers();
  }
  updateNetworkHUD();
}

function removeAIPartner() {
  if (runtime.partner && runtime.worldGroup) runtime.worldGroup.remove(runtime.partner);
  runtime.partner = null;
  runtime.interactables = runtime.interactables.filter((item) => item.id !== 'partner');
}

function remoteInteractableId(clientId) { return `remote:${clientId}`; }
function isPartnerTargetId(id) { return id === 'partner' || String(id || '').startsWith('remote:'); }
function remoteIdFromTarget(id) { return String(id || '').startsWith('remote:') ? String(id).slice(7) : null; }

function rebuildRemotePlayers() {
  if (!runtime.gameReady || !runtime.worldGroup) return;
  const connected = new Map((runtime.network.players || []).filter((player) => player.clientId !== runtime.network.clientId && player.connected).map((player) => [player.clientId, player]));
  runtime.remotePlayers.forEach((remote, id) => { if (!connected.has(id)) { runtime.worldGroup.remove(remote.group); runtime.remotePlayers.delete(id); runtime.interactables = runtime.interactables.filter((item) => item.id !== remoteInteractableId(id)); } });
  connected.forEach((player, id) => {
    let remote = runtime.remotePlayers.get(id);
    const desiredCharacter = player.character || state.characters[player.role] || state.characters.razieh;
    const characterSignature = JSON.stringify(desiredCharacter);
    if (!remote) {
      const character = desiredCharacter;
      const group = makeAvatar(character);
      group.userData.remoteClientId = id; group.userData.role = player.role;
      group.position.set(player.state?.position?.x || (player.role === 'razieh' ? -6.15 : 2), 0, player.state?.position?.z || -.35);
      group.rotation.y = (player.state?.rotation?.yaw || 0) + Math.PI;
      runtime.worldGroup.add(group);
      remote = { group, player, characterSignature, targetPosition: group.position.clone(), targetYaw: group.rotation.y, animation: player.state?.animation || 'idle', networkAction: null };
      runtime.remotePlayers.set(id, remote);
      registerInteractable(remoteInteractableId(id), player.name || (player.role === 'razieh' ? 'راضیه' : 'ابوالفضل'), group, [group.position.x, group.position.z], 3.2);
    } else if (remote.characterSignature !== characterSignature) {
      const oldPosition = remote.group.position.clone();
      const oldRotation = remote.group.rotation.y;
      runtime.worldGroup.remove(remote.group);
      const group = makeAvatar(desiredCharacter);
      group.userData.remoteClientId = id; group.userData.role = player.role; group.position.copy(oldPosition); group.rotation.y = oldRotation;
      runtime.worldGroup.add(group);
      remote.group = group; remote.characterSignature = characterSignature;
      const target = runtime.interactables.find((item) => item.id === remoteInteractableId(id));
      if (target) target.mesh = group;
    }
    remote.player = player;
    remote.targetPosition.set(player.state?.position?.x ?? remote.targetPosition.x, 0, player.state?.position?.z ?? remote.targetPosition.z);
    const incomingYaw = player.state?.rotation?.yaw;
    remote.targetYaw = (incomingYaw !== undefined && incomingYaw !== null) ? incomingYaw + Math.PI : remote.targetYaw;
    remote.animation = player.state?.animation || 'idle';
    remote.group.userData.name = player.name;
  });
  updateNetworkHUD();
}

function receiveRemoteState(player) {
  if (!player || player.clientId === runtime.network.clientId) return;
  const list = runtime.network.players || [];
  const known = list.find((item) => item.clientId === player.clientId);
  if (known) { known.state = player.state; known.character = player.character; }
  else runtime.network.players = [...list, { ...player, connected: true }];
  rebuildRemotePlayers();
}

function updateRemotePlayers(dt) {
  runtime.remotePlayers.forEach((remote) => {
    if (remote.player?.state?.car?.mode && runtime.car) {
      const seat = remote.player.state.car.seat;
      const right = new THREE.Vector3(Math.cos(runtime.carHeading), 0, -Math.sin(runtime.carHeading));
      remote.targetPosition.copy(runtime.car.position).add(seat === 'passenger' ? right.multiplyScalar(.72) : new THREE.Vector3(0, 0, 0));
    }
    if (remote.networkAction) {
      remote.networkAction.time -= dt;
      animateAvatar(remote.group, remote.networkAction.action, remote.networkAction.elapsed || 0);
      remote.networkAction.elapsed = (remote.networkAction.elapsed || 0) + dt;
      if (remote.networkAction.time <= 0) { remote.networkAction = null; remote.group.scale.set(1, 1, 1); }
    } else {
      remote.group.position.lerp(remote.targetPosition, 1 - Math.pow(.0007, dt));
      remote.group.rotation.y += shortestAngle(remote.group.rotation.y, remote.targetYaw) * (1 - Math.pow(.0003, dt));
      animateAvatar(remote.group, remote.animation, performance.now() / 1000);
    }
  });
}

function shortestAngle(from, to) { return Math.atan2(Math.sin(to - from), Math.cos(to - from)); }

function applyNetworkInteractionEffect(action) {
  if (action === 'talk') { state.tasks.greet = true; applyDelta({ relationship: 1, happiness: 1, stress: -1 }); }
  else if (action === 'hug') { state.tasks.greet = true; applyDelta({ relationship: 3, happiness: 3, energy: -1, stress: -2 }); addMemoryOnce('hug', { icon: '♡', title: 'یک آغوش در خانه', detail: `روز ${fa(state.day)} · باهم` }); }
  else if (action === 'kiss') { state.tasks.greet = true; applyDelta({ relationship: 2, happiness: 3, stress: -1 }); addMemoryOnce('kiss', { icon: '✦', title: 'اولین بوسه‌ی این خانه', detail: `روز ${fa(state.day)} · یک لحظه‌ی آرام` }); }
  else if (action === 'hold') { state.tasks.greet = true; applyDelta({ relationship: 2, happiness: 2 }); }
  else if (action === 'highfive') applyDelta({ relationship: 2, happiness: 2 });
  else if (action === 'dance') { applyDelta({ relationship: 3, happiness: 5, energy: -3 }); addMemoryOnce('dance', { icon: '♫', title: 'رقص وسط خانه', detail: 'چند ثانیه، بدون دلیل خاص' }); }
  else if (action === 'cuddle') applyDelta({ happiness: 5, relationship: 3, stress: -3 });
  else if (action === 'sitTogether') applyDelta({ happiness: 4, relationship: 3, energy: 2 });
  else if (action === 'teaTogether') { state.inventory.tea = Math.max(0, state.inventory.tea - 1); applyDelta({ happiness: 5, relationship: 3, energy: 2 }); addMemoryOnce('tea-together', { icon: '☕', title: 'چای دونفره', detail: 'دو فنجان، یک پنجره' }); }
  else if (action === 'tease') applyDelta({ relationship: 2, happiness: 3 });
  else if (action === 'gift') { state.wallet = Math.max(0, state.wallet - 120000); applyDelta({ relationship: 5, happiness: 4, stress: -2 }); addMemoryOnce('gift', { icon: '◇', title: 'هدیه‌ی بی‌دلیل', detail: 'چیزی کوچک برای لبخند' }); }
  syncSharedState(); updateHUD();
}

function handleNetworkInteraction(event) {
  const remoteId = event.initiatorId === runtime.network.clientId ? event.targetId : event.initiatorId;
  startSynchronizedInteraction(event.action, remoteId, event);
  if (event.initiatorId === runtime.network.clientId) applyNetworkInteractionEffect(event.action);
  if (event.action === 'talk' && event.initiatorId === runtime.network.clientId) {
    $('#dialogue-text').textContent = DIALOGUE_LINES[Math.floor(Math.random() * DIALOGUE_LINES.length)];
    $('#dialogue-modal').classList.remove('hidden'); runtime.overlayOpen = true;
  } else if (event.action === 'talk') {
    showToast('همراهتان می‌خواهد چند کلمه با شما حرف بزند.', true);
  } else {
    showToast(event.initiatorId === runtime.network.clientId ? 'لحظه‌ی مشترک اجرا شد.' : 'همراهتان یک لحظه‌ی صمیمی را شروع کرد.', true);
  }
}

function sendNetworkInteraction(targetId, action) {
  const remoteId = remoteIdFromTarget(targetId);
  if (!remoteId) { showToast('همراه آنلاین پیدا نشد.', false); return; }
  sendNetwork({ type: 'interaction', targetClientId: remoteId, action });
}

function handleNetworkActivity(event) {
  if (!event || event.initiatorId === runtime.network.clientId) return;
  const remote = runtime.remotePlayers.get(event.initiatorId);
  if (event.status === 'start') {
    if (remote) remote.networkAction = { action: event.action, time: event.action === 'cook' ? 4.5 : 2.4, elapsed: 0 };
    showToast(`${event.role === 'razieh' ? 'راضیه' : 'ابوالفضل'} ${event.action === 'cook' ? 'آشپزی را شروع کرد.' : 'مشغول یک کار دونفره است.'}`, true);
  } else if (remote) remote.networkAction = null;
}

function startSynchronizedInteraction(action, remoteId, event = {}) {
  const remote = runtime.remotePlayers.get(remoteId);
  if (!remote) return;
  const remotePosition = remote.group.position.clone();
  const delta = remotePosition.clone().sub(runtime.playerPos); delta.y = 0;
  const distance = delta.length() || .001; const dir = delta.normalize();
  const spacing = action === 'hold' ? .9 : .72;
  if (distance > 3.6) { showToast('برای این تعامل کمی نزدیک‌تر بایستید.', false); return; }
  runtime.interactionLock = true;
  runtime.localAction = { action, time: action === 'dance' ? 6 : 2.45, remoteId };
  runtime.velocity.set(0, 0, 0); runtime.localAnimation = action;
  playTone(action === 'kiss' ? 'kiss' : action === 'highfive' ? 'highfive' : 'hug');
  const anchor = runtime.playerPos.clone().addScaledVector(dir, spacing);
  remote.group.position.lerp(anchor, .8);
  remote.group.rotation.y = Math.atan2(-dir.x, -dir.z);
  runtime.yaw = Math.atan2(-dir.x, -dir.z);
  remote.networkAction = { action, time: runtime.localAction.time, elapsed: 0 };
  for (let i = 0; i < 5; i += 1) setTimeout(() => createHeart(), i * 125);
}

function startLocalSeat(action = 'sit', duration = 3.2) {
  runtime.seated = { action };
  runtime.localAction = { action, time: duration, remoteId: null };
  runtime.interactionLock = true;
  runtime.velocity.set(0, 0, 0);
  runtime.localAnimation = 'sit';
}

function updateLocalInteraction(dt) {
  if (!runtime.localAction) return;
  runtime.localAction.time -= dt;
  animateLocalCamera(runtime.localAction.action, runtime.localAction.time);
  if (runtime.localAction.time <= 0) { runtime.localAction = null; runtime.seated = null; runtime.interactionLock = false; runtime.localAnimation = 'idle'; runtime.cameraShake = 0; }
}

function animateLocalCamera(action, remaining) {
  runtime.cameraShake = (action === 'kiss' ? .015 : action === 'hug' ? .008 : .004) * Math.sin((2.5 - remaining) * 12);
}

function maybeSendNetworkState(now) {
  if (!runtime.network.online || !runtime.network.ws || runtime.network.ws.readyState !== WebSocket.OPEN) return;
  if (now - (runtime.network.lastStateSent || 0) < 55) return;
  runtime.network.lastStateSent = now;
  if (now - (runtime.network.lastSharedClock || 0) > 5000) {
    runtime.network.lastSharedClock = now;
    sendNetwork({ type: 'sharedPatch', patch: { day: state.day, minutes: state.minutes, weather: state.weather } });
  }
  sendNetwork({
    type: 'playerState',
    character: state.characters[runtime.localRole],
    state: {
      position: { x: runtime.playerPos.x, y: runtime.playerPos.y, z: runtime.playerPos.z },
      rotation: { yaw: runtime.carMode ? runtime.carHeading : runtime.yaw, pitch: runtime.pitch },
      animation: runtime.localAction?.action || (runtime.carMode ? 'drive' : runtime.localAnimation),
      interaction: runtime.localAction?.action || null,
      car: { mode: Boolean(runtime.carMode), seat: runtime.vehicleSeat || null, x: runtime.car?.position.x || 0, z: runtime.car?.position.z || 0, heading: runtime.carHeading || 0 },
    },
  });
}

/* ---------- customization ---------- */
function renderCustomizationScreen() {
  updateCustomizationRoleStatus();
  $$('#customize-screen .character-tabs > .char-tab').forEach((button) => {
    const isOwn = !runtime.network.online || button.dataset.character === runtime.localRole;
    button.classList.toggle('active', button.dataset.character === runtime.customizingCharacter);
    button.classList.toggle('remote-locked', !isOwn);
    button.disabled = !isOwn;
  });
  if (runtime.network.online) runtime.customizingCharacter = runtime.localRole;
  const character = state.characters[runtime.customizingCharacter];
  $('#custom-character-title').textContent = `جزئیات ${character.name}`;
  $('#preview-name').textContent = character.name;
  renderOptionsInto($('#skin-swatches'), runtime.customizingCharacter, 'skin', SKINS, 'swatch');
  renderOptionsInto($('#face-shapes'), runtime.customizingCharacter, 'faceShape', FACE_SHAPES, 'pill');
  renderOptionsInto($('#eye-swatches'), runtime.customizingCharacter, 'eyeColor', EYE_COLORS, 'swatch');
  renderOptionsInto($('#hair-styles'), runtime.customizingCharacter, 'hairStyle', HAIR_STYLES, 'pill');
  renderOptionsInto($('#hair-swatches'), runtime.customizingCharacter, 'hair', HAIR_COLORS, 'swatch');
  renderOptionsInto($('#body-builds'), runtime.customizingCharacter, 'bodyBuild', BODY_BUILDS, 'pill');
  renderOptionsInto($('#height-options'), runtime.customizingCharacter, 'height', HEIGHTS, 'pill');
  renderOptionsInto($('#accessory-options'), runtime.customizingCharacter, 'accessory', ACCESSORIES, 'pill');
  renderOptionsInto($('#outfit-options'), runtime.customizingCharacter, 'outfit', OUTFITS, 'outfit');
  updatePreviewAvatar();
}

function renderOptionsInto(container, characterKey, type, options, kind = 'pill', compact = false) {
  if (!container) return;
  const value = state.characters[characterKey][type];
  container.innerHTML = options.map((option) => {
    const selected = option.value === value ? 'selected' : '';
    if (kind === 'swatch') return `<button class="swatch-btn option-choice ${selected}" title="${option.label}" aria-label="${option.label}" style="background:${option.value}" data-option-type="${type}" data-option-value="${option.value}" data-option-character="${characterKey}"></button>`;
    if (kind === 'outfit') return `<button class="outfit-choice option-choice ${selected}" data-option-type="${type}" data-option-value="${option.value}" data-option-character="${characterKey}"><span class="outfit-dot" style="background:${option.color}"></span>${option.label}</button>`;
    return `<button class="pill-choice option-choice ${selected}" data-option-type="${type}" data-option-value="${option.value}" data-option-character="${characterKey}">${option.label}</button>`;
  }).join('');
  container.querySelectorAll('.option-choice').forEach((button) => button.addEventListener('click', () => {
    const charKey = button.dataset.optionCharacter;
    state.characters[charKey][button.dataset.optionType] = button.dataset.optionValue;
    if (container.closest('#modal-options')) renderModalOptions();
    else renderCustomizationScreen();
    if (runtime.network.online) syncLocalCharacter();
    else updatePartnerAvatar();
    playTone('click');
  }));
}

function selectCustomizationCharacter(key, modal = false) {
  if (runtime.network.online && key !== runtime.localRole) { showToast('در اتاق دونفره فقط ظاهر خودتان را تغییر دهید.', false); return; }
  runtime.customizingCharacter = key;
  if (modal) {
    $$('.compact-tabs .char-tab').forEach((button) => button.classList.toggle('active', button.dataset.modalCharacter === key));
    renderModalOptions();
    updateModalPreviewAvatar();
  } else {
    renderCustomizationScreen();
  }
}

function initPreviewRenderer() {
  if (runtime.previewReady) { resizePreviewRenderer(); updatePreviewAvatar(); return; }
  const canvas = $('#preview-canvas');
  if (!canvas) return;
  runtime.previewRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  runtime.previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  runtime.previewRenderer.outputColorSpace = THREE.SRGBColorSpace;
  runtime.previewRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  runtime.previewRenderer.toneMappingExposure = 1.1;
  runtime.previewScene = new THREE.Scene();
  runtime.previewCamera = new THREE.PerspectiveCamera(32, 1, .1, 30);
  runtime.previewCamera.position.set(0, 1.8, 6.4);
  runtime.previewCamera.lookAt(0, 1.25, 0);
  addPreviewLights(runtime.previewScene);
  runtime.previewReady = true;
  updatePreviewAvatar();
  resizePreviewRenderer();
  if (!runtime.previewAnimationStarted) { runtime.previewAnimationStarted = true; requestAnimationFrame(previewLoop); }
}

function addPreviewLights(scene) {
  scene.add(new THREE.HemisphereLight(0xcfe3d5, 0x18251f, 2.1));
  const key = new THREE.DirectionalLight(0xffe0b0, 2.4); key.position.set(-3, 6, 4); scene.add(key);
  const fill = new THREE.PointLight(0xb6d7ff, 1.4, 15); fill.position.set(3, 3, 4); scene.add(fill);
}

function updatePreviewAvatar() {
  if (!runtime.previewReady) return;
  if (runtime.previewAvatar) runtime.previewScene.remove(runtime.previewAvatar);
  runtime.previewAvatar = makeAvatar(state.characters[runtime.customizingCharacter]);
  runtime.previewAvatar.rotation.y = 0;
  runtime.previewAvatar.position.y = -.04;
  runtime.previewAvatar.scale.setScalar(1.15);
  runtime.previewScene.add(runtime.previewAvatar);
}

function resizePreviewRenderer() {
  if (!runtime.previewReady) return;
  const canvas = $('#preview-canvas');
  const rect = canvas.getBoundingClientRect();
  runtime.previewRenderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  runtime.previewCamera.aspect = rect.width / Math.max(1, rect.height);
  runtime.previewCamera.updateProjectionMatrix();
}

function initModalPreview() {
  if (runtime.modalPreviewReady) { resizeModalRenderer(); updateModalPreviewAvatar(); return; }
  const canvas = $('#modal-preview-canvas');
  if (!canvas) return;
  runtime.modalRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  runtime.modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  runtime.modalRenderer.outputColorSpace = THREE.SRGBColorSpace;
  runtime.modalRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  runtime.modalRenderer.toneMappingExposure = 1.1;
  runtime.modalScene = new THREE.Scene();
  runtime.modalCamera = new THREE.PerspectiveCamera(32, 1, .1, 30);
  runtime.modalCamera.position.set(0, 1.65, 6.2);
  runtime.modalCamera.lookAt(0, 1.2, 0);
  addPreviewLights(runtime.modalScene);
  runtime.modalPreviewReady = true;
  updateModalPreviewAvatar();
  resizeModalRenderer();
  if (!runtime.previewAnimationStarted) { runtime.previewAnimationStarted = true; requestAnimationFrame(previewLoop); }
}

function updateModalPreviewAvatar() {
  if (!runtime.modalPreviewReady) return;
  if (runtime.modalAvatar) runtime.modalScene.remove(runtime.modalAvatar);
  runtime.modalAvatar = makeAvatar(state.characters[runtime.customizingCharacter]);
  runtime.modalAvatar.rotation.y = 0;
  runtime.modalAvatar.scale.setScalar(1.02);
  runtime.modalScene.add(runtime.modalAvatar);
  $('#modal-preview-name').textContent = state.characters[runtime.customizingCharacter].name;
}

function resizeModalRenderer() {
  if (!runtime.modalPreviewReady) return;
  const canvas = $('#modal-preview-canvas');
  const rect = canvas.getBoundingClientRect();
  runtime.modalRenderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
  runtime.modalCamera.aspect = rect.width / Math.max(1, rect.height);
  runtime.modalCamera.updateProjectionMatrix();
}

function openGameCustomizer() {
  runtime.customizingCharacter = 'abolfazl';
  $('#custom-modal').classList.remove('hidden');
  runtime.overlayOpen = true;
  initModalPreview();
  $$('.compact-tabs .char-tab').forEach((button) => button.classList.toggle('active', button.dataset.modalCharacter === runtime.customizingCharacter));
  renderModalOptions();
}

function renderModalOptions() {
  const root = $('#modal-options');
  if (!root) return;
  root.innerHTML = `<div class="control-group"><label>رنگ پوست</label><div class="swatch-row" id="modal-skin-swatches"></div></div><div class="control-group"><label>فرم صورت</label><div class="pill-row" id="modal-face-shapes"></div></div><div class="control-group"><label>رنگ چشم</label><div class="swatch-row" id="modal-eye-swatches"></div></div><div class="control-group"><label>مدل مو</label><div class="pill-row" id="modal-hair-styles"></div></div><div class="control-group"><label>رنگ مو</label><div class="swatch-row" id="modal-hair-swatches"></div></div><div class="control-group"><label>فرم بدن</label><div class="pill-row" id="modal-body-builds"></div></div><div class="control-group"><label>قد</label><div class="pill-row" id="modal-height-options"></div></div><div class="control-group"><label>اکسسوری</label><div class="pill-row" id="modal-accessory-options"></div></div><div class="control-group"><label>لباس امضای شما</label><div class="outfit-row" id="modal-outfit-options"></div></div>`;
  renderOptionsInto($('#modal-skin-swatches'), runtime.customizingCharacter, 'skin', SKINS, 'swatch', true);
  renderOptionsInto($('#modal-face-shapes'), runtime.customizingCharacter, 'faceShape', FACE_SHAPES, 'pill', true);
  renderOptionsInto($('#modal-eye-swatches'), runtime.customizingCharacter, 'eyeColor', EYE_COLORS, 'swatch', true);
  renderOptionsInto($('#modal-hair-styles'), runtime.customizingCharacter, 'hairStyle', HAIR_STYLES, 'pill', true);
  renderOptionsInto($('#modal-hair-swatches'), runtime.customizingCharacter, 'hair', HAIR_COLORS, 'swatch', true);
  renderOptionsInto($('#modal-body-builds'), runtime.customizingCharacter, 'bodyBuild', BODY_BUILDS, 'pill', true);
  renderOptionsInto($('#modal-height-options'), runtime.customizingCharacter, 'height', HEIGHTS, 'pill', true);
  renderOptionsInto($('#modal-accessory-options'), runtime.customizingCharacter, 'accessory', ACCESSORIES, 'pill', true);
  renderOptionsInto($('#modal-outfit-options'), runtime.customizingCharacter, 'outfit', OUTFITS, 'outfit', true);
}

function saveModalCustomization() {
  if (runtime.network.online) syncLocalCharacter();
  else updatePartnerAvatar();
  closePanels();
  showToast('ظاهر تازه‌تان در آینه ثبت شد.', true);
  saveGame(false);
}

/* ---------- 3D avatar and world helpers ---------- */
function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: options.roughness ?? .78, metalness: options.metalness ?? 0, emissive: options.emissive || 0x000000, emissiveIntensity: options.emissiveIntensity || 0 });
}

function meshBox(width, height, depth, color, position, parent, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, options));
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  parent.add(mesh);
  return mesh;
}

function meshSphere(radius, color, position, parent, scale = [1, 1, 1], options = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, options.segments || 16, options.segments || 12), material(color, options));
  mesh.position.set(position[0], position[1], position[2]);
  mesh.scale.set(scale[0], scale[1], scale[2]);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  parent.add(mesh);
  return mesh;
}

function meshCylinder(radiusTop, radiusBottom, height, color, position, parent, options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, options.segments || 16), material(color, options));
  mesh.position.set(position[0], position[1], position[2]);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  parent.add(mesh);
  return mesh;
}

function makeAvatar(char) {
  const root = new THREE.Group();
  root.userData.avatar = true;
  root.userData.role = char === state.characters.razieh || char.name === 'راضیه' ? 'razieh' : 'abolfazl';
  root.userData.parts = {};
  const parts = root.userData.parts;
  const skin = material(char.skin || '#c58b70', { roughness: .7 });
  const hair = material(char.hair || '#171516', { roughness: .48 });
  const outfitData = OUTFITS.find((item) => item.value === char.outfit) || OUTFITS[0];
  const outfit = material(outfitData.color, { roughness: .82 });
  const pants = material(root.userData.role === 'razieh' ? '#55443e' : '#242324', { roughness: .7 });
  const eye = material(char.eyeColor || char.eye || '#30211f', { roughness: .35 });
  const faceScale = ({ soft: [1.06, .98, .95], oval: [1, 1.06, .92], defined: [.94, 1.07, .89] })[char.faceShape] || [1, 1.06, .92];
  const buildScale = ({ slim: .92, natural: 1, strong: 1.08 })[char.bodyBuild] || 1;
  const heightScale = ({ short: .94, average: 1, tall: 1.07 })[char.height] || 1;
  root.scale.set(buildScale, heightScale, buildScale);
  const white = material('#f5eee1', { roughness: .42 });

  // A lightweight, layered humanoid: shoulders, torso, articulated limb groups,
  // hands, neck and facial planes keep it friendly without the cost of a scanned mesh.
  parts.torso = meshCylinder(.30, .36, .78, outfitData.color, [0, 1.08, 0], root, { segments: 18 });
  parts.pelvis = meshBox(.57, .14, .36, pants.color.getHex(), [0, .68, 0], root, { roughness: .84 });
  parts.leftLeg = meshCylinder(.13, .16, .72, pants.color.getHex(), [-.17, .36, 0], root, { segments: 14 });
  parts.rightLeg = meshCylinder(.13, .16, .72, pants.color.getHex(), [.17, .36, 0], root, { segments: 14 });
  parts.leftFoot = meshBox(.23, .13, .41, '#332c2a', [-.17, .06, -.07], root, { roughness: .52 });
  parts.rightFoot = meshBox(.23, .13, .41, '#332c2a', [.17, .06, -.07], root, { roughness: .52 });
  parts.leftShoulder = meshSphere(.14, outfitData.color, [-.35, 1.37, 0], root, [1, .9, 1], { segments: 12 });
  parts.rightShoulder = meshSphere(.14, outfitData.color, [.35, 1.37, 0], root, [1, .9, 1], { segments: 12 });
  parts.leftArm = meshCylinder(.105, .125, .72, skin.color.getHex(), [-.41, 1.07, 0], root, { segments: 14 });
  parts.rightArm = meshCylinder(.105, .125, .72, skin.color.getHex(), [.41, 1.07, 0], root, { segments: 14 });
  parts.leftHand = meshSphere(.115, char.skin || '#c58b70', [-.41, .68, 0], root, [1, .9, .85], { segments: 12 });
  parts.rightHand = meshSphere(.115, char.skin || '#c58b70', [.41, .68, 0], root, [1, .9, .85], { segments: 12 });
  parts.neck = meshCylinder(.13, .15, .18, skin.color.getHex(), [0, 1.56, 0], root, { segments: 12 });
  parts.head = meshSphere(.36, char.skin || '#c58b70', [0, 1.91, 0], root, faceScale, { segments: 20 });

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(.37, 20, 12, 0, Math.PI * 2, 0, Math.PI * .53), hair);
  hairCap.position.set(0, 2.02, 0); hairCap.scale.set(1.02, 1.08, .98); hairCap.castShadow = true; root.add(hairCap); parts.hairCap = hairCap;
  if (char.hairStyle === 'long') {
    parts.hairLeft = meshCylinder(.16, .23, .72, char.hair || '#171516', [-.29, 1.66, .02], root, { segments: 12 });
    parts.hairRight = meshCylinder(.16, .23, .72, char.hair || '#171516', [.29, 1.66, .02], root, { segments: 12 });
    meshSphere(.3, char.hair || '#171516', [0, 1.7, .08], root, [1, .95, .56], { segments: 16 });
  } else if (char.hairStyle === 'waves') {
    [-.28, -.12, .12, .28].forEach((x, index) => meshSphere(.13, char.hair || '#171516', [x, 2.09 + (index % 2) * .035, -.01], root, [1, 1.18, 1], { segments: 12 }));
  }
  // The face is turned toward +Z.
  meshSphere(.053, white.color.getHex(), [-.12, 1.96, .32], root, [1, 1, .55], { segments: 10 });
  meshSphere(.053, white.color.getHex(), [.12, 1.96, .32], root, [1, 1, .55], { segments: 10 });
  parts.leftEye = meshSphere(.024, eye.color.getHex(), [-.12, 1.96, .355], root, [1, 1, .5], { segments: 8 });
  parts.rightEye = meshSphere(.024, eye.color.getHex(), [.12, 1.96, .355], root, [1, 1, .5], { segments: 8 });
  meshSphere(.028, skin.color.getHex(), [0, 1.86, .35], root, [1, .8, .7], { segments: 8 });
  meshBox(.13, .018, .012, '#7c3f43', [0, 1.78, .35], root, { roughness: .5 });
  // Eyebrows add a little expression when the character moves close to camera.
  const browL = meshBox(.105, .018, .018, char.hair || '#171516', [-.12, 2.075, .35], root, { roughness: .5 }); browL.rotation.z = -.08;
  const browR = meshBox(.105, .018, .018, char.hair || '#171516', [.12, 2.075, .35], root, { roughness: .5 }); browR.rotation.z = .08;
  if (char.accessory === 'necklace') {
    const necklace = new THREE.Mesh(new THREE.TorusGeometry(.11, .012, 7, 16), material('#e5bf73', { metalness: .75, roughness: .28 }));
    necklace.rotation.x = Math.PI / 2; necklace.position.set(0, 1.57, .24); root.add(necklace);
    meshSphere(.028, '#e5bf73', [0, 1.47, .31], root, [1, 1, .7], { segments: 8, metalness: .75, roughness: .28 });
  } else if (char.accessory === 'glasses') {
    const glasses = material('#313a37', { metalness: .55, roughness: .28 });
    const leftLens = new THREE.Mesh(new THREE.TorusGeometry(.095, .012, 6, 16), glasses); leftLens.position.set(-.12, 1.96, .38); root.add(leftLens);
    const rightLens = new THREE.Mesh(new THREE.TorusGeometry(.095, .012, 6, 16), glasses); rightLens.position.set(.12, 1.96, .38); root.add(rightLens);
    meshBox(.08, .012, .012, '#313a37', [0, 1.96, .38], root, { metalness: .55, roughness: .28 });
  } else if (char.accessory === 'watch') {
    const watch = new THREE.Mesh(new THREE.TorusGeometry(.09, .022, 6, 12), material('#d1a75d', { metalness: .8, roughness: .32 }));
    watch.rotation.y = Math.PI / 2; watch.position.set(.44, .88, .01); root.add(watch);
  }
  if (root.userData.role === 'razieh') {
    const scarf = meshBox(.62, .04, .38, '#a98b75', [0, 1.45, .03], root, { roughness: .9 }); scarf.rotation.x = -.12;
  }
  return root;
}

function animateAvatar(avatar, animation = 'idle', time = 0) {
  if (!avatar?.userData?.parts) return;
  const p = avatar.userData.parts;
  const t = Number(time) || 0;
  const moving = animation === 'walk' || animation === 'run' || animation === 'sprint';
  const stride = animation === 'run' || animation === 'sprint' ? 1.05 : .65;
  const swing = moving ? Math.sin(t * (animation === 'walk' ? 8 : 11)) * stride : Math.sin(t * 2.2) * .025;
  avatar.rotation.x = 0;
  p.leftHand.position.z = 0; p.rightHand.position.z = 0;
  p.leftArm.rotation.x = 0; p.leftArm.rotation.z = 0;
  p.rightArm.rotation.x = 0; p.rightArm.rotation.z = 0;
  p.leftLeg.rotation.x = 0; p.leftLeg.rotation.z = 0;
  p.rightLeg.rotation.x = 0; p.rightLeg.rotation.z = 0;
  if (moving) {
    p.leftArm.rotation.x = -swing * .55; p.rightArm.rotation.x = swing * .55;
    p.leftLeg.rotation.x = swing * .27; p.rightLeg.rotation.x = -swing * .27;
    avatar.position.y = Math.abs(Math.sin(t * 8)) * .012;
  } else if (animation === 'hug' || animation === 'cuddle') {
    p.leftArm.rotation.x = .95; p.rightArm.rotation.x = .95;
    p.leftArm.rotation.z = -.18; p.rightArm.rotation.z = .18;
    p.leftHand.position.z = .24; p.rightHand.position.z = .24;
    avatar.position.y = Math.sin(t * 7) * .012;
  } else if (animation === 'kiss') {
    p.leftArm.rotation.x = .25; p.rightArm.rotation.x = -.25;
    avatar.rotation.x = Math.sin(t * 6) * .018;
  } else if (animation === 'hold') {
    p.leftArm.rotation.x = .42; p.rightArm.rotation.x = .42;
    p.leftArm.rotation.z = -.25; p.rightArm.rotation.z = .25;
  } else if (animation === 'highfive') {
    p.rightArm.rotation.x = .7; p.rightArm.rotation.z = -.42;
    p.rightHand.position.z = .22;
  } else if (animation === 'dance') {
    p.leftArm.rotation.x = .65 + Math.sin(t * 5) * .3; p.rightArm.rotation.x = -.35 + Math.cos(t * 5) * .3;
    avatar.rotation.y += Math.sin(t * 2.5) * .003; avatar.position.y = Math.abs(Math.sin(t * 5)) * .025;
  } else if (animation === 'cook' || animation === 'eat' || animation === 'drink') {
    p.leftArm.rotation.x = .55 + Math.sin(t * 5) * .18; p.rightArm.rotation.x = .55 + Math.cos(t * 5) * .18;
    avatar.position.y = Math.sin(t * 5) * .008;
  } else if (animation === 'drive' || animation === 'passenger') {
    p.leftArm.rotation.x = .25; p.rightArm.rotation.x = .25;
  } else if (animation === 'sit' || animation === 'sitTogether' || animation === 'movie') {
    p.leftLeg.rotation.x = -.8; p.rightLeg.rotation.x = -.8; p.leftArm.rotation.x = .25; p.rightArm.rotation.x = .25;
  } else {
    p.leftArm.rotation.z = swing * .15; p.rightArm.rotation.z = -swing * .15;
    avatar.position.y = Math.sin(t * 2.2) * .008;
  }
}

function createRoundedRug(parent, position, color = '#8f6553', scale = [1, 1, 1]) {
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, .035, 48), material(color, { roughness: 1 }));
  rug.position.set(position[0], .022, position[2]);
  rug.scale.set(scale[0], scale[1], scale[2]);
  rug.receiveShadow = true;
  parent.add(rug);
  return rug;
}

function addFloorLamp(parent, position) {
  const group = new THREE.Group();
  group.position.set(...position);
  meshCylinder(.025, .035, 1.85, '#40352a', [0, .93, 0], group, { segments: 10 });
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.31, .33, 24, 1, true), material('#d3ad72', { roughness: .72, emissive: '#6b4b25', emissiveIntensity: .13 }));
  shade.position.y = 1.85; shade.castShadow = true; group.add(shade);
  const light = new THREE.PointLight(0xffc878, 1.0, 6, 2); light.position.set(0, 1.76, 0); group.add(light);
  parent.add(group);
  runtime.dynamicLights.push(light);
  return group;
}

function addPlant(parent, position, large = false) {
  const group = new THREE.Group(); group.position.set(...position);
  const scale = large ? 1.2 : .8;
  meshCylinder(.27 * scale, .32 * scale, .35 * scale, '#a56d50', [0, .18 * scale, 0], group, { segments: 16 });
  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(.16 * scale, 10, 8), material(i % 2 ? '#4e7657' : '#648a64', { roughness: .9 }));
    leaf.position.set(Math.sin(i * 1.9) * .19 * scale, .55 * scale + (i % 3) * .1, Math.cos(i * 2.3) * .13 * scale);
    leaf.scale.set(.7, 1.5, .38); leaf.rotation.z = (i - 3) * .18; leaf.castShadow = true; group.add(leaf);
  }
  parent.add(group);
  return group;
}

/* ---------- world construction ---------- */
function initGame() {
  const canvas = $('#game-canvas');
  runtime.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  runtime.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  runtime.renderer.setSize(window.innerWidth, window.innerHeight, false);
  runtime.renderer.outputColorSpace = THREE.SRGBColorSpace;
  runtime.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  runtime.renderer.toneMappingExposure = 1.07;
  runtime.renderer.shadowMap.enabled = true;
  runtime.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  runtime.scene = new THREE.Scene();
  runtime.scene.background = new THREE.Color('#394d4a');
  runtime.scene.fog = new THREE.Fog('#394d4a', 28, 66);
  runtime.camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, .1, 100);
  runtime.camera.rotation.order = 'YXZ';
  runtime.camera.position.set(runtime.playerPos.x, runtime.playerPos.y, runtime.playerPos.z);
  runtime.clock = new THREE.Clock();
  buildWorld();
  addWorldPartner();
  runtime.worldNeedsReset = false;
  runtime.gameReady = true;
  if (runtime.network.online) { rebuildRemotePlayers(); applyVehicleState(runtime.vehicleState); }
  resizeGame();
  runtime.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function buildWorld() {
  const scene = runtime.scene;
  runtime.worldGroup = new THREE.Group();
  scene.add(runtime.worldGroup);
  runtime.decorationGroup = new THREE.Group();
  scene.add(runtime.decorationGroup);
  runtime.colliders = [];
  runtime.interactables = [];
  runtime.furnitureGroups.clear();
  runtime.furnitureColliders.clear();
  runtime.remotePlayers.clear();
  runtime.partner = null;
  runtime.dynamicLights = [];

  scene.add(new THREE.HemisphereLight(0xadcac4, 0x18241e, 1.35));
  const sun = new THREE.DirectionalLight(0xffd9aa, 1.4);
  sun.position.set(-8, 15, 7); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -25; sun.shadow.camera.right = 25; sun.shadow.camera.top = 25; sun.shadow.camera.bottom = -20; scene.add(sun); runtime.sun = sun;
  const warm = new THREE.PointLight(0xffbd78, 1.2, 19, 2); warm.position.set(-2, 4, -1); scene.add(warm); runtime.dynamicLights.push(warm);
  const windowLight = new THREE.PointLight(0xf2c989, .75, 13, 2); windowLight.position.set(0, 3.2, -9.6); scene.add(windowLight); runtime.dynamicLights.push(windowLight);

  const floorMat = material('#957054', { roughness: .9 });
  meshBox(34, .18, 25, floorMat.color.getHex(), [0, -.1, 0], runtime.worldGroup, { roughness: .9 });
  createRoundedRug(runtime.worldGroup, [-5.4, 0, -1.1], '#7d6656', [1.45, .92, 1]);
  createRoundedRug(runtime.worldGroup, [7.2, 0, 1.3], '#536b59', [1.2, .82, 1]);
  // Home walls and warm architectural edges.
  meshBox(34, 5.8, .35, '#d1b89b', [0, 2.8, -11], runtime.worldGroup);
  meshBox(.35, 5.8, 25, '#cdb296', [-17, 2.8, 0], runtime.worldGroup);
  meshBox(.35, 5.8, 25, '#cdb296', [17, 2.8, 0], runtime.worldGroup);
  meshBox(6.6, 5.8, .28, '#d1b89b', [-13.6, 2.8, 11], runtime.worldGroup);
  meshBox(6.6, 5.8, .28, '#d1b89b', [13.6, 2.8, 11], runtime.worldGroup);
  meshBox(.25, 5.8, .3, '#a98062', [-3.4, 2.8, 10.95], runtime.worldGroup);
  meshBox(.25, 5.8, .3, '#a98062', [3.4, 2.8, 10.95], runtime.worldGroup);
  // Back window and window glow.
  meshBox(10.5, 3.1, .08, '#24423b', [0, 3.25, -10.79], runtime.worldGroup, { roughness: .35, emissive: '#1c5142', emissiveIntensity: .22 });
  for (let x = -4.8; x <= 4.8; x += 1.6) meshBox(.035, 3.0, .1, '#c5a984', [x, 3.25, -10.85], runtime.worldGroup);
  meshBox(10.2, .08, .12, '#c5a984', [0, 1.72, -10.88], runtime.worldGroup);
  // Fairy lights.
  const lightColors = ['#f4d58e', '#b0d6d2', '#e48f72', '#ced9ff'];
  for (let i = 0; i < 22; i += 1) {
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.065, 8, 8), material(lightColors[i % lightColors.length], { emissive: lightColors[i % lightColors.length], emissiveIntensity: 1.8, roughness: .3 }));
    bulb.position.set(-10.4 + i * .98, 4.65 + Math.sin(i * .8) * .11, -10.67);
    runtime.worldGroup.add(bulb);
  }
  // Front threshold, balcony and city.
  meshBox(34, .08, 5.5, '#6d755f', [0, -.02, 13.1], runtime.worldGroup, { roughness: 1 });
  meshBox(34, 1.05, .16, '#9c765d', [0, .5, 15.8], runtime.worldGroup);
  meshBox(.16, 1.05, 5.5, '#9c765d', [-16.7, .5, 13.1], runtime.worldGroup);
  meshBox(.16, 1.05, 5.5, '#9c765d', [16.7, .5, 13.1], runtime.worldGroup);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(34, 17), material('#343e3b', { roughness: .95 }));
  road.rotation.x = -Math.PI / 2; road.position.set(0, -.015, 20); road.receiveShadow = true; runtime.worldGroup.add(road);
  for (let x = -14; x <= 14; x += 4) meshBox(1.8, .02, .13, '#d0b77b', [x, .01, 20], runtime.worldGroup, { roughness: .8 });
  addCityBuildings();
  addFurniture();
  addDecorations();
  addCar();
  updateLighting();
}

function addCityBuildings() {
  const buildings = [
    [-14, 3.2, 17.5, 3.4, 5.5, '#46554e'], [-10.8, 2.1, 24, 2.6, 4.2, '#6d685b'],
    [14.2, 2.7, 18.6, 3.8, 6.5, '#705e50'], [11.2, 1.8, 24, 3.2, 3.5, '#4d635c'],
  ];
  buildings.forEach(([x, y, z, w, h, color]) => {
    meshBox(w, h, 3.5, color, [x, h / 2 - .02, z], runtime.worldGroup, { roughness: 1 });
    for (let row = 0; row < 2; row += 1) for (let col = 0; col < Math.max(1, Math.floor(w / 1.2)); col += 1) {
      const window = meshBox(.33, .38, .03, '#d6aa68', [x - w / 2 + .65 + col * 1.08, 1 + row * 1.45, z - 1.78], runtime.worldGroup, { emissive: '#9a6c31', emissiveIntensity: .28, roughness: .5 });
      window.userData.cityWindow = true;
    }
  });
  // Park tree and cafe sign.
  const tree = new THREE.Group(); tree.position.set(-10.3, 0, 18.5); runtime.worldGroup.add(tree);
  meshCylinder(.18, .24, 2.0, '#573b2a', [0, 1, 0], tree, { segments: 10 });
  meshSphere(1.35, '#45664f', [0, 2.25, 0], tree, [1, .95, .9], { segments: 18 });
  meshSphere(.78, '#5d7c5c', [.8, 2.1, .15], tree, [1, 1, .9], { segments: 16 });
  registerInteractable('park', 'پارک محله', tree, [-10.3, 18.5], 3.3);
  const cafe = new THREE.Group(); cafe.position.set(9.5, 0, 19.2); runtime.worldGroup.add(cafe);
  meshBox(4.6, 3.8, 3.4, '#9a765d', [0, 1.9, 0], cafe, { roughness: .88 });
  meshBox(3.2, 1.2, .08, '#e6bd78', [0, 3.1, -1.75], cafe, { emissive: '#7a4d26', emissiveIntensity: .38 });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .65), material('#d9b47b', { emissive: '#795d2f', emissiveIntensity: .25 })); sign.position.set(0, 3.1, -1.81); cafe.add(sign);
  meshBox(1.2, 1.6, .06, '#47675b', [-1.15, .85, -1.76], cafe, { roughness: .3 });
  meshBox(1.2, 1.6, .06, '#47675b', [1.15, .85, -1.76], cafe, { roughness: .3 });
  registerInteractable('cafe', 'کافه‌ی محله', cafe, [9.5, 17.3], 3.5);
  // Small park bench.
  const bench = new THREE.Group(); bench.position.set(-10.5, 0, 20.3); runtime.worldGroup.add(bench);
  meshBox(1.8, .12, .45, '#966849', [0, .65, 0], bench); meshBox(1.8, .75, .1, '#966849', [0, 1.0, .18], bench); meshBox(.1, .6, .35, '#6a4936', [-.68, .3, 0], bench); meshBox(.1, .6, .35, '#6a4936', [.68, .3, 0], bench);
  runtime.colliders.push({ x: -10.5, z: 20.3, hx: 1.1, hz: .5 });
}

function getFurnitureLayout(key, fallback) {
  return { ...(state.furniture?.[key] || fallback) };
}

function registerFurniture(key, group, collider) {
  group.userData.furnitureKey = key;
  runtime.furnitureGroups.set(key, group);
  runtime.furnitureColliders.set(key, collider);
}

function applyFurnitureLayout() {
  runtime.furnitureGroups.forEach((group, key) => {
    const layout = state.furniture?.[key];
    if (!layout) return;
    group.position.x = layout.x; group.position.z = layout.z; group.rotation.y = layout.rotation || 0;
    const collider = runtime.furnitureColliders.get(key);
    if (collider) { collider.x = layout.x; collider.z = layout.z; collider.rotation = layout.rotation || 0; }
  });
  runtime.interactables.forEach((item) => {
    if (item.mesh?.userData?.furnitureKey) item.staticPosition.set(item.mesh.position.x, item.mesh.position.z);
  });
}

function moveFurniture(key, delta = {}) {
  if (!state.furniture?.[key]) return;
  const current = state.furniture[key];
  current.x = clamp(current.x + (delta.x || 0), -14, 14);
  current.z = clamp(current.z + (delta.z || 0), -8, 10);
  current.rotation = (current.rotation + (delta.rotation || 0) + Math.PI * 4) % (Math.PI * 2);
  applyFurnitureLayout();
  if (runtime.network.online) syncSharedState();
  saveGame(false);
  showToast('چیدمان خانه برای هر دو نفر به‌روز شد.', true);
}

function addFurniture() {
  // Sofa + cushions.
  const sofaLayout = getFurnitureLayout('sofa', { x: -6.1, z: -1.65, rotation: 0 });
  const sofa = new THREE.Group(); sofa.position.set(sofaLayout.x, 0, sofaLayout.z); sofa.rotation.y = sofaLayout.rotation || 0; runtime.worldGroup.add(sofa);
  meshBox(3.7, .56, 1.02, '#6b7e6b', [0, .55, 0], sofa); meshBox(3.8, 1.45, .38, '#4d6255', [0, 1.15, .3], sofa); meshBox(.32, .9, 1.1, '#526859', [-1.84, .75, 0], sofa); meshBox(.32, .9, 1.1, '#526859', [1.84, .75, 0], sofa);
  meshBox(.85, .1, .72, '#b6785e', [-.9, .9, -.08], sofa); meshBox(.85, .1, .72, '#b6785e', [.55, .9, -.08], sofa);
  const sofaCollider = { x: sofaLayout.x, z: sofaLayout.z, hx: 2.1, hz: .95, rotation: sofaLayout.rotation || 0 };
  runtime.colliders.push(sofaCollider); registerFurniture('sofa', sofa, sofaCollider);
  registerInteractable('sofa', 'نشیمن', sofa, [sofaLayout.x, sofaLayout.z], 3.4);
  // Coffee table.
  const tableLayout = getFurnitureLayout('table', { x: -5.5, z: .8, rotation: 0 });
  const table = new THREE.Group(); table.position.set(tableLayout.x, 0, tableLayout.z); table.rotation.y = tableLayout.rotation || 0; runtime.worldGroup.add(table);
  meshBox(2.1, .12, 1.15, '#8c6048', [0, .73, 0], table); [[-.82,-.4],[.82,-.4],[-.82,.4],[.82,.4]].forEach(([x,z]) => meshBox(.1, .72, .1, '#5d4434', [x, .36, z], table));
  const tableCollider = { x: tableLayout.x, z: tableLayout.z, hx: 1.25, hz: .8, rotation: tableLayout.rotation || 0 };
  runtime.colliders.push(tableCollider); registerFurniture('table', table, tableCollider);
  // Television wall.
  meshBox(3.6, .2, .55, '#614537', [-6.3, .45, -8.55], runtime.worldGroup); meshBox(2.45, 1.42, .08, '#121b1a', [-6.3, 2.18, -8.6], runtime.worldGroup, { roughness: .3, emissive: '#213c34', emissiveIntensity: .3 });
  const tvGlow = new THREE.PointLight(0x7da89b, .3, 5); tvGlow.position.set(-6.3, 2, -8); runtime.worldGroup.add(tvGlow); runtime.dynamicLights.push(tvGlow);
  // Personal desk with laptop: a small work/study loop without leaving the home.
  const desk = new THREE.Group(); desk.position.set(-12.1, 0, -6.2); runtime.worldGroup.add(desk);
  meshBox(2.3, .12, .9, '#76523f', [0, 1.0, 0], desk); meshBox(.11, 1.0, .11, '#503a2e', [-.88, .48, -.27], desk); meshBox(.11, 1.0, .11, '#503a2e', [.88, .48, -.27], desk);
  meshBox(1.1, .06, .62, '#202a27', [0, 1.34, -.05], desk, { roughness: .28, metalness: .25 }); meshBox(.75, .45, .05, '#31403a', [0, 1.54, .16], desk, { roughness: .25, emissive: '#26463c', emissiveIntensity: .2 });
  meshBox(.32, .03, .22, '#d5b27a', [-.55, 1.08, .1], desk);
  runtime.colliders.push({ x: -12.1, z: -6.2, hx: 1.35, hz: .7 });
  registerInteractable('desk', 'میز کار', desk, [-12.1, -5.1], 2.8);
  // Kitchen counters.
  const kitchen = new THREE.Group(); kitchen.position.set(8.2, 0, -7.3); runtime.worldGroup.add(kitchen);
  meshBox(7, .9, 1.25, '#815a43', [0, .55, 0], kitchen); meshBox(7.1, .1, 1.3, '#d0b99a', [0, 1.05, 0], kitchen);
  meshBox(6.8, 3.1, .18, '#c7aa8d', [0, 2.45, .62], kitchen);
  for (let i = -2.7; i <= 2.7; i += 1.35) meshBox(.05, 2.8, .06, '#9b775a', [i, 2.45, .5], kitchen);
  // Stove and sink zones.
  const stove = meshBox(1.3, .06, .82, '#373b36', [6.3, 1.12, -7.3], runtime.worldGroup, { roughness: .38, metalness: .25 });
  for (let x = 5.9; x <= 6.7; x += .4) meshSphere(.1, '#1c2220', [x, 1.18, -7.3], runtime.worldGroup, [1, .2, 1], { segments: 10, metalness: .3 });
  meshBox(1.2, .08, .72, '#6d8b83', [8.9, 1.12, -7.3], runtime.worldGroup, { roughness: .28, metalness: .1 });
  // Fridge.
  const fridge = new THREE.Group(); fridge.position.set(13.2, 0, -6.5); runtime.worldGroup.add(fridge);
  meshBox(1.25, 3.2, 1.15, '#b9b9a8', [0, 1.6, 0], fridge, { roughness: .48, metalness: .13 }); meshBox(.04, 2.65, .04, '#5e645d', [.04, 1.62, -.59], fridge); meshBox(.75, .035, .02, '#787c70', [-.32, 1.8, -.61], fridge);
  runtime.colliders.push({ x: 13.2, z: -6.5, hx: .78, hz: .75 });
  registerInteractable('kitchen', 'آشپزخانه', stove, [6.3, -6.6], 3.0);
  registerInteractable('fridge', 'یخچال', fridge, [13.2, -5.3], 2.6);
  // Bedroom bed and side tables.
  const bedLayout = getFurnitureLayout('bed', { x: 7.2, z: 1.7, rotation: 0 });
  const bed = new THREE.Group(); bed.position.set(bedLayout.x, 0, bedLayout.z); bed.rotation.y = bedLayout.rotation || 0; runtime.worldGroup.add(bed);
  meshBox(4.2, .35, 2.5, '#6b4c3c', [0, .55, 0], bed); meshBox(4.0, .32, 2.25, '#dfc9ac', [0, .78, 0], bed); meshBox(4.1, 2.1, .18, '#805a48', [0, 1.45, 1.06], bed); meshBox(1.25, .23, .72, '#bd8d7b', [-1.1, 1.0, .1], bed); meshBox(1.25, .23, .72, '#bd8d7b', [.8, 1.0, .1], bed);
  const bedCollider = { x: bedLayout.x, z: bedLayout.z, hx: 2.3, hz: 1.45, rotation: bedLayout.rotation || 0 };
  runtime.colliders.push(bedCollider); registerFurniture('bed', bed, bedCollider);
  registerInteractable('bed', 'اتاق خواب', bed, [bedLayout.x, bedLayout.z], 3.0);
  // Wardrobe and mirror.
  const wardrobe = new THREE.Group(); wardrobe.position.set(13.6, 0, 2.0); runtime.worldGroup.add(wardrobe);
  meshBox(2.2, 3.5, .72, '#70503d', [0, 1.75, 0], wardrobe); meshBox(.035, 3.05, .035, '#bd9b78', [.02, 1.75, -.38], wardrobe); meshBox(.035, 3.05, .035, '#bd9b78', [-.02, 1.75, -.38], wardrobe);
  runtime.colliders.push({ x: 13.6, z: 2, hx: 1.3, hz: .6 });
  registerInteractable('wardrobe', 'کمد لباس', wardrobe, [12.3, 2], 2.7);
  const mirror = new THREE.Group(); mirror.position.set(15.5, 0, -.4); runtime.worldGroup.add(mirror);
  meshBox(1.55, 2.75, .12, '#9a7252', [0, 1.7, 0], mirror); meshBox(1.25, 2.42, .035, '#78918a', [0, 1.7, -.08], mirror, { roughness: .14, metalness: .18 });
  registerInteractable('mirror', 'آینه', mirror, [14.2, -.4], 2.5);
  // A little photo ledge.
  const frame = new THREE.Group(); frame.position.set(1.8, 0, -10.58); runtime.worldGroup.add(frame);
  meshBox(1.75, 1.35, .1, '#8c5d45', [0, 2.75, 0], frame); addPhotoTexture(frame, [0, 2.75, .07]);
  registerInteractable('photo', 'قاب عکس', frame, [1.8, -9.45], 2.8);
  // Side accessories.
  addFloorLamp(runtime.worldGroup, [-1.2, 0, -5.2]);
  addPlant(runtime.worldGroup, [-1.2, 0, 3.3], true);
  addPlant(runtime.worldGroup, [11.4, 0, 4.8], false);
  meshBox(.12, 2.8, 2.5, '#a87b5c', [-16.72, 1.8, 7], runtime.worldGroup);
  runtime.colliders.push({ x: -15.8, z: 7, hx: 1, hz: 1.5 });
  // Entrance cue.
  const doormat = new THREE.Mesh(new THREE.BoxGeometry(3.6, .025, 1.2), material('#556c59', { roughness: 1 })); doormat.position.set(0, .02, 10.45); runtime.worldGroup.add(doormat);
  meshBox(2.7, .06, .09, '#e0bf7f', [0, 2.9, 10.84], runtime.worldGroup, { emissive: '#70542b', emissiveIntensity: .25 });
  registerInteractable('door', 'درِ خانه', doormat, [0, 9.8], 3.1);
}

function addPhotoTexture(parent, position) {
  const loader = new THREE.TextureLoader();
  loader.load('assets/couple.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const image = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.12), new THREE.MeshBasicMaterial({ map: texture }));
    image.position.set(position[0], position[1], position[2]);
    image.rotation.y = 0;
    parent.add(image);
  });
}

function addCar() {
  const car = new THREE.Group(); car.position.set(0, 0, 16.6); runtime.worldGroup.add(car);
  meshBox(3.2, .55, 1.65, '#9b5d4e', [0, .65, 0], car, { roughness: .35, metalness: .16 });
  meshBox(1.8, .68, 1.35, '#7c4d42', [0, 1.12, -.12], car, { roughness: .25, metalness: .12 });
  meshBox(1.47, .43, .03, '#7ba09b', [0, 1.18, -.82], car, { roughness: .18, metalness: .25 });
  meshBox(.08, .43, 1.27, '#332b29', [0, 1.18, -.12], car);
  [-1.18, 1.18].forEach((x) => [-.55, .55].forEach((z) => { const wheel = meshCylinder(.37, .37, .18, '#242523', [x, .42, z], car, { segments: 16, roughness: .7 }); wheel.rotation.z = Math.PI / 2; }));
  meshBox(2.35, .12, .06, '#e4b86e', [0, .78, -.84], car, { emissive: '#7a4f23', emissiveIntensity: .45 });
  runtime.car = car;
  registerInteractable('car', 'ماشین', car, [0, 15.2], 3.2);
  runtime.colliders.push({ x: 0, z: 16.6, hx: 2.0, hz: 1.3 });
}

function addDecorations() {
  runtime.decorationGroup.clear();
  runtime.dynamicLights = runtime.dynamicLights.filter((light) => light.parent);
  if (state.decorations.lamp) addFloorLamp(runtime.decorationGroup, [-2.9, 0, -4.3]);
  if (state.decorations.plant) addPlant(runtime.decorationGroup, [3.7, 0, 3.5], true);
  if (state.decorations.rug) createRoundedRug(runtime.decorationGroup, [1.5, 0, 5.2], '#a16c5c', [1.1, .65, 1]);
  if (state.decorations.photo) {
    const smallFrame = new THREE.Group(); smallFrame.position.set(-2.0, 0, -10.58); runtime.decorationGroup.add(smallFrame);
    meshBox(1.3, 1.05, .08, '#8c5d45', [0, 2.45, 0], smallFrame); addPhotoTexture(smallFrame, [0, 2.45, .06]);
  }
}

function registerInteractable(id, label, mesh, position, range = 3) {
  const item = { id, label, mesh, range, staticPosition: new THREE.Vector3(position[0], 0, position[1]), getPosition: null };
  item.getPosition = () => item.staticPosition;
  if (id === 'partner') item.getPosition = () => runtime.partner ? runtime.partner.position : item.staticPosition;
  if (id === 'car') item.getPosition = () => runtime.car ? runtime.car.position : item.staticPosition;
  if (String(id).startsWith('remote:')) item.getPosition = () => runtime.remotePlayers.get(String(id).slice(7))?.group?.position || item.staticPosition;
  if (mesh?.userData?.furnitureKey) item.getPosition = () => mesh.position;
  runtime.interactables.push(item);
  mesh.userData.interactable = id;
  return item;
}

function createPartner() {
  if (runtime.partner) runtime.worldGroup.remove(runtime.partner);
  runtime.partnerRole = runtime.localRole === 'razieh' ? 'abolfazl' : 'razieh';
  runtime.partner = makeAvatar(state.characters[runtime.partnerRole]);
  runtime.partner.position.set(-6.15, 0, -.35);
  runtime.partner.rotation.y = 0;
  runtime.partner.userData.baseY = 0;
  runtime.partner.userData.home = new THREE.Vector3(-6.15, 0, -.35);
  runtime.worldGroup.add(runtime.partner);
  registerInteractable('partner', runtime.partnerRole === 'razieh' ? 'راضیه' : 'ابوالفضل', runtime.partner, [-6.15, -.35], 3.2);
}

function updatePartnerAvatar() {
  if (!runtime.gameReady || !runtime.partner) return;
  const old = runtime.partner.position.clone();
  runtime.worldGroup.remove(runtime.partner);
  runtime.interactables = runtime.interactables.filter((item) => item.id !== 'partner');
  runtime.partner = makeAvatar(state.characters[runtime.partnerRole || 'razieh']);
  runtime.partner.position.copy(old);
  runtime.partner.rotation.y = 0;
  runtime.worldGroup.add(runtime.partner);
  registerInteractable('partner', runtime.partnerRole === 'razieh' ? 'راضیه' : 'ابوالفضل', runtime.partner, [old.x, old.z], 3.2);
}

function addPartnerAfterWorld() {
  if (runtime.network.online) {
    runtime.partner = null;
    rebuildRemotePlayers();
    return;
  }
  createPartner();
  runtime.partnerTarget = new THREE.Vector3(-6.15, 0, -.35);
}

function addWorldPartner() {
  addPartnerAfterWorld();
}

/* ---------- game loop / controls ---------- */
function previewLoop(now) {
  if (runtime.previewReady && runtime.previewAvatar) {
    runtime.previewAvatar.rotation.y = Math.sin(now * .00035) * .11;
    animateAvatar(runtime.previewAvatar, 'idle', now / 1000);
    runtime.previewRenderer.render(runtime.previewScene, runtime.previewCamera);
  }
  if (runtime.modalPreviewReady && runtime.modalAvatar && !$('#custom-modal').classList.contains('hidden')) {
    runtime.modalAvatar.rotation.y = Math.sin(now * .00035) * .11;
    animateAvatar(runtime.modalAvatar, 'idle', now / 1000);
    runtime.modalRenderer.render(runtime.modalScene, runtime.modalCamera);
  }
  requestAnimationFrame(previewLoop);
}

function gameLoop(now) {
  if (!runtime.gameReady) return;
  const dt = Math.min(.05, Math.max(.001, (now - runtime.lastTime) / 1000));
  runtime.lastTime = now;
  if (isGameVisible()) {
    if (!runtime.paused && !runtime.overlayOpen) {
      if (runtime.carMode) updateCar(dt); else updatePlayer(dt);
      updateLocalInteraction(dt);
      updateWorldActors(dt);
      maybeSendNetworkState(now);
      updateTime(dt);
      runtime.saveTimer += dt;
      if (runtime.saveTimer > 24) { runtime.saveTimer = 0; saveGame(false); }
    } else {
      updateWorldActors(Math.min(dt, .03));
    }
    updateCamera(dt);
    updateInteractionUI();
    updateHudClock();
    runtime.renderer.render(runtime.scene, runtime.camera);
  }
  runtime.animationFrame = requestAnimationFrame(gameLoop);
}

function updatePlayer(dt) {
  if (runtime.interactionLock) {
    runtime.velocity.lerp(new THREE.Vector3(), 1 - Math.pow(.0001, dt));
    runtime.moving = false;
    return;
  }
  const moveX = (runtime.keys.KeyD ? 1 : 0) - (runtime.keys.KeyA ? 1 : 0) + runtime.touchMove.x;
  const moveZ = (runtime.keys.KeyS ? 1 : 0) - (runtime.keys.KeyW ? 1 : 0) + runtime.touchMove.y;
  const raw = new THREE.Vector3(moveX, 0, moveZ);
  const hasInput = raw.lengthSq() > .01;
  let desired = new THREE.Vector3();
  if (hasInput) {
    raw.normalize();
    const forward = new THREE.Vector3(-Math.sin(runtime.yaw), 0, -Math.cos(runtime.yaw));
    const right = new THREE.Vector3(Math.cos(runtime.yaw), 0, -Math.sin(runtime.yaw));
    desired.copy(forward).multiplyScalar(-raw.z).addScaledVector(right, raw.x).normalize();
  }
  const speed = (runtime.keys.ShiftLeft || runtime.keys.ShiftRight) ? 4.3 : 2.35;
  const targetVelocity = desired.multiplyScalar(hasInput ? speed : 0);
  runtime.velocity.lerp(targetVelocity, 1 - Math.pow(.0008, dt));
  const next = runtime.playerPos.clone().addScaledVector(runtime.velocity, dt);
  next.x = clamp(next.x, -15.3, 15.3); next.z = clamp(next.z, -9.6, 23.5);
  resolveCollisions(next);
  runtime.playerPos.copy(next);
  runtime.moving = runtime.velocity.length() > .08;
  runtime.localAnimation = runtime.moving ? (speed > 3 ? 'run' : 'walk') : 'idle';
  if (runtime.moving) {
    runtime.bobTime += dt * (speed > 3 ? 11 : 7);
    const now = performance.now();
    if (now - runtime.lastFootstep > (speed > 3 ? 290 : 430)) { runtime.lastFootstep = now; playSfx('footstep'); }
  }
}

function resolveCollisions(position) {
  const radius = .34;
  runtime.colliders.forEach((collider) => {
    const rotation = collider.rotation || 0;
    const dx = position.x - collider.x; const dz = position.z - collider.z;
    const cos = Math.cos(rotation); const sin = Math.sin(rotation);
    const localX = dx * cos + dz * sin;
    const localZ = -dx * sin + dz * cos;
    const overlapX = collider.hx + radius - Math.abs(localX); const overlapZ = collider.hz + radius - Math.abs(localZ);
    if (overlapX > 0 && overlapZ > 0) {
      let pushedX = localX; let pushedZ = localZ;
      if (overlapX < overlapZ) pushedX += localX >= 0 ? overlapX : -overlapX;
      else pushedZ += localZ >= 0 ? overlapZ : -overlapZ;
      position.x = collider.x + pushedX * cos - pushedZ * sin;
      position.z = collider.z + pushedX * sin + pushedZ * cos;
    }
  });
}

function updateCar(dt) {
  if (runtime.vehicleSeat === 'passenger') {
    runtime.carSpeed = 0;
    runtime.localAnimation = 'passenger';
    runtime.playerPos.set(runtime.car.position.x, 1.62, runtime.car.position.z);
    return;
  }
  const forwardInput = (runtime.keys.KeyW ? 1 : 0) - (runtime.keys.KeyS ? 1 : 0);
  const turnInput = (runtime.keys.KeyD ? 1 : 0) - (runtime.keys.KeyA ? 1 : 0);
  const touchForward = -runtime.touchMove.y;
  const touchTurn = runtime.touchMove.x;
  const input = clamp(forwardInput + touchForward, -1, 1);
  runtime.carSpeed += input * 8 * dt;
  runtime.carSpeed *= Math.pow(.25, dt);
  runtime.carSpeed = clamp(runtime.carSpeed, -3.5, 7.4);
  runtime.carHeading += (turnInput + touchTurn) * dt * (.75 + Math.abs(runtime.carSpeed) * .12);
  const direction = new THREE.Vector3(Math.sin(runtime.carHeading), 0, Math.cos(runtime.carHeading));
  runtime.car.position.addScaledVector(direction, runtime.carSpeed * dt);
  runtime.car.position.x = clamp(runtime.car.position.x, -14, 14);
  runtime.car.position.z = clamp(runtime.car.position.z, 14.3, 24.1);
  runtime.car.rotation.y = runtime.carHeading;
  runtime.moving = Math.abs(runtime.carSpeed) > .15;
  runtime.localAnimation = 'drive';
  runtime.playerPos.set(runtime.car.position.x, 1.62, runtime.car.position.z);
  state.playerPosition = { x: runtime.car.position.x, z: runtime.car.position.z };
  if (runtime.network.online && runtime.vehicleSeat === 'driver') sendNetwork({ type: 'vehicleUpdate', vehicle: { x: runtime.car.position.x, z: runtime.car.position.z, heading: runtime.carHeading, speed: runtime.carSpeed } });
}

function updateCamera(dt) {
  if (runtime.carMode && runtime.car && runtime.vehicleSeat === 'passenger') {
    const right = new THREE.Vector3(Math.cos(runtime.carHeading) * .72, 0, -Math.sin(runtime.carHeading) * .72);
    const passengerView = runtime.car.position.clone().add(right).add(new THREE.Vector3(0, 1.52, 0));
    runtime.camera.position.lerp(passengerView, 1 - Math.pow(.001, dt));
    const forward = new THREE.Vector3(Math.sin(runtime.carHeading), 0, Math.cos(runtime.carHeading));
    runtime.camera.lookAt(runtime.car.position.clone().add(forward.multiplyScalar(4)).add(new THREE.Vector3(0, 1.25, 0)));
    return;
  }
  if (runtime.carMode && runtime.car) {
    const back = new THREE.Vector3(-Math.sin(runtime.carHeading) * 5.6, 2.65, -Math.cos(runtime.carHeading) * 5.6);
    const desired = runtime.car.position.clone().add(back);
    runtime.camera.position.lerp(desired, 1 - Math.pow(.001, dt));
    const look = runtime.car.position.clone().add(new THREE.Vector3(Math.sin(runtime.carHeading) * 2.5, 1.1, Math.cos(runtime.carHeading) * 2.5));
    runtime.camera.lookAt(look);
    return;
  }
  const bob = runtime.moving ? Math.sin(runtime.bobTime) * .027 : 0;
  const seatedHeight = runtime.seated ? 1.08 : runtime.playerPos.y;
  runtime.camera.position.set(runtime.playerPos.x, seatedHeight + bob, runtime.playerPos.z);
  runtime.camera.rotation.y = runtime.yaw;
  runtime.camera.rotation.x = runtime.pitch + (runtime.moving ? Math.cos(runtime.bobTime * .5) * .007 : 0) + (runtime.cameraShake || 0);
}

function updateWorldActors(dt) {
  if (runtime.network.online) { updateRemotePlayers(dt); return; }
  if (!runtime.partner) return;
  runtime.partnerTimer += dt;
  if (!runtime.partnerAction && runtime.partnerTimer > 20) {
    runtime.partnerTimer = 0;
    const spots = [new THREE.Vector3(-6.15, 0, -.35), new THREE.Vector3(8.1, 0, -5.7), new THREE.Vector3(10.2, 0, 3.4)];
    runtime.partnerTarget = spots[Math.floor(Math.random() * spots.length)].clone();
  }
  if (!runtime.partnerAction && runtime.partnerTarget) {
    const destination = runtime.partnerTarget;
    const dx = destination.x - runtime.partner.position.x; const dz = destination.z - runtime.partner.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > .12) {
      runtime.partner.position.x += (dx / distance) * dt * .42;
      runtime.partner.position.z += (dz / distance) * dt * .42;
      runtime.partner.rotation.y = Math.atan2(dx, dz);
    }
  }
  const idle = Math.sin(performance.now() * .002 + 1.2) * .014;
  runtime.partner.position.y = idle;
  const partnerIsMoving = runtime.partnerTarget && runtime.partner.position.distanceTo(runtime.partnerTarget) > .14;
  animateAvatar(runtime.partner, runtime.partnerAction?.type || (partnerIsMoving ? 'walk' : 'idle'), performance.now() / 1000);
  if (runtime.partnerAction) {
    runtime.partnerAction.time -= dt;
    const pulse = Math.sin((2.4 - runtime.partnerAction.time) * 9) * .035;
    runtime.partner.scale.set(1 + pulse, 1 - pulse * .4, 1 + pulse);
    if (runtime.partnerAction.time <= 0) { runtime.partnerAction = null; runtime.partner.scale.set(1, 1, 1); runtime.interactionLock = false; runtime.seated = null; runtime.localAnimation = 'idle'; }
  }
}

function updateTime(dt) {
  state.minutes += dt * .62;
  if (state.minutes >= 1440) { state.minutes -= 1440; state.day += 1; state.tasks = { greet: false, cook: false, outside: false, date: false, decorate: false }; }
  const bucket = getTimePhase(state.minutes).phase;
  if (bucket !== runtime.timeBucket) { runtime.timeBucket = bucket; updateLighting(); }
}

function getTimePhase(minutes) {
  const hour = Math.floor(minutes / 60) % 24;
  let phase = 'day'; let label = 'روز';
  if (hour >= 5 && hour < 10) { phase = 'morning'; label = 'صبح'; }
  else if (hour >= 10 && hour < 17) { phase = 'day'; label = 'ظهر'; }
  else if (hour >= 17 && hour < 20) { phase = 'sunset'; label = 'غروب'; }
  else { phase = 'night'; label = 'شب'; }
  return { hour, phase, label };
}

function updateLighting() {
  if (!runtime.scene) return;
  const { phase } = getTimePhase(state.minutes);
  const colors = { morning: '#526e6b', day: '#71928b', sunset: '#665149', night: '#17242b' };
  const fogColors = { morning: '#526e6b', day: '#71928b', sunset: '#665149', night: '#17242b' };
  runtime.scene.background.set(colors[phase]);
  runtime.scene.fog.color.set(fogColors[phase]);
  const settings = { morning: [1.1, .85], day: [1.65, 1.25], sunset: [.95, .7], night: [.28, .22] }[phase];
  if (runtime.sun) runtime.sun.intensity = settings[0];
  runtime.dynamicLights.forEach((light) => { if (light.isPointLight) light.intensity = light.userData.baseIntensity ?? (phase === 'night' ? 1.35 : .85); });
  if (runtime.worldGroup) runtime.worldGroup.traverse((obj) => { if (obj.isMesh && obj.material && obj.material.emissive && obj.userData.cityWindow) obj.material.emissiveIntensity = phase === 'night' ? .8 : .18; });
}

function updateHudClock() {
  runtime.hudTimer += .016;
  if (runtime.hudTimer < .08) return;
  runtime.hudTimer = 0;
  const { hour, phase, label } = getTimePhase(state.minutes);
  const minute = Math.floor(state.minutes % 60);
  $('#time-label').textContent = `${label} · ${fa(String(hour).padStart(2, '0'))}:${fa(String(minute).padStart(2, '0'))}`;
  $('#phone-time').textContent = `${fa(String(hour).padStart(2, '0'))}:${fa(String(minute).padStart(2, '0'))}`;
  $('#sun-icon').textContent = phase === 'night' ? '☾' : phase === 'sunset' ? '◒' : '☼';
  $('#weather-label').textContent = state.weather === 'rain' ? 'باران نرم' : phase === 'night' ? 'شب آرام' : 'هوای آرام';
  $('#location-label').textContent = runtime.carMode ? 'خیابان محله · رانندگی' : (runtime.playerPos.z > 11 ? 'محله‌ی ما · بیرون' : 'خانه · نشیمن');
  updateHUD(false);
}

function updateHUD(force = false) {
  const stats = state.stats;
  $('#relationship-stat').textContent = `${fa(Math.round(stats.relationship))}٪`;
  $('#happiness-stat').textContent = `${fa(Math.round(stats.happiness))}٪`;
  $('#energy-stat').textContent = `${fa(Math.round(stats.energy))}٪`;
  $('#wallet-stat').textContent = fa(Math.round(state.wallet));
  $('#relationship-bar').style.width = `${clamp(stats.relationship, 0, 100)}%`;
  $('#happiness-bar').style.width = `${clamp(stats.happiness, 0, 100)}%`;
  $('#energy-bar').style.width = `${clamp(stats.energy, 0, 100)}%`;
  const taskKeys = Object.keys(state.tasks); const complete = taskKeys.filter((key) => state.tasks[key]).length;
  $('#objective-progress').style.width = `${Math.max(8, (complete / taskKeys.length) * 100)}%`;
  const next = !state.tasks.greet ? ['یک عصر آرام باهم بسازید', 'به راضیه نزدیک شوید و سلام کنید'] : !state.tasks.cook ? ['یک چیز خوشمزه درست کنید', 'آشپزخانه نزدیک پنجره است'] : !state.tasks.outside ? ['کمی هوای تازه بگیرید', 'از در خانه بیرون بروید'] : !state.tasks.date ? ['یک خاطره‌ی تازه بسازید', 'کافه یا پارک را امتحان کنید'] : !state.tasks.decorate ? ['یک گوشه را مال خودتان کنید', 'از نشیمن، خانه را زیباتر کنید'] : ['امروز را با یک آغوش تمام کنید', 'هیچ عجله‌ای برای زندگی نیست'];
  $('#objective-title').textContent = next[0]; $('#objective-subtitle').textContent = next[1];
  if (force) updatePhoneContent('home');
}

function updateInteractionUI() {
  if (runtime.carMode || hasOpenPanel() || !isGameVisible()) {
    if (runtime.carMode) runtime.currentTarget = null;
    $('#interaction-prompt').classList.add('hidden'); $('#affection-prompt').classList.add('hidden'); return;
  }
  let best = null; let bestDistance = Infinity;
  runtime.interactables.forEach((item) => {
    const point = item.getPosition ? item.getPosition() : item.staticPosition;
    const dist = Math.hypot(runtime.playerPos.x - point.x, runtime.playerPos.z - point.z);
    if (dist <= item.range && dist < bestDistance) { best = item; bestDistance = dist; }
  });
  if (best !== runtime.currentTarget) {
    runtime.currentTarget = best;
    if (runtime.lastTargetId !== best?.id) { runtime.lastTargetId = best?.id || null; if (best) playTone('near'); }
  }
  if (best) {
    $('#interaction-prompt').classList.remove('hidden');
    $('#prompt-title').textContent = isPartnerTargetId(best.id) ? (best.label || (runtime.partnerRole === 'razieh' ? 'راضیه' : 'ابوالفضل')) : best.label;
    $('#prompt-subtitle').textContent = isPartnerTargetId(best.id) ? 'E برای انتخاب یک لحظه باهم' : 'E برای دیدن گزینه‌ها';
    if (isPartnerTargetId(best.id)) $('#affection-prompt').classList.remove('hidden'); else $('#affection-prompt').classList.add('hidden');
  } else {
    $('#interaction-prompt').classList.add('hidden'); $('#affection-prompt').classList.add('hidden');
  }
}

function updatePartnerAction(type) {
  if (runtime.partner) {
    const delta = runtime.partner.position.clone().sub(runtime.playerPos); delta.y = 0;
    if (delta.length() > .01) {
      const dir = delta.normalize();
      runtime.partner.position.copy(runtime.playerPos).addScaledVector(dir, type === 'hold' ? .9 : .72);
      runtime.partner.rotation.y = Math.atan2(-dir.x, -dir.z);
      runtime.yaw = Math.atan2(-dir.x, -dir.z);
    }
  }
  runtime.partnerAction = { type, time: type === 'dance' ? 5 : 2.25 };
  runtime.velocity.set(0, 0, 0); runtime.interactionLock = true;
  playTone(type === 'kiss' ? 'kiss' : type === 'highfive' ? 'highfive' : 'hug');
  for (let i = 0; i < 5; i += 1) setTimeout(() => createHeart(), i * 125);
}

function createHeart() {
  const heart = document.createElement('div'); heart.className = 'heart-float'; heart.textContent = Math.random() > .35 ? '♥' : '✦';
  const rect = $('#game-screen').getBoundingClientRect();
  const partner = runtime.currentTarget && isPartnerTargetId(runtime.currentTarget.id) ? (runtime.currentTarget.id === 'partner' ? runtime.partner?.position : runtime.remotePlayers.get(remoteIdFromTarget(runtime.currentTarget.id))?.group?.position) : (runtime.partner ? runtime.partner.position : { x: 0, z: 0 });
  const point = partner || { x: runtime.playerPos.x, z: runtime.playerPos.z };
  const dx = (point.x - runtime.playerPos.x) * 10;
  heart.style.left = `${50 + clamp(dx, -17, 17) + (Math.random() - .5) * 5}%`;
  heart.style.top = `${45 + (Math.random() - .5) * 6}%`;
  $('#game-screen').appendChild(heart);
  setTimeout(() => heart.remove(), 1700);
}

function quickAffection() {
  if (!runtime.currentTarget || !isPartnerTargetId(runtime.currentTarget.id)) { showToast(runtime.network.online ? 'همراه‌تان را از نزدیک پیدا کنید.' : 'راضیه را از نزدیک پیدا کنید.', false); return; }
  runInteraction(runtime.currentTarget.id, 'hug');
}

function openActionSheet(target = runtime.currentTarget) {
  if (!target) { showToast('چیزی برای تعامل در نزدیکی نیست.', false); return; }
  if (runtime.carMode) return;
  const actions = actionsFor(target.id);
  runtime.overlayOpen = true;
  $('#sheet-title').textContent = isPartnerTargetId(target.id) ? `با ${target.label || 'همراه'}` : target.label;
  $('#action-grid').innerHTML = actions.map((action) => `<button class="action-card" data-run-action="${action.id}" data-target-id="${target.id}"><span class="action-icon">${action.icon}</span><b>${action.label}</b><small>${action.subtitle}</small></button>`).join('');
  $('#action-grid').querySelectorAll('[data-run-action]').forEach((button) => button.addEventListener('click', () => { runInteraction(button.dataset.targetId, button.dataset.runAction); }));
  $('#action-sheet').classList.remove('hidden');
  playTone('open');
}

function actionsFor(id) {
  if (isPartnerTargetId(id)) return [
    { id: 'talk', icon: '☏', label: 'صحبت', subtitle: 'چند کلمه از امروز' },
    { id: 'hug', icon: '♡', label: 'بغل', subtitle: 'یک آغوش واقعی' },
    { id: 'kiss', icon: '✦', label: 'بوس', subtitle: 'نرم و کوتاه' },
    { id: 'hold', icon: '⌁', label: 'دست گرفتن', subtitle: 'کنار هم قدم بزنیم' },
    { id: 'cuddle', icon: '☁', label: 'کمی نزدیک‌تر', subtitle: 'آرام کنار هم' },
    { id: 'sitTogether', icon: '⌂', label: 'باهم بنشینیم', subtitle: 'یک توقف دونفره' },
    { id: 'teaTogether', icon: '☕', label: 'چای دونفره', subtitle: 'یک فنجان برای هر دو' },
    { id: 'gift', icon: '◇', label: 'هدیه‌ی کوچک', subtitle: 'چیزی برای لبخند' },
    { id: 'highfive', icon: '✋', label: 'های‌فایو', subtitle: 'یک تبریک سریع' },
    { id: 'dance', icon: '♫', label: 'رقص دونفره', subtitle: 'چند ثانیه باهم' },
  ];
  const map = {
    partner: [
      { id: 'talk', icon: '☏', label: 'صحبت', subtitle: 'چند کلمه از امروز' },
      { id: 'hug', icon: '♡', label: 'بغل', subtitle: 'یک آغوش طولانی' },
      { id: 'kiss', icon: '✦', label: 'بوس', subtitle: 'نرم و کوتاه' },
      { id: 'hold', icon: '⌁', label: 'دست گرفتن', subtitle: 'کنار هم قدم بزنیم' },
      { id: 'gift', icon: '◇', label: 'هدیه‌ی کوچک', subtitle: 'چیزی برای لبخند' },
      { id: 'tease', icon: '☻', label: 'شوخی آرام', subtitle: 'کمی شیطنت' },
    ],
    sofa: [
      { id: 'sit', icon: '⌂', label: 'بنشینیم', subtitle: 'کمی استراحت' },
      { id: 'movie', icon: '▣', label: 'فیلم ببینیم', subtitle: 'کنار هم روی مبل' },
      { id: 'cuddle', icon: '♡', label: 'نزدیک بنشینیم', subtitle: 'یک لحظه‌ی آرام' },
      { id: 'decorate', icon: '✣', label: 'چیدمان خانه', subtitle: 'یک گوشه را عوض کنیم' },
    ],
    kitchen: [
      { id: 'cook', icon: '♨', label: 'آشپزی', subtitle: 'یک غذای دونفره' },
      { id: 'tea', icon: '☕', label: 'چای درست کنیم', subtitle: 'برای عصرانه' },
      { id: 'serve', icon: '⌁', label: 'غذا سرو کنیم', subtitle: 'اگر چیزی آماده است' },
    ],
    fridge: [
      { id: 'fridge', icon: '▤', label: 'باز کردن', subtitle: 'موجودی آشپزخانه' },
      { id: 'cook', icon: '♨', label: 'انتخاب غذا', subtitle: 'با چیزهای داخل خانه' },
    ],
    wardrobe: [
      { id: 'change', icon: '◌', label: 'تغییر لباس', subtitle: 'لباس امشب را انتخاب کن' },
      { id: 'mirror', icon: '⌁', label: 'دیدن آینه', subtitle: 'جزئیات ظاهر' },
    ],
    mirror: [{ id: 'mirror', icon: '◌', label: 'شخصی‌سازی', subtitle: 'ظاهر خودتان را تغییر دهید' }],
    photo: [{ id: 'memories', icon: '♡', label: 'خاطرات', subtitle: 'قاب‌های این خانه' }],
    door: [{ id: 'outside', icon: '↗', label: 'بیرون بریم', subtitle: 'کمی هوای محله' }],
    car: [{ id: 'car', icon: '▱', label: 'سوار ماشین شو', subtitle: 'یک دور کوتاه در محله' }],
    park: [{ id: 'date', icon: '☼', label: 'قرار در پارک', subtitle: 'روی نیمکت و زیر درخت' }],
    cafe: [{ id: 'date', icon: '☕', label: 'قرار کافه', subtitle: 'چای و یک گفت‌وگوی خوب' }],
    bed: [{ id: 'rest', icon: '☾', label: 'استراحت', subtitle: 'امشب زودتر بخوابیم' }],
    desk: [
      { id: 'work', icon: '▣', label: 'کار کوتاه', subtitle: 'یک ساعت تمرکز' },
      { id: 'study', icon: '✎', label: 'برنامه‌ریزی', subtitle: 'فردا را سبک‌تر کنیم' },
    ],
  };
  return map[id] || [{ id: 'look', icon: '◌', label: 'نگاه کنیم', subtitle: 'این گوشه‌ی خانه' }];
}

function runInteraction(targetId, action) {
  closePanels();
  playTone('click');
  if (runtime.network.online && isPartnerTargetId(targetId)) {
    if (action === 'gift' && state.wallet < 120000) { showToast('برای هدیه‌ی کوچک، کمی پول کم دارید.', false); return; }
    if (action === 'teaTogether' && state.inventory.tea <= 0) { showToast('چای تمام شده؛ اول کمی چای تهیه کنید.', false); return; }
    sendNetworkInteraction(targetId, action);
    return;
  }
  switch (action) {
    case 'talk':
      state.tasks.greet = true; updatePartnerAction('talk'); applyDelta({ relationship: 1, happiness: 1, stress: -1 });
      $('#dialogue-text').textContent = DIALOGUE_LINES[Math.floor(Math.random() * DIALOGUE_LINES.length)];
      $('#dialogue-modal').classList.remove('hidden'); runtime.overlayOpen = true; playTone('dialogue'); updateHUD(); break;
    case 'hug':
      state.tasks.greet = true; updatePartnerAction('hug'); applyDelta({ relationship: 3, happiness: 3, energy: -1, stress: -2 });
      addMemoryOnce('hug', { icon: '♡', title: 'یک آغوش در نشیمن', detail: `روز ${fa(state.day)} · همین امروز` }); showToast('آغوش‌تان خانه را گرم‌تر کرد.', true); updateHUD(); break;
    case 'kiss':
      state.tasks.greet = true; updatePartnerAction('kiss'); applyDelta({ relationship: 2, happiness: 3, stress: -1 }); showToast('یک بوسه‌ی کوتاه، یک لبخند بلند.', true); updateHUD(); break;
    case 'hold':
      state.tasks.greet = true; updatePartnerAction('hold'); applyDelta({ relationship: 2, happiness: 2 }); showToast('دست‌های‌تان را پیدا کردید.', true); updateHUD(); break;
    case 'gift':
      if (state.wallet < 120000) { showToast('برای هدیه‌ی کوچک، کمی پول کم دارید.', false); break; }
      state.wallet -= 120000; updatePartnerAction('gift'); applyDelta({ relationship: 5, happiness: 4, stress: -2 }); addMemoryOnce('gift', { icon: '◇', title: 'هدیه‌ی بی‌دلیل', detail: 'چیزی کوچک برای حال بهتر' }); showToast('هدیه را با یک لبخند گرفت.', true); updateHUD(); break;
    case 'tease': updatePartnerAction('tease'); applyDelta({ relationship: 2, happiness: 3 }); showToast('شوخی‌تان جواب داد؛ البته کمی هم اخم کرد.', true); updateHUD(); break;
    case 'highfive': updatePartnerAction('highfive'); applyDelta({ relationship: 2, happiness: 2 }); showToast('های‌فایو؛ تیم دونفره آماده است.', true); updateHUD(); break;
    case 'dance': updatePartnerAction('dance'); applyDelta({ relationship: 3, happiness: 5, energy: -3 }); addMemoryOnce('dance', { icon: '♫', title: 'رقص وسط خانه', detail: 'چند ثانیه، بدون دلیل خاص' }); showToast('موسیقی را خودتان شروع کردید.', true); updateHUD(); break;
    case 'sit': startLocalSeat('sit', 3.5); applyDelta({ energy: 7, happiness: 2 }); showToast('چند دقیقه بدون عجله نشستید.', false); updateHUD(); break;
    case 'movie': startLocalSeat('sit', 5.5); applyDelta({ happiness: 6, relationship: 2, energy: -2 }); addMemoryOnce('movie', { icon: '▣', title: 'فیلم شبانه', detail: 'پایانش را باهم حدس زدیم' }); showToast('فیلم شروع شد؛ گوشی‌ها کنار.', true); updateHUD(); break;
    case 'cuddle': updatePartnerAction('cuddle'); applyDelta({ happiness: 5, relationship: 3, stress: -3 }); showToast('کنار هم، بی‌نیاز از حرف.', true); updateHUD(); break;
    case 'sitTogether': updatePartnerAction('sitTogether'); runtime.seated = { action: 'sitTogether' }; applyDelta({ happiness: 4, relationship: 3, energy: 2 }); showToast('کنار هم نشستید؛ بقیه‌ی دنیا چند دقیقه صبر می‌کند.', true); updateHUD(); break;
    case 'teaTogether':
      if (state.inventory.tea <= 0) { showToast('چای تمام شده؛ اول کمی چای تهیه کنید.', false); break; }
      state.inventory.tea -= 1; updatePartnerAction('drink'); applyDelta({ happiness: 5, relationship: 3, energy: 2 }); addMemoryOnce('tea-together', { icon: '☕', title: 'چای دونفره', detail: 'دو فنجان، یک پنجره' }); showToast('چای را کنار هم نوشیدید.', true); updateHUD(); break;
    case 'decorate': openDecorPanel(); break;
    case 'cook': openCooking(); break;
    case 'tea':
      if (state.inventory.tea <= 0) { showToast('چای تمام شده؛ از خریدهای بعدی یادتان باشد.', false); break; }
      state.inventory.tea -= 1; applyDelta({ happiness: 4, relationship: 2, energy: 2 }); state.tasks.cook = true; addMemoryOnce('tea', { icon: '☕', title: 'چای عصرانه', detail: 'دو فنجان، یک گفت‌وگوی آرام' }); showToast('چای دم کشید؛ بوی خانه عوض شد.', true); updateHUD(); break;
    case 'serve':
      if (state.inventory.preparedFood <= 0) { showToast('اول یک غذا باهم درست کنید.', false); break; }
      state.inventory.preparedFood -= 1; applyDelta({ happiness: 5, relationship: 3, hunger: 18, energy: 4 }); showToast('غذا را کنار هم خوردید.', true); updateHUD(); break;
    case 'fridge': playSfx('fridge'); openPhone('home'); break;
    case 'change': case 'mirror': openGameCustomizer(); break;
    case 'memories': openMemoryModal(); break;
    case 'outside': state.tasks.outside = true; runtime.playerPos.z = Math.max(runtime.playerPos.z, 10.8); playSfx('door'); if (runtime.network.online) syncSharedState(); showToast('هوای بیرون خنک‌تر است؛ ماشین همان جلوست.', true); $('#scene-caption').querySelector('#caption-text').textContent = 'محله‌ی ما، چند قدم آن‌طرف‌تر.'; updateHUD(); break;
    case 'car': enterCar(); break;
    case 'date': openDatePanel(targetId); break;
    case 'rest': startLocalSeat('rest', 4.2); applyDelta({ energy: 15, happiness: 2, stress: -4, hunger: -4 }); state.minutes += 90; showToast('خواب کوتاه، حال بهتر.', true); updateHUD(); break;
    case 'work':
      state.wallet += 250000; state.minutes += 75; applyDelta({ energy: -12, happiness: -1, stress: 4 });
      showToast('یک ساعت کار؛ دستمزدش به کیف پول مشترک رفت.', true); updateHUD(); break;
    case 'study':
      state.minutes += 35; applyDelta({ energy: -5, happiness: 1, stress: -1 });
      showToast('برای فردا چند خط برنامه ریختید.', false); updateHUD(); break;
    default: showToast('این گوشه هنوز داستان خودش را پیدا می‌کند.', false); break;
  }
}

function applyDelta(delta) {
  Object.keys(delta).forEach((key) => {
    if (key in state.stats) state.stats[key] = clamp(state.stats[key] + delta[key], 0, 100);
  });
  if (runtime.network.online) syncSharedState();
}

function addMemoryOnce(key, item) {
  const exists = state.memories.some((memory) => memory.key === key);
  if (!exists) {
    state.memories.unshift({ key, ...item });
    if (runtime.network.online) syncSharedState();
  }
}

function enterCar() {
  if (!runtime.car) return;
  if (runtime.network.online) {
    sendNetwork({ type: 'vehicleRequest', action: 'enter' });
    showToast('در حال سوار شدن…', false);
    return;
  }
  runtime.vehicleSeat = 'driver'; runtime.carMode = true;
  runtime.carHeading = runtime.car.rotation.y || 0; runtime.carSpeed = 0;
  state.tasks.outside = true;
  playSfx('car');
  showToast('آماده‌ای؟ یک دور کوتاه در محله.', true);
  $('#scene-caption').querySelector('#caption-text').textContent = 'چراغ‌ها روشن، موسیقی آرام، راه باز.';
  updateHUD();
}

function applyVehicleState(vehicle = {}) {
  runtime.vehicleState = { ...runtime.vehicleState, ...vehicle };
  if (!runtime.car) return;
  runtime.car.position.x = Number(runtime.vehicleState.x || runtime.car.position.x);
  runtime.car.position.z = Number(runtime.vehicleState.z || runtime.car.position.z);
  runtime.car.rotation.y = Number(runtime.vehicleState.heading || runtime.car.rotation.y);
  const id = runtime.network.clientId;
  const nextSeat = runtime.vehicleState.driverId === id ? 'driver' : runtime.vehicleState.passengerId === id ? 'passenger' : null;
  runtime.vehicleSeat = nextSeat;
  runtime.carMode = Boolean(nextSeat);
  if (nextSeat === 'driver') {
    runtime.carHeading = runtime.vehicleState.heading || runtime.carHeading;
    runtime.carSpeed = runtime.vehicleState.speed || 0;
    state.tasks.outside = true;
    playSfx('car'); showToast('راننده شدید؛ همراهتان کنار شماست.', true);
  } else if (nextSeat === 'passenger') {
    runtime.carSpeed = 0; state.tasks.outside = true;
    playSfx('car'); showToast('روی صندلی کناری نشستید.', true);
  } else if (runtime.network.online) {
    runtime.carSpeed = 0;
  }
  if (runtime.network.online) syncSharedState();
  updateHUD();
}

function exitCar() {
  if (runtime.network.online) {
    sendNetwork({ type: 'vehicleRequest', action: 'exit' });
    return;
  }
  runtime.vehicleSeat = null; runtime.carMode = false; runtime.carSpeed = 0;
  runtime.playerPos.set(runtime.car.position.x + 2.5, 1.62, runtime.car.position.z);
  playSfx('car');
  showToast('رسیدیم. پیاده شویم؟', false);
  $('#scene-caption').querySelector('#caption-text').textContent = 'هر طرف محله، یک خاطره‌ی کوچک.';
}

/* ---------- cooking, dates, decor, phone ---------- */
const RECIPES = [
  { id: 'omelette', icon: '🍳', name: 'املت دو نفره', detail: 'تخم‌مرغ، گوجه و کمی خنده', steps: ['مواد را روی میز بچینید.', 'باهم هم بزنید؛ آرام و نه خیلی زیاد.', 'سرو کنید و اولین لقمه را به هم تعارف کنید.'] },
  { id: 'pasta', icon: '🍝', name: 'پاستای شبانه', detail: 'ساده، گرم، قابل تقسیم', steps: ['آب را به جوش بیاورید.', 'سس را با سلیقه‌ی خودتان قاطی کنید.', 'دو بشقاب، یک میز، شام آماده است.'] },
  { id: 'tea', icon: '☕', name: 'چای و نبات', detail: 'برای بعدازظهرهای دوری', steps: ['قوری را گرم کنید.', 'چای را دم بدهید و دو فنجان بردارید.', 'کنار پنجره بنشینید.'] },
];

function openCooking() {
  runtime.overlayOpen = true;
  runtime.cooking = null;
  $('#cooking-title').textContent = 'باهم چی درست کنیم؟';
  $('#cooking-content').innerHTML = `<p class="modal-lede">یک غذای کوچک، یک همکاری کوچک؛ اما حال خانه را عوض می‌کند.</p><div class="recipe-grid">${RECIPES.map((recipe) => `<button class="recipe-card" data-recipe="${recipe.id}"><span class="recipe-icon">${recipe.icon}</span><b>${recipe.name}</b><small>${recipe.detail}</small></button>`).join('')}</div>`;
  $('#cooking-content').querySelectorAll('[data-recipe]').forEach((button) => button.addEventListener('click', () => startCooking(button.dataset.recipe)));
  $('#cooking-panel').classList.remove('hidden');
}

function startCooking(id) {
  const recipe = RECIPES.find((item) => item.id === id) || RECIPES[0];
  runtime.cooking = { recipe, step: 0 };
  runtime.localAnimation = 'cook';
  if (runtime.network.online) sendNetwork({ type: 'activity', action: 'cook', status: 'start' });
  renderCookingStep();
}

function renderCookingStep() {
  const cooking = runtime.cooking; if (!cooking) return;
  const recipe = cooking.recipe;
  const step = cooking.step;
  $('#cooking-title').textContent = recipe.name;
  $('#cooking-content').innerHTML = `<div class="cooking-step"><div class="cooking-progress">${recipe.steps.map((_, index) => `<span class="${index <= step ? 'active' : ''}"></span>`).join('')}</div><div class="cooking-visual"><div class="cooking-emoji">${recipe.icon}</div><div><h4>مرحله‌ی ${fa(step + 1)} از ${fa(recipe.steps.length)}</h4><p>${recipe.steps[step]}</p></div></div><button class="primary-btn" data-cooking-next>${step === recipe.steps.length - 1 ? 'سرو کنیم' : 'انجام شد، مرحله‌ی بعد'} <i>←</i></button></div>`;
  $('#cooking-content').querySelector('[data-cooking-next]').addEventListener('click', () => {
    if (runtime.cooking.step < recipe.steps.length - 1) { runtime.cooking.step += 1; renderCookingStep(); playTone('click'); }
    else completeCooking(recipe);
  });
}

function completeCooking(recipe) {
  if (runtime.network.online) sendNetwork({ type: 'activity', action: 'cook', status: 'end' });
  runtime.localAnimation = 'idle';
  if (recipe.id === 'tea') state.inventory.tea += 1; else state.inventory.preparedFood += 1;
  state.tasks.cook = true;
  applyDelta({ happiness: 7, relationship: 3, energy: -2, hunger: 10 });
  addMemoryOnce(`cook-${recipe.id}`, { icon: recipe.icon, title: recipe.name, detail: `روز ${fa(state.day)} · باهم آماده شد` });
  closePanels();
  playSfx('stove');
  showToast(`${recipe.name} آماده شد؛ نوش جان دونفره!`, true);
  updateHUD(); playTone('success');
}

function openDatePanel(place = 'park') {
  runtime.overlayOpen = true;
  runtime.modalDate = place;
  $('#date-panel').classList.remove('hidden');
  $('#date-options').innerHTML = [
    { id: 'cafe', icon: '☕', name: 'کافه‌ی محله', detail: 'چای داغ و یک میز کنار پنجره', cost: 180000 },
    { id: 'park', icon: '☼', name: 'نیمکتِ پارک', detail: 'قدم زدن زیر چراغ‌ها', cost: 0 },
    { id: 'sunset', icon: '◒', name: 'دور شبانه', detail: 'ماشین، موسیقی و چراغ‌های شهر', cost: 70000 },
  ].map((item) => `<button class="date-option" data-date="${item.id}"><span class="date-icon">${item.icon}</span><span><b>${item.name}</b><small>${item.detail}</small></span><em>${item.cost ? `${fa(item.cost)} تومان` : 'رایگان'}</em></button>`).join('');
  $('#date-options').querySelectorAll('[data-date]').forEach((button) => button.addEventListener('click', () => completeDate(button.dataset.date)));
}

function completeDate(type) {
  const costs = { cafe: 180000, park: 0, sunset: 70000 };
  const names = { cafe: 'قرار کافه', park: 'قدم زدن در پارک', sunset: 'دور شبانه‌ی محله' };
  const icons = { cafe: '☕', park: '☼', sunset: '◒' };
  const cost = costs[type] || 0;
  if (state.wallet < cost) { showToast('برای این قرار، کمی پس‌انداز لازم است.', false); return; }
  state.wallet -= cost; state.tasks.date = true;
  applyDelta({ happiness: 9, relationship: 6, energy: -5, stress: -5 });
  addMemoryOnce(`date-${type}`, { icon: icons[type], title: names[type], detail: `روز ${fa(state.day)} · یک خاطره‌ی دونفره` });
  closePanels(); showToast(`${names[type]} به خاطرات‌تان اضافه شد.`, true); updateHUD(); playTone('success');
}

const DECOR_ITEMS = [
  { id: 'lamp', icon: '♨', name: 'چراغ کنار پنجره', detail: 'نور گرم برای عصرها', price: 260000 },
  { id: 'plant', icon: '♧', name: 'گیاه سبز', detail: 'کمی نفس تازه برای خانه', price: 140000 },
  { id: 'rug', icon: '◉', name: 'گلیم آجری', detail: 'یک رنگ آرام روی کف', price: 310000 },
  { id: 'photo', icon: '▣', name: 'قاب دوم', detail: 'یک تصویر تازه از شما', price: 210000 },
];

function openDecorPanel() {
  runtime.overlayOpen = true;
  $('#decor-panel').classList.remove('hidden');
  renderDecorItems();
}

function renderDecorItems() {
  $('#decor-grid').innerHTML = DECOR_ITEMS.map((item) => {
    const owned = state.decorations[item.id];
    return `<div class="decor-item ${owned ? 'owned' : ''}"><span class="decor-icon">${item.icon}</span><div><b>${item.name}</b><small>${owned ? 'در خانه‌ی شماست' : item.detail}</small></div><button data-buy-decor="${item.id}">${owned ? '✓ مال ماست' : fa(item.price)}</button></div>`;
  }).join('');
  $('#decor-grid').querySelectorAll('[data-buy-decor]').forEach((button) => button.addEventListener('click', () => buyDecoration(button.dataset.buyDecor)));
  const furnitureControls = $('#furniture-controls');
  if (furnitureControls) {
    furnitureControls.innerHTML = `<h4>چیدمان مشترک خانه</h4><div class="furniture-control-row"><b>مبل</b><button data-furniture="sofa" data-dx="0" data-dz="-.45">↑</button><button data-furniture="sofa" data-dx="0" data-dz=".45">↓</button><button data-furniture="sofa" data-rotation=".25">↻</button></div><div class="furniture-control-row"><b>میز</b><button data-furniture="table" data-dx="-.45" data-dz="0">←</button><button data-furniture="table" data-dx=".45" data-dz="0">→</button><button data-furniture="table" data-drotation="-.25">↺</button></div><div class="furniture-control-row"><b>تخت</b><button data-furniture="bed" data-dx="0" data-dz="-.45">↑</button><button data-furniture="bed" data-dx="0" data-dz=".45">↓</button><button data-furniture="bed" data-rotation=".25">↻</button></div>`;
    furnitureControls.querySelectorAll('[data-furniture]').forEach((button) => button.addEventListener('click', () => moveFurniture(button.dataset.furniture, { x: Number(button.dataset.dx || 0), z: Number(button.dataset.dz || 0), rotation: Number(button.dataset.rotation || button.dataset.drotation || 0) })));
  }
}

function buyDecoration(id) {
  if (state.decorations[id]) { showToast('این گوشه همین حالا هم مال شماست.', false); return; }
  const item = DECOR_ITEMS.find((decor) => decor.id === id);
  if (!item || state.wallet < item.price) { showToast('فعلاً بهتر است کمی پس‌انداز کنیم.', false); return; }
  state.wallet -= item.price; state.decorations[id] = true; state.tasks.decorate = true;
  addDecorations(); renderDecorItems(); updateHUD(); if (runtime.network.online) syncSharedState(); saveGame(false); showToast(`${item.name} به خانه اضافه شد.`, true); playTone('success');
}

function openPhone(tab = 'home') {
  runtime.overlayOpen = true;
  $('#phone-panel').classList.remove('hidden');
  $$('.phone-tabs button').forEach((button) => button.classList.toggle('active', button.dataset.phoneTab === tab));
  updatePhoneContent(tab);
  playTone('open');
}

function updatePhoneContent(tab = 'home') {
  const content = $('#phone-content'); if (!content) return;
  if (tab === 'home') {
    content.innerHTML = `<div class="phone-hello"><div><span class="eyebrow">روز ${fa(state.day)} · ${getTimePhase(state.minutes).label}</span><h4>سلام، ${state.characters.abolfazl.name}</h4><p>امروز هم باهم جلو می‌رویم.</p></div><span class="heart-badge">♥</span></div><div class="phone-mini-stats"><div class="phone-mini-stat"><b>${fa(Math.round(state.stats.relationship))}٪</b><span>نزدیکی</span></div><div class="phone-mini-stat"><b>${fa(Math.round(state.stats.comfort))}٪</b><span>راحتی خانه</span></div><div class="phone-mini-stat"><b>${fa(state.memories.length)}</b><span>خاطره</span></div></div><div class="phone-section-title"><b>یک یادآوری کوچک</b><span>امروز</span></div><div class="task-row ${state.tasks.greet ? 'done' : ''}"><span class="task-check">${state.tasks.greet ? '✓' : '○'}</span><div><b>به راضیه یک سلام گرم بده</b><small>گاهی همین کافی است.</small></div></div><div class="phone-section-title"><b>خانه و وسایل</b><span>${fa(Object.values(state.decorations).filter(Boolean).length)} چیز شخصی</span></div><div class="phone-list-row"><span class="list-icon">▱</span><div><b>کیف پول مشترک</b><small>${fa(state.wallet)} تومان</small></div><button data-phone-action="decor">خرید خانه</button></div><div class="phone-list-row"><span class="list-icon">♨</span><div><b>آشپزخانه</b><small>${fa(state.inventory.tea)} چای · ${fa(state.inventory.preparedFood)} غذای آماده</small></div><button data-phone-action="cook">آشپزی</button></div>`;
  } else if (tab === 'plan') {
    const tasks = [
      ['گفت‌وگو و محبت', state.tasks.greet, 'با یک بغل یا چند کلمه شروع کنید.'],
      ['غذای دونفره', state.tasks.cook, 'آشپزخانه نزدیک پنجره است.'],
      ['هوای تازه', state.tasks.outside, 'از در خانه بیرون بروید.'],
      ['قرار کوچک', state.tasks.date, 'پارک، کافه یا یک دور شبانه.'],
      ['گوشه‌ی خودمان', state.tasks.decorate, 'یک وسیله‌ی تازه برای خانه.'],
    ];
    content.innerHTML = `<div class="phone-hello"><div><span class="eyebrow">آرام و بدون عجله</span><h4>برنامه‌ی امروز</h4><p>قرار نیست همه‌چیز کامل باشد.</p></div><span class="sun-icon">☼</span></div>${tasks.map(([name, done, detail]) => `<div class="task-row ${done ? 'done' : ''}"><span class="task-check">${done ? '✓' : '○'}</span><div><b>${name}</b><small>${detail}</small></div></div>`).join('')}`;
  } else if (tab === 'map') {
    content.innerHTML = `<div class="phone-hello"><div><span class="eyebrow">چند قدم آن‌طرف‌تر</span><h4>محله‌ی ما</h4><p>راه‌ها کوتاه‌اند؛ خاطره‌ها نه.</p></div></div><div class="map-card"><div class="map-road"></div><div class="map-road two"></div><div class="map-location home"><span>⌂</span>خانه</div><div class="map-location cafe"><span>☕</span>کافه</div><div class="map-location park"><span>☼</span>پارک</div><div class="map-location car"><span>▱</span>ماشین</div></div><div class="phone-list-row" style="margin-top:10px"><span class="list-icon">↗</span><div><b>برای رفتن، از در بیرون بروید</b><small>ماشین کنار خیابان منتظر است.</small></div></div>`;
  } else if (tab === 'memories') {
    content.innerHTML = `<div class="memory-thumb"><img src="assets/couple.png" alt="آلبوم شما" /><div class="memory-overlay"><div><b>یک قاب برای هر روز</b><small>ابوالفضل و راضیه</small></div><span class="heart-badge">♥</span></div></div><div class="memory-section-heading"><span class="eyebrow">قاب‌های شخصی شما</span><b>خاطرات تصویری</b></div>${memoryPhotoMarkup()}${state.memories.map((memory) => `<div class="memory-item"><span>${memory.icon || '✦'}</span><div><b>${memory.title}</b><small>${memory.detail}</small></div></div>`).join('')}`;
  }
  content.querySelectorAll('[data-phone-action="decor"]').forEach((button) => button.addEventListener('click', () => { closePanels(); openDecorPanel(); }));
  content.querySelectorAll('[data-phone-action="cook"]').forEach((button) => button.addEventListener('click', () => { closePanels(); openCooking(); }));
}

function memoryPhotoMarkup() {
  return `<div class="memory-photo-grid">${MEMORY_PHOTOS.map((photo) => `<figure class="memory-photo-card"><img src="${photo.src}" alt="${photo.title}" loading="lazy" /><figcaption><b>${photo.title}</b><small>${photo.detail}</small></figcaption></figure>`).join('')}</div>`;
}

function openMemoryModal() {
  runtime.overlayOpen = true;
  $('#memory-modal').classList.remove('hidden');
  $('#memory-content').innerHTML = `<div class="memory-thumb"><img src="assets/couple.png" alt="تصویر خاطره" /><div class="memory-overlay"><div><b>خانه‌ی ما</b><small>هر روز یک قاب تازه</small></div><span class="heart-badge">♥</span></div></div><div class="memory-section-heading"><span class="eyebrow">قاب‌های شخصی شما</span><b>خاطرات تصویری</b></div>${memoryPhotoMarkup()}${state.memories.map((memory) => `<div class="memory-item"><span>${memory.icon || '✦'}</span><div><b>${memory.title}</b><small>${memory.detail}</small></div></div>`).join('')}`;
}

const QUICK_PHRASES = ['بیا بریم', 'صبر کن', 'بیا اینو ببین', 'چایی می‌خوری؟', 'گرسنه‌ای؟', 'بریم بیرون؟', 'دوستت دارم', 'دلم برات تنگ شده', 'بیا بغلم', 'خسته‌ای؟', 'امشب فیلم ببینیم؟'];

function openQuickChat() {
  runtime.overlayOpen = true;
  $('#chat-panel').classList.remove('hidden');
  $('#quick-chat-list').innerHTML = QUICK_PHRASES.map((phrase) => `<button class="quick-chat-btn" data-phrase="${phrase}">${phrase}</button>`).join('');
  $('#quick-chat-list').querySelectorAll('[data-phrase]').forEach((button) => button.addEventListener('click', () => {
    const phrase = button.dataset.phrase;
    if (runtime.network.online) sendNetwork({ type: 'chat', text: phrase });
    else addChatMessage(phrase, false, runtime.localRole);
    playTone('chat');
  }));
  renderChatLog();
}

function addChatMessage(text, remote = false, role = runtime.localRole) {
  runtime.chatLog.push({ text, remote, role, at: Date.now() });
  runtime.chatLog = runtime.chatLog.slice(-12);
  renderChatLog();
  if (remote) showToast(`${role === 'razieh' ? 'راضیه' : 'ابوالفضل'}: ${text}`, true);
}

function renderChatLog() {
  const log = $('#chat-log');
  if (!log) return;
  log.innerHTML = runtime.chatLog.map((item) => `<div class="chat-bubble ${item.remote ? 'remote' : ''}">${item.text}<small>${item.remote ? (item.role === 'razieh' ? 'راضیه' : 'ابوالفضل') : 'شما'}</small></div>`).join('');
  log.scrollTop = log.scrollHeight;
}

/* ---------- panels and audio ---------- */
function closePanels() {
  ['action-sheet', 'phone-panel', 'chat-panel', 'custom-modal', 'dialogue-modal', 'cooking-panel', 'decor-panel', 'memory-modal', 'date-panel', 'pause-panel'].forEach((id) => { const node = $(`#${id}`); if (node) node.classList.add('hidden'); });
  runtime.overlayOpen = false;
  runtime.cooking = null;
}

function openPause() {
  if (!isGameVisible()) return;
  if (runtime.overlayOpen) { closePanels(); return; }
  runtime.paused = true; $('#pause-panel').classList.remove('hidden');
  if (document.pointerLockElement) document.exitPointerLock();
}
function closePause() { runtime.paused = false; $('#pause-panel').classList.add('hidden'); }

let audioContext = null;
function playTone(kind = 'click') {
  if (!runtime.soundEnabled || document.hidden) return;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const frequencies = { click: [320, .045], near: [210, .06], open: [240, .07], dialogue: [260, .09], success: [440, .12], save: [520, .09], chat: [580, .08], hug: [180, .16], kiss: [660, .12], highfive: [430, .08], car: [100, .22], door: [240, .08] };
    const [frequency, duration] = frequencies[kind] || frequencies.click;
    const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
    osc.type = kind === 'success' ? 'sine' : 'triangle'; osc.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.028, audioContext.currentTime + .008); gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
    osc.connect(gain).connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + duration + .02);
  } catch (_) { /* audio is a graceful enhancement */ }
}

function playSfx(kind = 'click', pan = 0) {
  if (!runtime.soundEnabled || document.hidden) return;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const profiles = {
      footstep: { frequency: 92, duration: .055, gain: .018, type: 'triangle' },
      door: { frequency: 220, duration: .14, gain: .028, type: 'sine' },
      fridge: { frequency: 130, duration: .18, gain: .023, type: 'sine' },
      stove: { frequency: 180, duration: .24, gain: .018, type: 'triangle' },
      car: { frequency: 78, duration: .28, gain: .035, type: 'sawtooth' },
      rain: { frequency: 310, duration: .34, gain: .008, type: 'sine' },
    };
    const profile = profiles[kind] || profiles.footstep;
    const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
    const output = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
    osc.type = profile.type; osc.frequency.setValueAtTime(profile.frequency, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(profile.frequency * (kind === 'car' ? 1.25 : .72), audioContext.currentTime + profile.duration);
    gain.gain.setValueAtTime(.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(profile.gain, audioContext.currentTime + .006); gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + profile.duration);
    if (output) { output.pan.value = clamp(pan, -1, 1); osc.connect(gain).connect(output).connect(audioContext.destination); } else osc.connect(gain).connect(audioContext.destination);
    osc.start(); osc.stop(audioContext.currentTime + profile.duration + .02);
  } catch (_) { /* audio enhancement is intentionally optional */ }
}

function showToast(message, accent = false) {
  const toast = document.createElement('div'); toast.className = `toast ${accent ? 'accent' : ''}`; toast.textContent = message;
  $('#toast-stack').appendChild(toast); setTimeout(() => toast.remove(), 3700);
}

/* ---------- event wiring ---------- */
function bindEvents() {
  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) handleAction(actionButton.dataset.action);
  });
  $$('#customize-screen .character-tabs > .char-tab').forEach((button) => button.addEventListener('click', () => selectCustomizationCharacter(button.dataset.character)));
  $$('.compact-tabs .char-tab').forEach((button) => button.addEventListener('click', () => selectCustomizationCharacter(button.dataset.modalCharacter, true)));
  $$('.mp-mode-tabs button').forEach((button) => button.addEventListener('click', () => setMultiplayerMode(button.dataset.mpMode)));
  $$('.mp-role').forEach((button) => button.addEventListener('click', () => setSelectedRole(button.dataset.role)));
  $('#room-code-input')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') joinCoupleRoom(); });
  $$('.phone-tabs button').forEach((button) => button.addEventListener('click', () => { $$('.phone-tabs button').forEach((tab) => tab.classList.remove('active')); button.classList.add('active'); updatePhoneContent(button.dataset.phoneTab); }));
  $$('.touch-actions button').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.touch === 'interact') openActionSheet();
    if (button.dataset.touch === 'affection') quickAffection();
    if (button.dataset.touch === 'phone') openPhone('home');
  }));
  document.addEventListener('keydown', (event) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (event.code === 'Tab') { event.preventDefault(); if (isGameVisible() && !runtime.paused) openPhone('home'); return; }
    if (event.code === 'Escape') {
      if (runtime.overlayOpen) closePanels(); else if (isGameVisible()) openPause();
      return;
    }
    runtime.keys[event.code] = true;
    if (!isGameVisible()) return;
    if (event.code === 'KeyE') { event.preventDefault(); if (runtime.carMode) exitCar(); else openActionSheet(); }
    if (event.code === 'KeyF') { event.preventDefault(); quickAffection(); }
  });
  document.addEventListener('keyup', (event) => { runtime.keys[event.code] = false; });
  $('#game-canvas').addEventListener('click', () => {
    if (isGameVisible() && !isMobile() && !runtime.overlayOpen && !runtime.paused && document.pointerLockElement !== $('#game-canvas')) {
      $('#game-canvas').requestPointerLock?.();
      if (!runtime.introShown) showToast('کلیک کردید؛ حالا راه بروید.', true);
    }
  });
  document.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement !== $('#game-canvas') || runtime.carMode || runtime.paused || runtime.overlayOpen) return;
    runtime.yaw -= event.movementX * .0022;
    runtime.pitch = clamp(runtime.pitch - event.movementY * .0018, -1.28, 1.1);
  });
  $('#game-canvas').addEventListener('pointerdown', (event) => {
    if (!isMobile() || !isGameVisible() || runtime.overlayOpen || runtime.paused) return;
    runtime.touchLooking = true; runtime.lastTouchLook = { x: event.clientX, y: event.clientY }; $('#game-canvas').setPointerCapture?.(event.pointerId);
  });
  $('#game-canvas').addEventListener('pointermove', (event) => {
    if (!runtime.touchLooking || !runtime.lastTouchLook || !isMobile()) return;
    const dx = event.clientX - runtime.lastTouchLook.x; const dy = event.clientY - runtime.lastTouchLook.y;
    runtime.yaw -= dx * .006; runtime.pitch = clamp(runtime.pitch - dy * .004, -1.28, 1.1); runtime.lastTouchLook = { x: event.clientX, y: event.clientY };
  });
  ['pointerup', 'pointercancel'].forEach((name) => $('#game-canvas').addEventListener(name, () => { runtime.touchLooking = false; runtime.lastTouchLook = null; }));
  bindJoystick();
  window.addEventListener('resize', () => { resizeGame(); resizePreviewRenderer(); resizeModalRenderer(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && isGameVisible()) saveGame(false); });
}

function bindJoystick() {
  const joystick = $('#joystick'); const knob = $('#joystick-knob'); if (!joystick) return;
  let active = false;
  const update = (event) => {
    const rect = joystick.getBoundingClientRect(); const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2;
    const max = rect.width * .31; const dx = event.clientX - centerX; const dy = event.clientY - centerY; const length = Math.hypot(dx, dy); const scale = Math.min(1, max / Math.max(length, 1));
    const x = dx * scale; const y = dy * scale; knob.style.transform = `translate(${x}px, ${y}px)`; runtime.touchMove.x = x / max; runtime.touchMove.y = y / max;
  };
  joystick.addEventListener('pointerdown', (event) => { active = true; joystick.setPointerCapture?.(event.pointerId); update(event); });
  joystick.addEventListener('pointermove', (event) => { if (active) update(event); });
  const reset = () => { active = false; runtime.touchMove.x = 0; runtime.touchMove.y = 0; knob.style.transform = 'translate(0,0)'; };
  joystick.addEventListener('pointerup', reset); joystick.addEventListener('pointercancel', reset); joystick.addEventListener('pointerleave', () => { if (active) reset(); });
}

function resizeGame() {
  if (!runtime.renderer || !runtime.camera) return;
  runtime.renderer.setSize(window.innerWidth, window.innerHeight, false);
  runtime.camera.aspect = window.innerWidth / window.innerHeight; runtime.camera.updateProjectionMatrix();
}

function start() {
  updateContinueButton();
  bindEvents();
  // WebGL stays lazy until the player actually enters the home, keeping the title fast.
}

start();
