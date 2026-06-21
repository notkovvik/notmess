
console.log('NotMess загружается...');
const API_URL = window.location.origin;
function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
}
function getCookie(name) {
    return document.cookie.split('; ').reduce((r, c) => {
        const [k, v] = c.split('=');
        return k === name ? decodeURIComponent(v) : r;
    }, '');
}
function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
}
const AVATAR_COLORS = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
    ['#fccb90', '#d57eeb'],
    ['#e0c3fc', '#8ec5fc'],
    ['#f5576c', '#ff6f00'],
    ['#00b4db', '#0083b0']
];
const BADGE_CONFIG = {
    creator: {
        label: 'Creator',
        color: '#f5a623',
        icon: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="1" y="1" width="14" height="14" rx="4" fill="currentColor"/><path d="M8 4.5l1.2 2.5 2.8.4-2 2 .5 2.7L8 11l-2.5 1.3.5-2.7-2-2 2.8-.4L8 4.5z" fill="#fff"/></svg>`,
    },
    team: {
        label: 'Team',
        color: '#4caf50',
        icon: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="1" y="1" width="14" height="14" rx="4" fill="currentColor"/><circle cx="8" cy="5.5" r="2" fill="#fff"/><path d="M4 13c0-2.2 1.8-4 4-4s4 1.8 4 4H4z" fill="#fff"/></svg>`,
    },
    supporter: {
        label: 'Supporter',
        color: '#0088cc',
        icon: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="1" y="1" width="14" height="14" rx="4" fill="currentColor"/><path d="M8 12.5s-4-2.5-4-5C4 5.5 6 4.5 8 6c2-1.5 4-.5 4 1.5 0 2.5-4 5-4 5z" fill="#fff"/></svg>`,
    },
    verified: {
        label: 'Verified',
        color: '#1da1f2',
        icon: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="1" y="1" width="14" height="14" rx="4" fill="currentColor"/><path d="M4.5 8.5L7 11l4.5-4.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
};
function renderBadge(type) {
    if (!type || !BADGE_CONFIG[type]) return '';
    const cfg = BADGE_CONFIG[type];
    return `<span class="badge-icon badge-${type}" title="${cfg.label}" style="color:${cfg.color}">${cfg.icon}</span>`;
}
function getAvatarColors(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function avatarSVG(letters, size = 50, colors = null) {
    if (!colors) colors = ['#667eea', '#764ba2'];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
        <defs><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[0]}"/>
            <stop offset="100%" style="stop-color:${colors[1]}"/>
        </linearGradient></defs>
        <rect width="100" height="100" rx="50" fill="url(#a)"/>
        <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
              fill="white" font-size="${size > 60 ? 38 : 28}" font-weight="600" font-family="sans-serif">${letters}</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
function getInitials(firstname, lastname) {
    if (lastname) return (firstname[0] + lastname[0]).toUpperCase();
    return (firstname[0] + (firstname[1] || '')).toUpperCase();
}
const FLAG_RU = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect y=".67" width="3" height=".67" fill="#0039a6"/><rect y="1.33" width="3" height=".67" fill="#d52b1e"/></svg>';
const FLAG_UA = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 3 2"><rect width="3" height="2" fill="#0057b8"/><rect y="1" width="3" height="1" fill="#ffdd00"/></svg>';
const FLAG_EN = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 12 7"><rect width="12" height="7" fill="#b22234"/><rect y="1" width="12" height="1" fill="#fff"/><rect y="3" width="12" height="1" fill="#fff"/><rect y="5" width="12" height="1" fill="#fff"/><rect width="5" height="4" fill="#3c3b6e"/><circle cx=".6" cy=".6" r=".25" fill="#fff"/><circle cx="1.6" cy=".6" r=".25" fill="#fff"/><circle cx="2.6" cy=".6" r=".25" fill="#fff"/><circle cx="3.6" cy=".6" r=".25" fill="#fff"/><circle cx="4.4" cy=".6" r=".25" fill="#fff"/><circle cx="1.1" cy="1.4" r=".25" fill="#fff"/><circle cx="2.1" cy="1.4" r=".25" fill="#fff"/><circle cx="3.1" cy="1.4" r=".25" fill="#fff"/><circle cx="4.1" cy="1.4" r=".25" fill="#fff"/><circle cx=".6" cy="2.2" r=".25" fill="#fff"/><circle cx="1.6" cy="2.2" r=".25" fill="#fff"/><circle cx="2.6" cy="2.2" r=".25" fill="#fff"/><circle cx="3.6" cy="2.2" r=".25" fill="#fff"/><circle cx="4.4" cy="2.2" r=".25" fill="#fff"/><circle cx="1.1" cy="3" r=".25" fill="#fff"/><circle cx="2.1" cy="3" r=".25" fill="#fff"/><circle cx="3.1" cy="3" r=".25" fill="#fff"/><circle cx="4.1" cy="3" r=".25" fill="#fff"/></svg>';
function flagIcon(lang) {
    if (lang === 'ru') return FLAG_RU;
    if (lang === 'ua') return FLAG_UA;
    return FLAG_EN;
}
const chatKeys = new Map();
function b64url(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function unb64url(str) {
    return Uint8Array.from(
        atob(str.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
    );
}
async function generateUserKeys() {
    if (!window.crypto.subtle) {
        return { privateKey: null, publicKey: null, publicKeyB64: '' };
    }
    const stored = getCookie('e2e_privkey');
    if (stored) {
        const raw = unb64url(stored);
        const privateKey = await crypto.subtle.importKey('pkcs8', raw, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey']);
        const pubRaw = unb64url(getCookie('e2e_pubkey'));
        const publicKey = await crypto.subtle.importKey('raw', pubRaw, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
        return { privateKey, publicKey, publicKeyB64: getCookie('e2e_pubkey') };
    }
    const kp = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']);
    const privRaw = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
    const pubRaw = await crypto.subtle.exportKey('raw', kp.publicKey);
    const privB64 = b64url(privRaw);
    const pubB64 = b64url(pubRaw);
    setCookie('e2e_privkey', privB64);
    setCookie('e2e_pubkey', pubB64);
    return { privateKey: kp.privateKey, publicKey: kp.publicKey, publicKeyB64: pubB64 };
}
async function deriveChatKey(chatId, otherPublicKeyB64, ownPrivateKey) {
    const pubRaw = unb64url(otherPublicKeyB64);
    const otherPub = await crypto.subtle.importKey('raw', pubRaw, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
    const aesKey = await crypto.subtle.deriveKey(
        { name: 'ECDH', public: otherPub },
        ownPrivateKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    chatKeys.set(chatId, aesKey);
    return aesKey;
}
function getChatKey(chatId) {
    return chatKeys.get(chatId) || null;
}
async function e2eEncrypt(chatId, plaintext) {
    const aesKey = getChatKey(chatId);
    if (!aesKey) return { encrypted: plaintext, ivB64: '' };
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded);
    return { encrypted: b64url(ciphertext), ivB64: b64url(iv) };
}
async function e2eDecrypt(chatId, encrypted, ivB64) {
    if (!ivB64) return encrypted;
    const aesKey = getChatKey(chatId);
    if (!aesKey) return encrypted;
    try {
        const ciphertext = unb64url(encrypted);
        const iv = unb64url(ivB64);
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);
        return new TextDecoder().decode(decrypted);
    } catch (e) {
        return '🔒 Не удалось расшифровать';
    }
}
const translations = {
    ru: {
        'auth-subtitle': 'Введите ваш Telegram username',
        'auth-btn': 'Далее',
        'code-info': 'Мы отправили код в Telegram',
        'code-btn': 'Подтвердить',
        'profile-choice-title': 'Настройка профиля',
        'profile-choice-subtitle': 'Импортировать данные из Telegram?',
        'import-tg-btn': 'Продолжить с этим профилем',
        'manual-setup-link': 'Настроить профиль самому',
        'setup-title': 'Настройка профиля',
        'setup-subtitle': 'Расскажите о себе',
        'firstname': 'Имя',
        'lastname': 'Фамилия (необязательно)',
        'display-username': '@username для поиска',
        'setup-btn': 'Начать общение',
        'search': 'Поиск',
        'folder-chats': 'Чаты',
        'folder-users': 'Пользователи',
        'folder-favorites': 'Избранное',
        'select-chat': 'Выберите чат',
        'start-messaging': 'Чтобы начать общение',
        'invalid-phone': 'Неверный формат username',
        'invalid-code': 'Неверный код',
        'fill-all-fields': 'Заполните все поля',
        'user-not-found': 'Пользователь не найден в Telegram',
        'code-sent': 'Код отправлен в Telegram!',
        'message-placeholder': 'Написать сообщение...',
        'attach': 'Прикрепить',
        'send': 'Отправить'
    },
    ua: {
        'auth-subtitle': 'Введіть ваш Telegram username',
        'auth-btn': 'Далі',
        'code-info': 'Ми відправили код у Telegram',
        'code-btn': 'Підтвердити',
        'profile-choice-title': 'Налаштування профілю',
        'profile-choice-subtitle': 'Імпортувати дані з Telegram?',
        'import-tg-btn': 'Продовжити з цим профілем',
        'manual-setup-link': 'Налаштувати профіль самостійно',
        'setup-title': 'Налаштування профілю',
        'setup-subtitle': 'Розкажіть про себе',
        'firstname': "Ім'я",
        'lastname': 'Прізвище (необов\'язково)',
        'display-username': '@username для пошуку',
        'setup-btn': 'Почати спілкування',
        'search': 'Пошук',
        'folder-chats': 'Чати',
        'folder-users': 'Користувачі',
        'folder-favorites': 'Обране',
        'select-chat': 'Виберіть чат',
        'start-messaging': 'Щоб почати спілкування',
        'invalid-phone': 'Невірний формат username',
        'invalid-code': 'Невірний код',
        'fill-all-fields': 'Заповніть всі поля',
        'user-not-found': 'Користувача не знайдено в Telegram',
        'code-sent': 'Код відправлено в Telegram!',
        'message-placeholder': 'Написати повідомлення...',
        'attach': 'Прикріпити',
        'send': 'Відправити'
    },
    en: {
        'auth-subtitle': 'Enter your Telegram username',
        'auth-btn': 'Next',
        'code-info': 'We sent a code to Telegram',
        'code-btn': 'Confirm',
        'profile-choice-title': 'Profile Setup',
        'profile-choice-subtitle': 'Import data from Telegram?',
        'import-tg-btn': 'Continue with this profile',
        'manual-setup-link': 'Setup profile manually',
        'setup-title': 'Profile Setup',
        'setup-subtitle': 'Tell us about yourself',
        'firstname': 'First Name',
        'lastname': 'Last Name (optional)',
        'display-username': '@username for search',
        'setup-btn': 'Start Messaging',
        'search': 'Search',
        'folder-chats': 'Chats',
        'folder-users': 'Users',
        'folder-favorites': 'Favorites',
        'select-chat': 'Select a chat',
        'start-messaging': 'to start messaging'
    }
};
let currentLang = getCookie('lang') || 'ru';
let tempUsername = '';
let tempChatId = null;
let currentChatId = null;
let currentFolder = 'chats';
function showDialog(title, text, buttons, withInput) {
    const modal = document.getElementById('dialog-modal');
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-text').textContent = text;
    const inputArea = document.getElementById('dialog-input-area');
    const input = document.getElementById('dialog-input');
    if (withInput) {
        inputArea.classList.remove('hidden');
        input.value = '';
        input.placeholder = withInput;
    } else {
        inputArea.classList.add('hidden');
    }
    const btnsDiv = document.getElementById('dialog-buttons');
    btnsDiv.innerHTML = '';
    buttons.forEach((b, i) => {
        const btn = document.createElement('button');
        btn.textContent = b.text;
        btn.className = b.primary ? 'auth-button' : 'lang-btn';
        if (b.primary) { btn.style.flex = '1'; btn.style.maxWidth = '160px'; }
        if (b.danger) { btn.style.background = '#f85149'; btn.style.borderColor = '#f85149'; btn.style.color = '#fff'; }
        btn.onclick = () => { modal.classList.add('hidden'); if (b.action) b.action(input.value); };
        btnsDiv.appendChild(btn);
    });
    modal.classList.remove('hidden');
    if (withInput) setTimeout(() => input.focus(), 100);
}
function showConfirm(title, text) {
    return new Promise(resolve => {
        showDialog(title, text, [
            { text: 'Отмена', action: () => resolve(false) },
            { text: 'OK', primary: true, action: () => resolve(true) }
        ]);
    });
}
function showLoading() { document.getElementById('loading-overlay')?.remove(); const el = document.createElement('div'); el.id = 'loading-overlay'; el.className = 'loading-overlay'; el.innerHTML = '<div class="loading-spinner"></div>'; document.body.appendChild(el); }
function hideLoading() { document.getElementById('loading-overlay')?.remove(); }
function showPrompt(title, text, placeholder) {
    return new Promise(resolve => {
        showDialog(title, text, [
            { text: 'Отмена', action: () => resolve(null) },
            { text: 'OK', primary: true, action: (v) => resolve(v) }
        ], placeholder);
    });
}
function showAlert(title, text) {
    showDialog(title, text, [
        { text: 'OK', primary: true, action: () => {} }
    ]);
}
function showMessage(text) { showAlert('', text); }
function showBadgeToast(user, badgeType) {
    document.querySelector('.badge-toast')?.remove();
    const cfg = BADGE_CONFIG[badgeType];
    if (!cfg) return;
    const labels = {
        creator: 'Создатель проекта NotMess',
        team: 'Участник команды разработки',
        supporter: 'Поддерживает проект',
        verified: 'Верифицированный аккаунт'
    };
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.innerHTML = `
        <div class="badge-toast-icon" style="color:${cfg.color}">${cfg.icon}</div>
        <div class="badge-toast-body">
            <div class="badge-toast-title">${cfg.label}</div>
            <div class="badge-toast-desc">${labels[badgeType] || ''}</div>
            ${badgeType === 'supporter' ? '<button class="badge-toast-btn">Поддержать проект</button>' : ''}
        </div>
        <button class="badge-toast-close">&times;</button>
    `;
    document.body.appendChild(toast);
    toast.querySelector('.badge-toast-btn')?.addEventListener('click', () => {
        window.open('https://www.donationalerts.com/r/notkovvik', '_blank');
        toast.remove();
    });
    toast.querySelector('.badge-toast-close').addEventListener('click', () => toast.remove());
    toast.addEventListener('click', (e) => { if (e.target === toast) toast.remove(); });
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
}
function changeLanguage(lang) {
    currentLang = lang;
    setCookie('lang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}
async function saveUser(userData) {
    const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
}
async function getUserByUsername(username) {
    const response = await fetch(`${API_URL}/api/users/${username}`);
    return response.json();
}
async function getCurrentUser() {
    const username = getCookie('currentUsername');
    if (!username) return null;
    return getUserByUsername(username);
}
async function getAllUsers() {
    const response = await fetch(`${API_URL}/api/users`);
    return response.json();
}
async function searchUsers(query) {
    const response = await fetch(`${API_URL}/api/users/search/${query}`);
    return response.json();
}
async function telegramApi(method, params = {}) {
    const response = await fetch(`${API_URL}/api/telegram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, params })
    });
    return response.json();
}
async function getChatIdByUsername(username) {
    try {
        const data = await telegramApi('getUpdates');
        if (data.ok && data.result.length > 0) {
            for (const update of data.result.reverse()) {
                if (update.message && update.message.from) {
                    const user = update.message.from;
                    if (user.username && user.username.toLowerCase() === username.toLowerCase().replace('@', '')) {
                        return user.id;
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения chat_id:', error);
        return null;
    }
}
async function sendCodeToTelegram(username, code, chatId) {
    const message = `🔐 Ваш код подтверждения для NotMess:\n\n<code>${code}</code>\n\n<i>Нажмите на код, чтобы скопировать</i>\n\nUsername: ${username}`;
    try {
        const data = await telegramApi('sendMessage', { chat_id: chatId, text: message, parse_mode: 'HTML' });
        return data.ok;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    console.log('NotMess инициализация...');
    const authScreen = document.getElementById('auth-screen');
    const profileChoiceScreen = document.getElementById('profile-choice-screen');
    const setupScreen = document.getElementById('setup-screen');
    const app = document.getElementById('app');
    const authBtn = document.getElementById('auth-btn');
    const phoneInput = document.getElementById('phone-input');
    const codeBtn = document.getElementById('code-btn');
    const codeInput = document.getElementById('code-input');
    const importTgBtn = document.getElementById('import-tg-btn');
    const manualSetupLink = document.getElementById('manual-setup-link');
    const setupBtn = document.getElementById('setup-btn');
    const firstnameInput = document.getElementById('firstname-input');
    const lastnameInput = document.getElementById('lastname-input');
    const displayUsernameInput = document.getElementById('display-username-input');
    const themeBtn = document.getElementById('theme-btn');
    const authThemeBtn = document.getElementById('auth-theme-btn');
    const tgAvatar = document.getElementById('tg-avatar');
    const tgAvatarText = document.getElementById('tg-avatar-text');
    const tgName = document.getElementById('tg-name');
    const tgUsername = document.getElementById('tg-username');
    changeLanguage(currentLang);
    document.querySelectorAll('.lang-switcher').forEach(sw => {
        sw.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                changeLanguage(btn.dataset.lang);
            });
        });
    });
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            document.querySelectorAll('.theme-btn .moon, .theme-btn .sun').forEach(el => el.classList.toggle('hidden'));
            setCookie('theme', newTheme);
        });
        const savedTheme = getCookie('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'light') {
            document.querySelectorAll('.theme-btn .moon').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.theme-btn .sun').forEach(el => el.classList.remove('hidden'));
        }
        if (!getCookie('theme')) {
            setCookie('theme', 'dark');
        }
    }
    if (authThemeBtn) {
        authThemeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            document.querySelectorAll('.theme-btn .moon, .theme-btn .sun').forEach(el => el.classList.toggle('hidden'));
            setCookie('theme', newTheme);
        });
        const savedTheme = getCookie('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'light') {
            document.querySelectorAll('.theme-btn .moon').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.theme-btn .sun').forEach(el => el.classList.remove('hidden'));
        }
        if (!getCookie('theme')) {
            setCookie('theme', 'dark');
        }
    }
    if (authBtn && phoneInput) {
        authBtn.addEventListener('click', async () => {
            console.log('Кнопка "Далее" нажата');
            let username = phoneInput.value.trim();
            if (!username) {
                showMessage(translations[currentLang]['invalid-phone']);
                return;
            }
            if (!username.startsWith('@')) {
                username = '@' + username;
            }
            tempUsername = username;
            authBtn.disabled = true;
            authBtn.textContent = '...';
            const chatId = await getChatIdByUsername(username);
            if (!chatId) {
                showMessage(translations[currentLang]['user-not-found'] + '\n\nНапишите боту @notmess_autobot любое сообщение и попробуйте снова.');
                authBtn.disabled = false;
                authBtn.textContent = translations[currentLang]['auth-btn'];
                return;
            }
            tempChatId = chatId;
            const generatedCode = Math.floor(10000 + Math.random() * 90000).toString();
            try {
                const response = await fetch(`${API_URL}/api/auth/code`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, code: generatedCode, chatId })
                });
                const result = await response.json();
                if (!result.success) throw new Error('Ошибка сохранения кода');
            } catch (error) {
                showMessage('Ошибка: ' + error.message);
                authBtn.disabled = false;
                authBtn.textContent = translations[currentLang]['auth-btn'];
                return;
            }
            setCookie('tempUsername', username);
            setCookie('tempChatId', chatId.toString());
            const sent = await sendCodeToTelegram(username, generatedCode, chatId);
            if (!sent) {
                showMessage('Ошибка отправки кода');
                authBtn.disabled = false;
                authBtn.textContent = translations[currentLang]['auth-btn'];
                return;
            }
            document.getElementById('phone-step').classList.add('hidden');
            document.getElementById('code-step').classList.remove('hidden');
            document.getElementById('phone-display').textContent = username;
            showMessage(translations[currentLang]['code-sent']);
            authBtn.disabled = false;
            authBtn.textContent = translations[currentLang]['auth-btn'];
        });
        phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authBtn.click();
        });
    }
    if (codeBtn && codeInput) {
        codeBtn.addEventListener('click', async () => {
            const code = codeInput.value.trim();
            const savedUsername = getCookie('tempUsername');
            if (!tempUsername && savedUsername) {
                tempUsername = savedUsername;
            }
            if (!tempUsername) {
                showMessage('Ошибка: username не найден');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/auth/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: tempUsername, code })
                });
                const result = await response.json();
                console.log('Verify response:', JSON.stringify(result));
                if (!result.valid) {
                    showMessage(result.expired ? 'Код истек' : translations[currentLang]['invalid-code']);
                    return;
                }
                if (result.chatId) {
                    setCookie('tempChatId', result.chatId);
                }
            } catch (error) {
                showMessage('Ошибка проверки кода: ' + error.message);
                return;
            }
            deleteCookie('tempUsername');
            const user = await getUserByUsername(tempUsername);
            if (user) {
                setCookie('currentUsername', tempUsername);
                authScreen.classList.add('hidden');
                app.classList.remove('hidden');
                const keys = await generateUserKeys();
                if (!user.publicKey) {
                    await fetch(`${API_URL}/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...user, publicKey: keys.publicKeyB64 })
                    });
                }
            } else {
                await generateUserKeys();
                await loadTelegramProfile();
                authScreen.classList.add('hidden');
                profileChoiceScreen.classList.remove('hidden');
            }
        });
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') codeBtn.click();
        });
    }
    async function loadTelegramProfile() {
        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
            const data = await response.json();
            if (data.ok && data.result.length > 0) {
                for (const update of data.result.reverse()) {
                    if (update.message && update.message.from) {
                        const user = update.message.from;
                        if (user.username && user.username.toLowerCase() === tempUsername.toLowerCase().replace('@', '')) {
                            const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
                            const initials = getInitials(user.first_name || '', user.last_name || '');
                            const colors = getAvatarColors('@' + user.username);
                            if (tgName) tgName.textContent = fullName || 'Пользователь';
                            if (tgUsername) tgUsername.textContent = '@' + user.username;
                            if (tgAvatar) tgAvatar.style.backgroundImage = `url('${avatarSVG(initials, 64, colors)}')`;
                            if (tgAvatarText) tgAvatarText.textContent = '';
                            window.telegramUserData = {
                                firstname: user.first_name || '',
                                lastname: user.last_name || '',
                                username: '@' + user.username,
                                userId: user.id
                            };
                            try {
                                const photoData = await telegramApi('getUserProfilePhotos', { user_id: user.id, limit: 1 });
                                if (photoData.ok && photoData.result.photos.length > 0) {
                                    const sizes = photoData.result.photos[0];
                                    const biggest = sizes[sizes.length - 1];
                                    const fileData = await telegramApi('getFile', { file_id: biggest.file_id });
                                    if (fileData.ok) {
                                        window.telegramUserData.photoUrl = `${API_URL}uploads/${fileData.result.file_id}`;
                                        if (tgAvatar) tgAvatar.style.backgroundImage = `url('${window.telegramUserData.photoUrl}')`;
                                    }
                                }
                            } catch (e) {
                                console.log('Не удалось загрузить фото профиля');
                            }
                            return;
                        }
                    }
                }
            }
            if (tgName) tgName.textContent = 'Не удалось загрузить';
            if (tgUsername) tgUsername.textContent = tempUsername;
            if (tgAvatarText) tgAvatarText.textContent = '?';
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
        }
    }
    if (importTgBtn) {
        importTgBtn.addEventListener('click', async () => {
            const userData = window.telegramUserData;
            if (!userData) {
                showMessage('Данные профиля не загружены');
                return;
            }
            try {
                const fullUserData = {
                    username: tempUsername,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    displayUsername: userData.username,
                    chatId: getCookie('tempChatId'),
                    publicKey: getCookie('e2e_pubkey'),
                    badge: tempUsername === '@notkovvik' ? 'creator' : undefined,
                    createdAt: new Date().toISOString()
                };
                await saveUser(fullUserData);
                if (userData.photoUrl) {
                    try {
                        await fetch(`${API_URL}/api/users/avatar`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: tempUsername, photoUrl: userData.photoUrl })
                        });
                    } catch (e) {
                        console.log('Не удалось сохранить фото');
                    }
                }
                setCookie('currentUsername', tempUsername);
                deleteCookie('tempChatId');
                profileChoiceScreen.classList.add('hidden');
                app.classList.remove('hidden');
                await createNewsChannel();
                showMessage('Профиль импортирован!');
            } catch (error) {
                showMessage('Ошибка импорта: ' + error.message);
            }
        });
    }
    if (manualSetupLink) {
        manualSetupLink.addEventListener('click', (e) => {
            e.preventDefault();
            profileChoiceScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
        });
    }
    if (setupBtn && firstnameInput && lastnameInput && displayUsernameInput) {
        setupBtn.addEventListener('click', async () => {
            const firstname = firstnameInput.value.trim();
            const lastname = lastnameInput.value.trim() || '';
            let displayUsername = displayUsernameInput.value.trim();
            if (!firstname || !displayUsername) {
                showMessage(translations[currentLang]['fill-all-fields']);
                return;
            }
            if (!displayUsername.startsWith('@')) {
                displayUsername = '@' + displayUsername;
            }
            const userData = {
                username: tempUsername,
                firstname,
                lastname,
                displayUsername,
                chatId: getCookie('tempChatId'),
                publicKey: getCookie('e2e_pubkey'),
                badge: tempUsername === '@notkovvik' ? 'creator' : undefined,
                createdAt: new Date().toISOString()
            };
            try {
                await saveUser(userData);
                setCookie('currentUsername', tempUsername);
                deleteCookie('tempChatId');
            setupScreen.classList.add('hidden');
            app.classList.remove('hidden');
            await createNewsChannel();
            showMessage('Профиль создан!');
        } catch (error) {
            showMessage('Ошибка: ' + error.message);
        }
        });
    }
    const currentUser = await getCurrentUser();
    if (currentUser) {
        app.classList.remove('hidden');
        await createNewsChannel();
        await loadChatsAndUsers();
        initFolderTabs();
        initSearch();
        if (window.heartbeatInterval) clearInterval(window.heartbeatInterval);
        window.heartbeatInterval = setInterval(async () => {
            const u = getCookie('currentUsername');
            if (u) {
                try { await fetch(`${API_URL}/api/users/heartbeat`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username: u}) }); } catch(e) {}
            }
        }, 30000);
        fetch(`${API_URL}/api/users/heartbeat`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username: currentUser.username}) }).catch(() => {});
    } else {
        authScreen.classList.remove('hidden');
    }
    console.log('Инициализация завершена');
});
console.log('NotMess загружен успешно!');
    async function createNewsChannel() {
        const newsChannelId = 'news_channel';
        const currentUsername = getCookie('currentUsername');
        if (!currentUsername) return;
        const response = await fetch(`${API_URL}/api/chats/info/${newsChannelId}`);
        const existingChannel = await response.json();
        if (!existingChannel) {
            await fetch(`${API_URL}/api/chats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: newsChannelId,
                    participant1: '@notkovvik',
                    participant2: currentUsername,
                    isChannel: true,
                    channelName: 'NotMess Новости',
                    createdAt: new Date().toISOString()
                })
            });
            await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: newsChannelId,
                    text: '👋 Добро пожаловать в NotMess! Здесь вы будете получать новости и обновления.',
                    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    sender: '@notkovvik',
                    timestamp: new Date().toISOString()
                })
            });
        }
    }
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', async () => {
            const menuModal = document.getElementById('menu-modal');
            const currentUser = await getCurrentUser();
            if (currentUser) {
                const menuAvatar = document.getElementById('menu-avatar');
                const menuName = document.getElementById('menu-name');
                const menuUsername = document.getElementById('menu-username');
                const starsCount = document.getElementById('stars-count');
                const displayName = currentUser.lastname ? 
                    `${currentUser.firstname} ${currentUser.lastname}` : 
                    currentUser.firstname;
                const initials = getInitials(currentUser.firstname, currentUser.lastname);
                const colors = getAvatarColors(currentUser.username);
                if (menuAvatar) {
                    const url = currentUser.avatarUrl || avatarSVG(initials, 56, colors);
                    menuAvatar.style.backgroundImage = `url('${url}')`;
                    menuAvatar.style.backgroundSize = 'cover';
                    menuAvatar.textContent = '';
                }
                if (menuName) { menuName.innerHTML = `${displayName} ${renderBadge(currentUser.badge)}`; menuName.dataset.username = currentUser.username; }
                if (menuUsername) menuUsername.textContent = currentUser.displayUsername;
                const stars = getCookie(`stars_${currentUser.username}`) || '0';
                if (starsCount) starsCount.textContent = stars;
            }
            menuModal.classList.remove('hidden');
        });
    }
    const menuClose = document.getElementById('menu-close');
    const menuModal = document.getElementById('menu-modal');
    if (menuClose) {
        menuClose.addEventListener('click', () => {
            menuModal.classList.add('hidden');
        });
    }
    if (menuModal) {
        menuModal.addEventListener('click', (e) => {
            if (e.target === menuModal) {
                menuModal.classList.add('hidden');
            }
        });
    }
    const menuProfile = document.getElementById('menu-profile');
    const menuSettings = document.getElementById('menu-settings');
    const menuDevices = document.getElementById('menu-devices');
    const menuPrivacy = document.getElementById('menu-privacy');
    const menuStars = document.getElementById('menu-stars');
    const menuGifts = document.getElementById('menu-gifts');
    const menuTheme = document.getElementById('menu-theme');
    const menuLogout = document.getElementById('menu-logout');
    if (menuProfile) {
        menuProfile.addEventListener('click', async () => {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                openProfileModal(currentUser);
                menuModal.classList.add('hidden');
            }
        });
    }
    if (menuSettings) {
        menuSettings.addEventListener('click', () => {
            menuModal.classList.add('hidden');
            const theme = document.documentElement.getAttribute('data-theme');
            document.getElementById('settings-theme-hint').textContent = theme === 'dark' ? 'Тёмная' : 'Светлая';
            const langMap = {ru:'Русский',ua:'Українська',en:'English'};
            document.getElementById('settings-lang-hint').textContent = langMap[currentLang] || 'Русский';
            document.getElementById('settings-modal').classList.remove('hidden');
        });
    }
    document.getElementById('settings-profile')?.addEventListener('click', async () => {
        document.getElementById('settings-modal').classList.add('hidden');
        const user = await getCurrentUser();
        if (user) openProfileModal(user);
    });
    document.getElementById('settings-theme')?.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        document.querySelectorAll('.theme-btn .moon, .theme-btn .sun').forEach(el => el.classList.toggle('hidden'));
        setCookie('theme', next);
        document.getElementById('settings-theme-hint').textContent = next === 'dark' ? 'Тёмная' : 'Светлая';
    });
    document.getElementById('settings-lang')?.addEventListener('click', () => {
        const langs = ['ru','ua','en'];
        const idx = langs.indexOf(currentLang);
        const next = langs[(idx + 1) % langs.length];
        changeLanguage(next);
        const langMap = {ru:'Русский',ua:'Українська',en:'English'};
        document.getElementById('settings-lang-hint').textContent = langMap[next];
    });
    document.getElementById('settings-donate')?.addEventListener('click', () => {
        window.open('https://www.donationalerts.com/r/notkovvik', '_blank');
    });
    if (menuDevices) {
        menuDevices.addEventListener('click', () => {
            menuModal.classList.add('hidden');
            const ua = navigator.userAgent;
            let device = 'Браузер';
            if (/android/i.test(ua)) device = 'Android';
            else if (/iphone|ipad|ipod/i.test(ua)) device = 'iOS';
            else if (/mac/i.test(ua)) device = 'macOS';
            else if (/win/i.test(ua)) device = 'Windows';
            document.getElementById('device-info').textContent = device + ' · Сейчас активно';
            document.getElementById('devices-modal').classList.remove('hidden');
        });
    }
    if (menuPrivacy) {
        menuPrivacy.addEventListener('click', () => {
            menuModal.classList.add('hidden');
            document.getElementById('privacy-modal').classList.remove('hidden');
        });
    }
    if (menuStars) {
        menuStars.addEventListener('click', async () => {
            const currentUser = await getCurrentUser();
            const currentUsername = currentUser?.username;
            if (currentUsername === '@notkovvik') {
                const targetUsername = await showPrompt('Выдать звезды', 'Введите username пользователя:', '@username');
                if (!targetUsername) return;
                const amount = await showPrompt('Количество', 'Количество звезд:', '10');
                if (!amount || isNaN(amount)) return;
                const currentStars = parseInt(getCookie(`stars_${targetUsername}`) || '0');
                setCookie(`stars_${targetUsername}`, (currentStars + parseInt(amount)).toString());
                showMessage(`Выдано ${amount} звезд пользователю ${targetUsername}`);
            } else {
                const stars = getCookie(`stars_${currentUsername}`) || '0';
                showMessage(`⭐ Ваши звезды: ${stars}\n\nЗвезды можно использовать для покупки подарков и премиум-функций.`);
            }
            menuModal.classList.add('hidden');
        });
    }
    if (menuGifts) {
        menuGifts.addEventListener('click', () => {
            menuModal.classList.add('hidden');
            openGiftShop();
        });
    }
    const menuAdmin = document.getElementById('menu-admin');
    if (menuAdmin) {
        if (getCookie('currentUsername') === '@notkovvik') {
            menuAdmin.classList.remove('hidden');
        }
        menuAdmin.addEventListener('click', () => {
            menuModal.classList.add('hidden');
            document.getElementById('admin-modal').classList.remove('hidden');
        });
    }
    document.getElementById('admin-stars')?.addEventListener('click', async () => {
        const target = await showPrompt('Выдать звезды', 'Username пользователя:', '@username');
        if (!target) return;
        const amount = await showPrompt('Количество', 'Количество звезд:', '10');
        if (!amount || isNaN(amount)) return;
        showLoading();
        await fetch(`${API_URL}/api/stars`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: target, amount: parseInt(amount)})
        });
        hideLoading();
        showMessage(`⭐ Выдано ${amount} звезд ${target}`);
        document.getElementById('admin-modal').classList.add('hidden');
    });
    document.body.addEventListener('click', (e) => {
        const badge = e.target.closest('.badge-icon');
        if (badge) {
            const type = badge.className.match(/badge-(\w+)/)?.[1];
            const el = badge.closest('[data-username]');
            const username = el?.dataset.username || 'User';
            if (type) showBadgeToast(username, type);
        }
    });
    document.getElementById('admin-badge')?.addEventListener('click', async () => {
        const target = await showPrompt('Выдать бейдж', 'Username пользователя:', '@username');
        if (!target) return;
        const type = await showPrompt('Тип бейджа', 'creator / team / supporter / verified:', 'supporter');
        if (!type || !['creator', 'team', 'supporter', 'verified'].includes(type)) {
            showMessage('Недопустимый тип. Используйте: creator, team, supporter, verified');
            return;
        }
        showLoading();
        await fetch(`${API_URL}/api/users/badge`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: target, badge: type})
        });
        hideLoading();
        showMessage(`🏅 Бейдж "${type}" выдан ${target}`);
        document.getElementById('admin-modal').classList.add('hidden');
    });
    document.getElementById('admin-stats')?.addEventListener('click', async () => {
        showLoading();
        const res = await fetch(`${API_URL}/api/messages/stats`);
        const stats = await res.json();
        hideLoading();
        showMessage(`📊 Статистика:\n\n👥 Пользователей: ${stats.users}\n💬 Чатов: ${stats.chats}\n✉️ Сообщений: ${stats.messages}`);
        document.getElementById('admin-modal').classList.add('hidden');
    });
    if (menuTheme) {
        menuTheme.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            document.querySelectorAll('.theme-btn .moon, .theme-btn .sun').forEach(el => el.classList.toggle('hidden'));
            setCookie('theme', newTheme);
            menuModal.classList.add('hidden');
        });
    }
    if (menuLogout) {
        menuLogout.addEventListener('click', async () => {
            const confirmed = await showConfirm('Выход', 'Вы уверены, что хотите выйти?');
            if (!confirmed) return;
            if (window.heartbeatInterval) clearInterval(window.heartbeatInterval);
            if (window.onlineInterval) clearInterval(window.onlineInterval);
            if (window.pollingInterval) clearInterval(window.pollingInterval);
            if (window.callPollInterval) clearInterval(window.callPollInterval);
            deleteCookie('currentUsername');
            location.reload();
        });
    }
    const menuDonate = document.getElementById('menu-donate');
    if (menuDonate) {
        menuDonate.addEventListener('click', () => {
            window.open('https://www.donationalerts.com/r/notkovvik', '_blank');
            menuModal.classList.add('hidden');
        });
    }
    const menuDelete = document.getElementById('menu-delete-account');
    if (menuDelete) {
        menuDelete.addEventListener('click', async () => {
            const user = await getCurrentUser();
            if (!user) return;
            const confirmed = await showConfirm('Удаление аккаунта', 'Это действие необратимо. Все ваши сообщения и данные будут удалены. Для подтверждения мы отправим код в Telegram.');
            if (!confirmed) return;
            try {
                const codeResp = await fetch(`${API_URL}/api/users/delete-code`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username: user.username, chatId: user.chatId})
                });
                const codeData = await codeResp.json();
                if (!codeData.success) {
                    showAlert('Ошибка', codeData.error || 'Не удалось отправить код');
                    return;
                }
                showDialog('Код отправлен', `Код удаления отправлен в Telegram (${user.username.replace('@','')}). Введите его ниже.`, [
                    {text: 'Отмена', action: () => {}},
                    {text: 'Удалить', primary: true, danger: true, action: async (code) => {
                        if (!code) return;
                        const res = await fetch(`${API_URL}/api/users/delete`, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({username: user.username, code})
                        });
                        const data = await res.json();
                        if (data.success) {
                            showAlert('Аккаунт удален', 'Ваш аккаунт и все данные удалены.');
                            deleteCookie('currentUsername');
                            setTimeout(() => location.reload(), 1500);
                        } else {
                            showAlert('Ошибка', data.error || 'Не удалось удалить аккаунт');
                        }
                    }}
                ], '5-значный код');
            } catch(e) {
                showAlert('Ошибка', 'Не удалось отправить код');
            }
        });
    }
    function openProfileModal(user) {
        const profileModal = document.getElementById('profile-modal');
        if (!profileModal) return;
        const displayName = user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname;
        const stars = getCookie(`stars_${user.username}`) || '0';
        const profileNameEl = document.getElementById('profile-name');
        if (profileNameEl) { profileNameEl.innerHTML = `${displayName}`; profileNameEl.dataset.username = user.username; }
        document.getElementById('profile-username').textContent = user.displayUsername || user.username;
        document.getElementById('profile-stars').textContent = stars;
        const avatarEl = document.getElementById('profile-avatar');
        const initials = getInitials(user.firstname, user.lastname);
        const colors = getAvatarColors(user.username);
        if (user.avatarUrl) {
            avatarEl.innerHTML = `<img src="${user.avatarUrl}" alt="">`;
        } else {
            avatarEl.style.backgroundImage = `url('${avatarSVG(initials, 96, colors)}')`;
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.textContent = '';
        }
        const badgeChip = document.getElementById('profile-badge-chip');
        if (badgeChip) {
            const badges = {creator:['👑','Создатель Notmess'],team:['👥','Участник команды'],supporter:['💛','Поддерживает проект'],verified:['✅','Верифицирован']};
            const cfg = badges[user.badge];
            if (cfg) {
                badgeChip.style.display = 'flex';
                badgeChip.querySelector('.badge-dot').textContent = cfg[0];
                badgeChip.querySelector('#badge-title').textContent = cfg[1];
            } else {
                badgeChip.style.display = 'none';
            }
        }
        const giftsGrid = document.getElementById('profile-gifts-grid');
        if (giftsGrid) {
            fetch(`${API_URL}/api/gifts/${user.username}`)
                .then(r => r.json())
                .then(gifts => {
                    giftsGrid.innerHTML = '';
                    if (gifts.length === 0) return;
                    const catalog = {cake:'🎂',balloon:'🎈',confetti:'🎉',diamond:'💎',crown:'👑'};
                    giftsGrid.innerHTML = gifts.map(g => {
                        const emoji = catalog[g.gift_id] || '🎁';
                        return `<span style="font-size:28px;" title="${g.gift_id}">${emoji}</span>`;
                    }).join('');
                });
        }
        profileModal.classList.remove('hidden');
        const closeBtn = profileModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => profileModal.classList.add('hidden');
        }
        profileModal.onclick = (e) => {
            if (e.target === profileModal) {
                profileModal.classList.add('hidden');
            }
        };
    }
    function openChannelProfile(chat) {
        const modal = document.getElementById('profile-modal');
        if (!modal) return;
        const nameEl = document.getElementById('profile-name');
        const usernameEl = document.getElementById('profile-username');
        const starsEl = document.getElementById('profile-stars');
        const avatarEl = document.getElementById('profile-avatar');
        const badgeChip = document.getElementById('profile-badge-chip');
        if (badgeChip) badgeChip.style.display = 'none';
        const name = chat.channelName || 'Канал';
        if (nameEl) nameEl.textContent = name;
        if (usernameEl) usernameEl.textContent = 'Канал';
        if (starsEl) starsEl.textContent = '';
        const words = name.split(' ');
        const initials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
        const colors = getAvatarColors(chat.id);
        if (avatarEl) {
            avatarEl.style.backgroundImage = `url('${avatarSVG(initials, 120, colors)}')`;
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.textContent = '';
        }
        const giftsGrid = document.getElementById('profile-gifts-grid');
        if (giftsGrid) giftsGrid.innerHTML = '';
        modal.classList.remove('hidden');
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
    }
async function loadChatsAndUsers() {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    if (currentFolder === 'chats') {
        const response = await fetch(`${API_URL}/api/chats/${currentUser.username}`);
        const chats = await response.json();
        const chatList = document.getElementById('chat-list');
        if (!chatList) return;
        if (chats.length === 0) {
            chatList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                Нет чатов
            </div>`;
            return;
        }
        const chatItems = await Promise.all(chats.map(async chat => {
            if (chat.isChannel) {
                const words = (chat.channelName || 'Канал').split(' ');
                const chInitials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : words[0].slice(0, 2).toUpperCase();
                const chColors = getAvatarColors(chat.id);
                return `
                    <div class="chat-item" data-chat-id="${chat.id}">
                        <div class="chat-item-avatar" style="background-image:url('${avatarSVG(chInitials, 50, chColors)}');background-size:cover;"></div>
                        <div class="chat-item-info">
                            <div class="chat-item-name">${chat.channelName || 'Канал'}</div>
                            <div class="chat-item-preview">${chat.lastMessage || 'Канал'}</div>
                        </div>
                        <div class="chat-item-meta">
                            <div class="chat-item-time">${chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}) : ''}</div>
                        </div>
                    </div>
                `;
            }
            const otherUsername = chat.participant1 === currentUser.username ? chat.participant2 : chat.participant1;
            const otherUser = await getUserByUsername(otherUsername);
            if (!otherUser) return '';
            const displayName = otherUser.lastname ? `${otherUser.firstname} ${otherUser.lastname}` : otherUser.firstname;
            const initials = getInitials(otherUser.firstname, otherUser.lastname);
            const colors = getAvatarColors(otherUser.username);
            const avatarStyle = otherUser.avatarUrl ? `background-image:url('${otherUser.avatarUrl}');background-size:cover;background-position:center;` : `background-image:url('${avatarSVG(initials, 50, colors)}');background-size:cover;background-position:center;`;
            const msgTime = chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}) : '';
            return `
                <div class="chat-item" data-chat-id="${chat.id}" data-username="${otherUser.username}">
                    <div class="chat-item-avatar" style="${avatarStyle}"></div>
                    <div class="chat-item-info">
                        <div class="chat-item-name">${displayName}${renderBadge(otherUser.badge)}</div>
                        <div class="chat-item-preview">${chat.lastMessage || 'Начните общение'}</div>
                    </div>
                    <div class="chat-item-meta">
                        <div class="chat-item-time">${msgTime}</div>
                    </div>
                </div>
            `;
        }));
        chatList.innerHTML = chatItems.join('');
        document.querySelectorAll('.chat-item[data-chat-id]').forEach(item => {
            item.addEventListener('click', async () => {
                const chatId = item.dataset.chatId;
                await openChat(chatId);
            });
        });
    } else if (currentFolder === 'favorites') {
        const response = await fetch(`${API_URL}/api/favorites/${currentUser.username}`);
        const favorites = await response.json();
        const chatList = document.getElementById('chat-list');
        if (!chatList) return;
        if (favorites.length === 0) {
            chatList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                <div style="font-size: 48px; margin-bottom: 16px;">⭐</div>
                <div style="font-size: 16px; margin-bottom: 8px;">Нет избранных сообщений</div>
                <div style="font-size: 14px; opacity: 0.7;">Удерживайте сообщение, чтобы добавить в избранное</div>
            </div>`;
            return;
        }
        chatList.innerHTML = favorites.map(fav => {
            let preview = fav.text || '';
            if (fav.fileUrl) {
                if (fav.fileType?.startsWith('image/')) {
                    preview = '🖼️ Фото';
                } else if (fav.fileType?.startsWith('video/')) {
                    preview = '🎥 Видео';
                } else {
                    preview = `📎 ${fav.fileName}`;
                }
            }
            return `
                <div class="chat-item favorite-item" data-favorite-id="${fav.id}">
                    <div class="chat-item-avatar" style="display:flex;align-items:center;justify-content:center;font-size:24px;background:var(--accent-dim);">⭐</div>
                    <div class="chat-item-info">
                        <div class="chat-item-name">Избранное</div>
                        <div class="chat-item-preview">${preview}</div>
                    </div>
                    <div class="chat-item-meta">
                        <div class="chat-item-time">${fav.time}</div>
                    </div>
                </div>
            `;
        }).join('');
        document.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', async () => {
                const favoriteId = item.dataset.favoriteId;
                await openFavorite(favoriteId);
            });
        });
    } else if (currentFolder === 'users') {
        const users = await getAllUsers();
        const chatList = document.getElementById('chat-list');
        if (!chatList) return;
        const filteredUsers = users.filter(user => user.username !== currentUser.username);
        if (filteredUsers.length === 0) {
            chatList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                Нет пользователей
            </div>`;
            return;
        }
        chatList.innerHTML = filteredUsers.map(user => {
            const displayName = user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname;
            const initials = getInitials(user.firstname, user.lastname);
            const colors = getAvatarColors(user.username);
            const avatarStyle = user.avatarUrl ? `background-image:url('${user.avatarUrl}');background-size:cover;` : `background-image:url('${avatarSVG(initials, 50, colors)}');background-size:cover;`;
            return `
                <div class="chat-item" data-user-username="${user.username}" data-username="${user.username}">
                    <div class="chat-item-avatar" style="${avatarStyle}"></div>
                    <div class="chat-item-info">
                        <div class="chat-item-name">${displayName}${renderBadge(user.badge)}</div>
                        <div class="chat-item-preview" style="color:var(--text3);font-size:12px;">${user.username}</div>
                    </div>
                </div>
            `;
        }).join('');
        document.querySelectorAll('.chat-item[data-user-username]').forEach(item => {
            item.addEventListener('click', async () => {
                const username = item.dataset.userUsername;
                await openOrCreateChat(username);
            });
        });
    }
}
async function openOrCreateChat(username) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const response = await fetch(`${API_URL}/api/chats/${currentUser.username}`);
    const chats = await response.json();
    const existingChat = chats.find(chat => 
        !chat.isChannel && 
        (chat.participant1 === username || chat.participant2 === username)
    );
    if (existingChat) {
        await openChat(existingChat.id);
    } else {
        const createResponse = await fetch(`${API_URL}/api/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                participant1: currentUser.username,
                participant2: username
            })
        });
        const newChat = await createResponse.json();
        if (newChat && newChat.id) {
            await openChat(newChat.id);
        }
    }
}
async function openChat(chatId) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const response = await fetch(`${API_URL}/api/chats/info/${chatId}`);
    const chat = await response.json();
    if (!chat) return;
    const e2eBanner = document.getElementById('e2e-banner');
    if (e2eBanner) {
        const hasKey = getChatKey(chatId) !== null;
        e2eBanner.className = 'e2e-banner';
        if (hasKey) {
            e2eBanner.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Сообщения защищены сквозным шифрованием`;
        } else if (chat.isChannel) {
            e2eBanner.classList.add('hidden');
        } else {
            e2eBanner.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Шифрование недоступно`;
        }
    }
    const emptyState = document.getElementById('empty-state');
    const chatContent = document.getElementById('chat-content');
    if (emptyState) emptyState.classList.add('hidden');
    if (chatContent) chatContent.classList.remove('hidden');
    const chatNameHeader = document.getElementById('chat-name-header');
    const chatStatus = document.getElementById('chat-status');
    const chatAvatar = document.getElementById('chat-avatar');
    if (chat.isChannel) {
        if (chatNameHeader) chatNameHeader.textContent = chat.channelName || 'Канал';
        if (chatStatus) chatStatus.textContent = 'Канал';
        const words = (chat.channelName || 'Канал').split(' ');
        const chInit = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : words[0].slice(0, 2).toUpperCase();
        const chCol = getAvatarColors(chat.id);
        if (chatAvatar) {
            chatAvatar.style.backgroundImage = `url('${avatarSVG(chInit, 40, chCol)}')`;
            chatAvatar.style.backgroundSize = 'cover';
            chatAvatar.textContent = '';
        }
    } else {
        const otherUsername = chat.participant1 === currentUser.username ? chat.participant2 : chat.participant1;
        const otherUser = await getUserByUsername(otherUsername);
        if (otherUser) {
            const displayName = otherUser.lastname ? `${otherUser.firstname} ${otherUser.lastname}` : otherUser.firstname;
            const initials = getInitials(otherUser.firstname, otherUser.lastname);
            const colors = getAvatarColors(otherUser.username);
            const avatarSrc = otherUser.avatarUrl || avatarSVG(initials, 40, colors);
            if (chatNameHeader) { chatNameHeader.innerHTML = `${displayName} ${renderBadge(otherUser.badge)}`; chatNameHeader.dataset.username = otherUser.username; }
            if (chatStatus) {
                try {
                    const onlineResp = await fetch(`${API_URL}/api/users/online/${otherUser.username}`);
                    const onlineData = await onlineResp.json();
                    if (onlineData.online) {
                        chatStatus.textContent = 'online';
                        chatStatus.style.color = 'var(--accent)';
                    } else if (onlineData.lastActive) {
                        const t = new Date(onlineData.lastActive + 'Z');
                        const now = new Date();
                        const diff = Math.floor((now - t) / 1000);
                        if (diff < 3600) chatStatus.textContent = `был(а) ${Math.floor(diff/60)}м назад`;
                        else if (diff < 86400) chatStatus.textContent = `был(а) ${Math.floor(diff/3600)}ч назад`;
                        else chatStatus.textContent = `был(а) ${t.toLocaleDateString()}`;
                        chatStatus.style.color = 'var(--text2)';
                    } else {
                        chatStatus.textContent = 'offline';
                        chatStatus.style.color = 'var(--text3)';
                    }
                } catch(e) {
                    chatStatus.textContent = 'online';
                    chatStatus.style.color = 'var(--accent)';
                }
            }
            if (chatAvatar) {
                chatAvatar.style.backgroundImage = `url('${avatarSrc}')`;
                chatAvatar.style.backgroundSize = 'cover';
                chatAvatar.textContent = '';
            }
            if (currentUser.username !== '@notkovvik' && otherUser.publicKey) {
                const keys = await generateUserKeys();
                if (keys.privateKey) {
                    await deriveChatKey(chatId, otherUser.publicKey, keys.privateKey);
                }
            }
        }
    }
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;
    const messagesResponse = await fetch(`${API_URL}/api/messages/${chatId}`);
    const messages = await messagesResponse.json();
    for (const msg of messages) {
        if (msg.text && msg.text.startsWith('__E2E__')) {
            const parts = msg.text.slice(7).split('.');
            if (parts.length === 2) {
                msg.text = await e2eDecrypt(chatId, parts[1], parts[0]);
            }
        }
    }
    messagesContainer.innerHTML = messages.map((msg, index) => {
        const isOwn = msg.sender === currentUser.username;
        return renderMessageHTML(msg, isOwn, index);
    }).join('');
    document.querySelectorAll('.message').forEach(msgEl => {
        let pressTimer;
        let touchStartX, touchStartY;
        msgEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showMessageMenu(msgEl, e);
        });
        const menuBtn = msgEl.querySelector('.msg-menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showMessageMenu(msgEl, e);
            });
        }
        msgEl.addEventListener('mousedown', (e) => {
            pressTimer = setTimeout(() => {
                showMessageMenu(msgEl, e);
            }, 500);
        });
        msgEl.addEventListener('mouseup', () => clearTimeout(pressTimer));
        msgEl.addEventListener('mouseleave', () => clearTimeout(pressTimer));
        msgEl.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            pressTimer = setTimeout(() => {
                showMessageMenu(msgEl, e);
            }, 500);
        }, { passive: true });
        msgEl.addEventListener('touchend', () => clearTimeout(pressTimer));
        msgEl.addEventListener('touchmove', (e) => {
            clearTimeout(pressTimer);
        }, { passive: true });
        addSwipeHandler(msgEl);
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
    window.currentChatId = chatId;
    const callBtn = document.getElementById('header-call');
    const videoCallBtn = document.getElementById('header-video-call');
    if (callBtn) callBtn.classList.toggle('hidden', !!chat.isChannel);
    if (videoCallBtn) videoCallBtn.classList.toggle('hidden', !!chat.isChannel);
    if (window.pollingInterval) clearInterval(window.pollingInterval);
    window.pollingInterval = setInterval(async () => {
        if (!window.currentChatId) return;
        const resp = await fetch(`${API_URL}/api/messages/${window.currentChatId}`);
        const msgs = await resp.json();
        const container = document.getElementById('messages');
        if (!container) return;
        let lastMsg = container.lastElementChild;
        while (lastMsg && !lastMsg.dataset.messageId) lastMsg = lastMsg.previousElementSibling;
        const lastId = lastMsg ? parseInt(lastMsg.dataset.messageId) : 0;
        const newMsgs = msgs.filter(m => m.id > lastId);
        if (newMsgs.length > 0) {
            const cur = await getCurrentUser();
            for (const msg of newMsgs) {
                if (container.querySelector(`[data-message-id="${msg.id}"]`)) continue;
                const isOwn = msg.sender === cur.username;
                const html = renderMessageHTML(msg, isOwn);
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const el = temp.firstElementChild;
                if (el) {
                    el.addEventListener('contextmenu', (e) => { e.preventDefault(); showMessageMenu(el, e); });
                    const btn = el.querySelector('.msg-menu-btn');
                    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); showMessageMenu(el, e); });
                    addSwipeHandler(el);
                    container.appendChild(el);
                }
            }
            container.scrollTop = container.scrollHeight;
        }
    }, 1000);
    if (window.onlineInterval) clearInterval(window.onlineInterval);
    window.onlineInterval = setInterval(async () => {
        if (!window.currentChatId || chat.isChannel) return;
        const oUser = chat.participant1 === currentUser.username ? chat.participant2 : chat.participant1;
        try {
            const r = await fetch(`${API_URL}/api/users/online/${oUser}`);
            const d = await r.json();
            const s = document.getElementById('chat-status');
            if (s) {
                if (d.online) { s.textContent = 'online'; s.style.color = 'var(--accent)'; }
                else if (d.lastActive) {
                    const t = new Date(d.lastActive + 'Z');
                    const diff = Math.floor((Date.now() - t) / 1000);
                    if (diff < 3600) s.textContent = `был(а) ${Math.floor(diff/60)}м назад`;
                    else if (diff < 86400) s.textContent = `был(а) ${Math.floor(diff/3600)}ч назад`;
                    else s.textContent = `был(а) ${t.toLocaleDateString()}`;
                    s.style.color = 'var(--text2)';
                }
            }
        } catch(e) {}
    }, 15000);
    if (window.callPollInterval) clearInterval(window.callPollInterval);
    window.callPollInterval = setInterval(async () => {
        const uname = getCookie('currentUsername');
        if (window.currentChatId && uname) await pollSignals(window.currentChatId, uname);
    }, 1000);
    initMessageHandlers();
    const headerUser = document.getElementById('chat-header-user');
    if (headerUser) {
        const newHeaderUser = headerUser.cloneNode(true);
        headerUser.parentNode.replaceChild(newHeaderUser, headerUser);
        newHeaderUser.addEventListener('click', async () => {
            if (chat.isChannel) {
                openChannelProfile(chat);
                return;
            }
            const otherUsername = chat.participant1 === currentUser.username ? chat.participant2 : chat.participant1;
            const otherUser = await getUserByUsername(otherUsername);
            if (otherUser) openProfileModal(otherUser);
        });
    }
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.add('closed');
    }
}
function initFolderTabs() {
    document.querySelectorAll('.folder-tab').forEach(tab => {
        tab.addEventListener('click', async () => {
            document.querySelectorAll('.folder-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFolder = tab.dataset.folder;
            await loadChatsAndUsers();
        });
    });
}
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    let debounceTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = searchInput.value.trim();
            if (!query) {
                await loadChatsAndUsers();
                return;
            }
            const currentUser = await getCurrentUser();
            if (!currentUser) return;
            const [users, channels] = await Promise.all([
                searchUsers(query),
                fetch(`${API_URL}/api/chats/search/${query}`).then(r => r.json())
            ]);
            const chatList = document.getElementById('chat-list');
            if (!chatList) return;
            const filteredUsers = users.filter(u => u.username !== currentUser.username);
            let html = '';
            if (channels.length > 0) {
                html += `<div style="padding: 8px 16px; font-size: 12px; color: var(--text3); font-weight: 600;">КАНАЛЫ</div>`;
                html += channels.map(ch => {
                    const words = (ch.channelName || 'Канал').split(' ');
                    const initials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : words[0].slice(0, 2).toUpperCase();
                    const colors = getAvatarColors(ch.id);
                    return `
                        <div class="chat-item" data-chat-id="${ch.id}">
                            <div class="chat-item-avatar" style="background-image:url('${avatarSVG(initials, 50, colors)}');background-size:cover;"></div>
                            <div class="chat-item-info">
                                <div class="chat-item-name">${ch.channelName || 'Канал'}</div>
                                <div class="chat-item-preview" style="color:var(--text3);font-size:12px;">Канал</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            if (filteredUsers.length > 0) {
                html += `<div style="padding: 8px 16px; font-size: 12px; color: var(--text3); font-weight: 600;">ПОЛЬЗОВАТЕЛИ</div>`;
                html += filteredUsers.map(user => {
                    const displayName = user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname;
                    const initials = getInitials(user.firstname, user.lastname);
                    const colors = getAvatarColors(user.username);
                    const avatarStyle = user.avatarUrl ? `background-image:url('${user.avatarUrl}');background-size:cover;` : `background-image:url('${avatarSVG(initials, 50, colors)}');background-size:cover;`;
                    return `
                        <div class="chat-item" data-user-username="${user.username}">
                            <div class="chat-item-avatar" style="${avatarStyle}"></div>
                            <div class="chat-item-info">
                                <div class="chat-item-name">${displayName}${renderBadge(user.badge)}</div>
                                <div class="chat-item-preview" style="color:var(--text3);font-size:12px;">${user.username}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            if (!html) {
                html = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">Ничего не найдено</div>`;
            }
            chatList.innerHTML = html;
            chatList.querySelectorAll('.chat-item[data-chat-id]').forEach(item => {
                item.addEventListener('click', async () => {
                    await openChat(item.dataset.chatId);
                });
            });
            chatList.querySelectorAll('.chat-item[data-user-username]').forEach(item => {
                item.addEventListener('click', async () => {
                    await openOrCreateChat(item.dataset.userUsername);
                });
            });
        }, 300);
    });
}
function initMessageHandlers() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');
    const backBtn = document.getElementById('back-btn');
    if (sendBtn) {
        const newSendBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
        newSendBtn.addEventListener('click', () => sendMessage());
    }
    if (messageInput) {
        const newMessageInput = messageInput.cloneNode(true);
        messageInput.parentNode.replaceChild(newMessageInput, messageInput);
        newMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        newMessageInput.addEventListener('focus', () => {
            setTimeout(() => {
                const messagesContainer = document.getElementById('messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }, 300);
        });
    }
    if (attachBtn && fileInput) {
        const newAttachBtn = attachBtn.cloneNode(true);
        attachBtn.parentNode.replaceChild(newAttachBtn, attachBtn);
        const newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        newAttachBtn.addEventListener('click', () => newFileInput.click());
        newFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await sendFileMessage(file);
                newFileInput.value = '';
            }
        });
    }
    if (backBtn) {
        const newBackBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBackBtn, backBtn);
        newBackBtn.addEventListener('click', () => {
            const emptyState = document.getElementById('empty-state');
            const chatContent = document.getElementById('chat-content');
            if (emptyState) emptyState.classList.remove('hidden');
            if (chatContent) chatContent.classList.add('hidden');
            window.currentChatId = null;
            if (window.pollingInterval) { clearInterval(window.pollingInterval); window.pollingInterval = null; }
            if (window.callPollInterval) { clearInterval(window.callPollInterval); window.callPollInterval = null; }
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('closed');
            }
        });
    }
}
async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const text = messageInput?.value.trim();
    if (!text || !window.currentChatId) return;
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const chatResponse = await fetch(`${API_URL}/api/chats/info/${window.currentChatId}`);
    const chat = await chatResponse.json();
    if (chat.isChannel && currentUser.username !== '@notkovvik') {
        showMessage('Только @notkovvik может писать в этот канал');
        return;
    }
    let finalText = text;
    let replyInfo = window._replyingTo;
    if (replyInfo) {
        finalText = `↩ ${replyInfo.sender}: ${replyInfo.text.slice(0, 50)}\n━━━━━━━━━━━\n${text}`;
        document.getElementById('reply-banner')?.remove();
        window._replyingTo = null;
    }
    const message = {
        chatId: window.currentChatId,
        text: finalText,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        sender: currentUser.username,
        timestamp: new Date().toISOString()
    };
    const chatKey = getChatKey(window.currentChatId);
    if (chatKey) {
        const { encrypted, ivB64 } = await e2eEncrypt(window.currentChatId, text);
        message.text = `__E2E__${ivB64}.${encrypted}`;
    }
    if (messageInput) messageInput.value = '';
    const messagesContainer = document.getElementById('messages');
    let messageEl;
    if (messagesContainer) {
        messageEl = document.createElement('div');
        messageEl.className = 'message own';
        const checkIcon = '<span class="msg-check"><svg viewBox="0 0 14 10" fill="none"><path d="M3 5.5L5.5 8L11 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
        let displayText = text;
        if (replyInfo) {
            displayText = `↩ ${replyInfo.sender}: ${replyInfo.text.slice(0, 30)}…\n${text}`;
        }
        messageEl.innerHTML = `
            <span>${displayText}</span>
            <div class="msg-time">${message.time}${checkIcon}</div>
        `;
        messagesContainer.appendChild(messageEl);
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 10);
    }
    try {
        const resp = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
        const result = await resp.json();
        if (result.id && messageEl) messageEl.dataset.messageId = result.id;
        sendMessageNotification(window.currentChatId, text, currentUser);
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
    }
}
async function sendFileMessage(file) {
    if (!window.currentChatId) return;
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    if (file.size > 50 * 1024 * 1024) {
        showMessage('Файл слишком большой. Максимальный размер: 50MB');
        return;
    }
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'message own';
        loadingEl.id = 'loading-message';
        loadingEl.innerHTML = `<span>Загрузка файла...</span>`;
        messagesContainer.appendChild(loadingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const timestamp = new Date().toISOString();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', window.currentChatId);
    formData.append('sender', currentUser.username);
    formData.append('time', time);
    formData.append('timestamp', timestamp);
    try {
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('loading-message')?.remove();
            if (messagesContainer) {
                const messageEl = document.createElement('div');
                messageEl.className = 'message own';
                const checkIcon = '<span class="msg-check"><svg viewBox="0 0 14 10" fill="none"><path d="M3 5.5L5.5 8L11 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
                let content = '';
                if (data.fileType?.startsWith('image/')) {
                    content = `<div class="msg-file"><img src="${data.fileUrl}" alt="${data.fileName}"></div>`;
                } else if (data.fileType?.startsWith('video/')) {
                    content = `<div class="msg-file"><video src="${data.fileUrl}" controls></video></div>`;
                } else {
                    content = `<div class="msg-file"><a href="${data.fileUrl}" download="${data.fileName}">📎 ${data.fileName}</a></div>`;
                }
                messageEl.innerHTML = `
                    ${content}
                    <div class="msg-time">${time}${checkIcon}</div>
                `;
                messagesContainer.appendChild(messageEl);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        document.getElementById('loading-message')?.remove();
        showMessage('Ошибка загрузки файла');
    }
}
async function sendMessageNotification(chatId, text, sender) {
    try {
        const chatResponse = await fetch(`${API_URL}/api/chats/info/${chatId}`);
        const chat = await chatResponse.json();
        if (!chat || chat.isChannel) return;
        const otherUsername = chat.participant1 === sender.username ? chat.participant2 : chat.participant1;
        const otherUser = await getUserByUsername(otherUsername);
        if (otherUser && otherUser.chatId) {
            const senderName = sender.lastname ? `${sender.firstname} ${sender.lastname}` : sender.firstname;
            const message = `💬 Новое сообщение от ${senderName}:\n\n"${text}"\n\n<a href="https://web.notmess.ru">Открыть NotMess</a>`;
            await telegramApi('sendMessage', { chat_id: otherUser.chatId, text: message, parse_mode: 'HTML' });
        }
    } catch (error) {
        console.error('Ошибка отправки уведомления:', error);
    }
}
async function addToFavorites(messageData) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    try {
        const response = await fetch(`${API_URL}/api/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser.username,
                text: messageData.text,
                fileUrl: messageData.fileUrl,
                fileType: messageData.fileType,
                fileName: messageData.fileName,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString()
            })
        });
        if (response.ok) {
            showMessage('✅ Добавлено в избранное');
        }
    } catch (error) {
        console.error('Ошибка добавления в избранное:', error);
    }
}
async function openFavorite(favoriteId) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;
        const response = await fetch(`${API_URL}/api/favorites/${currentUser.username}`);
        const favorites = await response.json();
        const favorite = favorites.find(f => f.id == favoriteId);
        if (!favorite) return;
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        let content = '';
        if (favorite.fileUrl) {
            if (favorite.fileType?.startsWith('image/')) {
                content = `<img src="${favorite.fileUrl}" alt="${favorite.fileName}" style="max-width: 100%; border-radius: 8px;">`;
            } else if (favorite.fileType?.startsWith('video/')) {
                content = `<video src="${favorite.fileUrl}" controls style="max-width: 100%; border-radius: 8px;"></video>`;
            } else {
                content = `<a href="${favorite.fileUrl}" download="${favorite.fileName}">📎 ${favorite.fileName}</a>`;
            }
        }
        if (favorite.text) {
            content += `<p style="margin-top: 16px;">${favorite.text}</p>`;
        }
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" id="fav-modal-close">&times;</button>
                <h3>⭐ Избранное</h3>
                <div style="margin: 20px 0;">
                    ${content}
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="delete-fav-btn" style="flex: 1; padding: 10px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Удалить
                    </button>
                    <button id="close-fav-btn" style="flex: 1; padding: 10px; background: var(--bg-secondary); border: none; border-radius: 8px; cursor: pointer;">
                        Закрыть
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('fav-modal-close').addEventListener('click', () => modal.remove());
        document.getElementById('close-fav-btn').addEventListener('click', () => modal.remove());
        document.getElementById('delete-fav-btn').addEventListener('click', async () => {
            if (await showConfirm('Удаление', 'Удалить из избранного?')) {
                try {
                    const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        modal.remove();
                        await loadChatsAndUsers();
                    }
                } catch (error) {
                    console.error('Ошибка удаления из избранного:', error);
                }
            }
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    } catch (error) {
        console.error('Ошибка открытия избранного:', error);
    }
}
function addSwipeHandler(msgEl) {
    let sx, sy;
    msgEl.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    msgEl.addEventListener('touchmove', (e) => {
        if (!sx) return;
        const dx = e.touches[0].clientX - sx;
        const dy = e.touches[0].clientY - sy;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
            const text = msgEl.querySelector('span')?.textContent || '';
            const sender = msgEl.dataset.sender || '';
            const existing = document.getElementById('reply-banner');
            if (existing) existing.remove();
            const banner = document.createElement('div');
            banner.id = 'reply-banner';
            banner.className = 'reply-banner';
            banner.innerHTML = `
                <div class="reply-banner-content">
                    <span class="reply-banner-arrow">↩</span>
                    <div class="reply-banner-text">
                        <div class="reply-banner-name">${sender}</div>
                        <div class="reply-banner-msg">${text.slice(0, 80)}</div>
                    </div>
                    <button class="reply-banner-close">&times;</button>
                </div>
            `;
            const inputArea = document.querySelector('.input-area');
            if (inputArea) {
                inputArea.insertBefore(banner, inputArea.firstChild);
                window._replyingTo = { messageId: msgEl.dataset.messageId, sender, text };
            }
            banner.querySelector('.reply-banner-close').addEventListener('click', () => {
                banner.remove();
                window._replyingTo = null;
            });
            document.getElementById('message-input')?.focus();
            sx = null;
        }
    }, { passive: false });
}
function renderMessageHTML(msg, isOwn, index) {
    const messageClass = isOwn ? 'message own' : 'message other';
    let content = '';
    if (msg.fileUrl) {
        if (msg.fileType?.startsWith('image/')) {
            content = `<div class="msg-file"><img src="${msg.fileUrl}" alt="${msg.fileName}"></div>`;
        } else if (msg.fileType?.startsWith('video/')) {
            content = `<div class="msg-file"><video src="${msg.fileUrl}" controls></video></div>`;
        } else {
            content = `<div class="msg-file"><a href="${msg.fileUrl}" download="${msg.fileName}">📎 ${msg.fileName}</a></div>`;
        }
    }
    if (msg.text) {
        content += `<span>${msg.text}</span>`;
    }
    const messageData = JSON.stringify({
        text: msg.text || '',
        fileUrl: msg.fileUrl || '',
        fileType: msg.fileType || '',
        fileName: msg.fileName || ''
    }).replace(/"/g, '&quot;');
    const checkIcon = isOwn ? `<span class="msg-check"><svg viewBox="0 0 14 10" fill="none"><path d="M3 5.5L5.5 8L11 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : '';
    const idxAttr = index !== undefined ? `data-message-index="${index}"` : '';
    return `
        <div class="${messageClass}" ${idxAttr} data-message-id="${msg.id}" data-message-data="${messageData}" data-sender="${msg.sender}">
            ${content}
            <div class="msg-time">${msg.time}${checkIcon}</div>
            <button class="msg-menu-btn"><svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg></button>
        </div>
    `;
}
function showMessageMenu(messageElement, event) {
    event.preventDefault();
    event.stopPropagation?.();
    document.querySelector('.message-menu')?.remove();
    const messageData = JSON.parse(messageElement.dataset.messageData.replace(/&quot;/g, '"'));
    const sender = messageElement.dataset.sender || '';
    const isOwn = sender === getCookie('currentUsername');
    const msgId = messageElement.dataset.messageId;
    const menu = document.createElement('div');
    menu.className = 'message-menu';
    let items = '';
    items += `<div class="message-menu-item" data-action="reply"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 14 4 9 9 4"/><path d="M4 9h11a3 3 0 0 1 3 3v3"/></svg></span><span>Ответить</span></div>`;
    items += `<div class="message-menu-item" data-action="forward"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="15 4 19 8 15 12"/><path d="M5 8h10a3 3 0 0 1 3 3v4"/></svg></span><span>Переслать</span></div>`;
    items += `<div class="message-menu-item" data-action="pin"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l4 4"/><path d="M10 4l-3 3a4 4 0 0 0-1 2.5V12l6 6v-2.5a4 4 0 0 0 1-2.5l3-3"/><line x1="2" y1="18" x2="7" y2="13"/></svg></span><span>Закрепить</span></div>`;
    items += `<div class="message-menu-item" data-action="favorite"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="10 2 12.5 7.5 18 8.5 14 12.5 15 18 10 15 5 18 6 12.5 2 8.5 7.5 7.5 10 2"/></svg></span><span>В избранное</span></div>`;
    if (isOwn) {
        items += `<div class="message-menu-item" data-action="edit"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M13.5 2.5a2.12 2.12 0 0 1 3 3L8 14l-4 1 1-4 8.5-8.5z"/></svg></span><span>Изменить</span></div>`;
    }
    items += `<div class="message-menu-divider"></div>`;
    if (isOwn) {
        items += `<div class="message-menu-item" data-action="delete-all" style="color:var(--danger,#e74c3c);"><span class="menu-item-icon" style="color:var(--danger,#e74c3c);"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 17 6"/><path d="M6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M16 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6"/><line x1="9" y1="9" x2="9" y2="14"/><line x1="11" y1="9" x2="11" y2="14"/></svg></span><span>Удалить у всех</span></div>`;
        items += `<div class="message-menu-item" data-action="delete-self" style="color:var(--text3);"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 17 6"/><path d="M6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M16 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6"/></svg></span><span>Удалить у себя</span></div>`;
    } else {
        items += `<div class="message-menu-item" data-action="delete-self" style="color:var(--text3);"><span class="menu-item-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="3 6 5 6 17 6"/><path d="M6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M16 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6"/></svg></span><span>Удалить</span></div>`;
    }
    menu.innerHTML = items;
    document.body.appendChild(menu);
    menu.querySelector('[data-action="reply"]')?.addEventListener('click', () => {
        menu.remove();
        const text = messageElement.querySelector('span')?.textContent || '';
        const existing = document.getElementById('reply-banner');
        if (existing) existing.remove();
        const banner = document.createElement('div');
        banner.id = 'reply-banner';
        banner.className = 'reply-banner';
        banner.innerHTML = `
            <div class="reply-banner-content">
                <span class="reply-banner-arrow">↩</span>
                <div class="reply-banner-text">
                    <div class="reply-banner-name">${sender}</div>
                    <div class="reply-banner-msg">${text.slice(0, 80)}</div>
                </div>
                <button class="reply-banner-close">&times;</button>
            </div>
        `;
        const inputArea = document.querySelector('.input-area');
        if (inputArea) {
            inputArea.insertBefore(banner, inputArea.firstChild);
            window._replyingTo = { messageId: msgId, sender, text };
        }
        banner.querySelector('.reply-banner-close').addEventListener('click', () => {
            banner.remove();
            window._replyingTo = null;
        });
        document.getElementById('message-input')?.focus();
    });
    menu.querySelector('[data-action="forward"]')?.addEventListener('click', () => {
        menu.remove();
        showForwardDialog(messageData, msgId);
    });
    menu.querySelector('[data-action="pin"]')?.addEventListener('click', async () => {
        menu.remove();
        const text = messageElement.querySelector('span')?.textContent || 'Сообщение';
        await sendSystemMessage('📌 Сообщение закреплено: ' + text.slice(0, 50));
        showMessage('📌 Сообщение закреплено');
    });
    menu.querySelector('[data-action="favorite"]')?.addEventListener('click', () => {
        addToFavorites(messageData);
        menu.remove();
    });
    menu.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
        menu.remove();
        const span = messageElement.querySelector('span');
        if (!span || !msgId) return;
        const origText = span.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = origText;
        span.replaceWith(input);
        input.focus();
        input.select();
        const cancel = () => {
            input.replaceWith(span);
        };
        const save = async () => {
            const newText = input.value.trim();
            if (!newText || newText === origText) { cancel(); return; }
            try {
                await fetch(`${API_URL}/api/messages/${msgId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: newText })
                });
                span.textContent = newText;
                messageElement.dataset.messageData = JSON.stringify({...messageData, text: newText}).replace(/"/g, '&quot;');
            } catch(e) {}
            input.replaceWith(span);
        };
        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); save(); }
            if (e.key === 'Escape') cancel();
        });
    });
    menu.querySelector('[data-action="delete-all"]')?.addEventListener('click', async () => {
        menu.remove();
        if (!msgId) return;
        if (!await showConfirm('Удалить', 'Удалить сообщение у всех?')) return;
        try {
            await fetch(`${API_URL}/api/messages/${msgId}`, { method: 'DELETE' });
            messageElement.remove();
        } catch(e) {
            messageElement.style.opacity = '.3';
        }
    });
    menu.querySelector('[data-action="delete-self"]')?.addEventListener('click', () => {
        menu.remove();
        messageElement.style.opacity = '.3';
        messageElement.style.textDecoration = 'line-through';
    });
    const rect = messageElement.getBoundingClientRect();
    const x = event.clientX || rect.left;
    const y = event.clientY || rect.top;
    menu.style.left = `${Math.min(x, window.innerWidth - 220)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - 300)}px`;
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape') { menu.remove(); document.removeEventListener('keydown', escClose); }
        });
    }, 10);
}
async function sendSystemMessage(text) {
    const currentUser = await getCurrentUser();
    if (!currentUser || !window.currentChatId) return;
    await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chatId: window.currentChatId,
            text,
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            sender: currentUser.username,
            timestamp: new Date().toISOString()
        })
    });
}
async function showForwardDialog(messageData, msgId) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;
    const resp = await fetch(`${API_URL}/api/chats/${currentUser.username}`);
    const chats = await resp.json();
    const chatList = chats.filter(c => !c.isChannel);
    if (chatList.length === 0) {
        showMessage('Нет чатов для пересылки');
        return;
    }
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    let html = `<div class="modal-content" style="max-width:360px;padding:0;">
        <div style="display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border);">
            <span style="font-size:16px;font-weight:600;">Переслать сообщение</span>
            <button class="modal-close" style="margin-left:auto;">&times;</button>
        </div>
        <div style="padding:6px;max-height:400px;overflow-y:auto;">`;
    for (const chat of chatList) {
        const other = chat.participant1 === currentUser.username ? chat.participant2 : chat.participant1;
        const user = await getUserByUsername(other);
        const name = user ? (user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname) : other;
        html += `<div class="settings-item forward-chat-item" data-chat-id="${chat.id}">
            <span class="settings-icon" style="width:40px;height:40px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:16px;">💬</span>
            <div class="settings-info"><div class="settings-label">${name}</div><div class="settings-hint">${other}</div></div>
        </div>`;
    }
    html += `</div></div>`;
    modal.innerHTML = html;
    document.body.appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelectorAll('.forward-chat-item').forEach(item => {
        item.addEventListener('click', async () => {
            const chatId = item.dataset.chatId;
            const text = messageData.text || '📎 Файл';
            await fetch(`${API_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId,
                    text: '📤 ' + text,
                    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    sender: currentUser.username,
                    timestamp: new Date().toISOString()
                })
            });
            modal.remove();
            showMessage('📤 Сообщение переслано');
        });
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}
async function openGiftShop() {
    const modal = document.getElementById('gift-shop-modal');
    const grid = document.getElementById('gift-shop-grid');
    const starsEl = document.getElementById('gift-shop-stars');
    if (!modal || !grid) return;
    const currentUsername = getCookie('currentUsername');
    if (!currentUsername) return;
    const stars = getCookie(`stars_${currentUsername}`) || '0';
    if (starsEl) starsEl.textContent = stars;
    try {
        const [catalogRes, giftsRes] = await Promise.all([
            fetch(`${API_URL}/api/gifts/catalog`),
            fetch(`${API_URL}/api/gifts/${currentUsername}`)
        ]);
        const catalog = await catalogRes.json();
        const userGifts = await giftsRes.json();
        const ownedGiftIds = new Set(userGifts.map(g => g.gift_id));
        grid.innerHTML = Object.entries(catalog).map(([id, gift]) => {
            const owned = ownedGiftIds.has(id);
            return `
                <div class="gift-card ${owned ? 'owned' : ''}">
                    <div class="gift-card-emoji">${gift.emoji}</div>
                    <div class="gift-card-name">${gift.name}</div>
                    <div class="gift-card-price">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        ${gift.price}
                    </div>
                    ${owned ? '<div class="gift-card-owned">✅</div>' : `<button class="gift-card-btn" data-gift-id="${id}" data-price="${gift.price}">Купить</button>`}
                </div>
            `;
        }).join('');
        grid.querySelectorAll('.gift-card-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const giftId = btn.dataset.giftId;
                const price = parseInt(btn.dataset.price);
                const currentStars = parseInt(getCookie(`stars_${currentUsername}`) || '0');
                if (currentStars < price) {
                    showMessage('❌ Недостаточно звезд');
                    return;
                }
                const res = await fetch(`${API_URL}/api/gifts/buy`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username: currentUsername, giftId})
                });
                const data = await res.json();
                if (data.success) {
                    setCookie(`stars_${currentUsername}`, (currentStars - price).toString());
                    await openGiftShop();
                } else {
                    showMessage('❌ Ошибка покупки');
                }
            });
        });
        modal.classList.remove('hidden');
    } catch (e) {
        console.error('Gift shop error:', e);
        showMessage('❌ Ошибка загрузки магазина');
    }
}
const STUN = 'stun:stun.l.google.com:19302';
let localStream, peerConn;
let callState = 'idle';
function showCallOverlay() { document.getElementById('call-overlay').classList.remove('hidden'); }
function hideCallOverlay() { document.getElementById('call-overlay').classList.add('hidden'); }
function showIncoming() { document.getElementById('incoming-call').classList.remove('hidden'); }
function hideIncoming() { document.getElementById('incoming-call').classList.add('hidden'); }
async function startCall(isVideo = false) {
    if (!window.currentChatId) return;
    if (!navigator.mediaDevices) { showMessage('Звонки доступны только через HTTPS или localhost'); return; }
    const currentUser = await getCurrentUser();
    const chatResp = await fetch(`${API_URL}/api/chats/info/${window.currentChatId}`);
    const chat = await chatResp.json();
    if (!chat || chat.isChannel) return;
    const other = chat.participant1 === currentUser.username ? chat.participant2 : chat.participant1;
    const otherUser = await getUserByUsername(other);
    if (!otherUser) return;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true });
        const videoEl = document.getElementById('call-local-video');
        if (videoEl) { videoEl.innerHTML = ''; videoEl.appendChild(document.createElement('video')); videoEl.firstChild.srcObject = localStream; videoEl.firstChild.muted = true; videoEl.firstChild.play(); videoEl.classList.toggle('active', isVideo); }
        peerConn = new RTCPeerConnection({ iceServers: [{ urls: STUN }] });
        localStream.getTracks().forEach(t => peerConn.addTrack(t, localStream));
        peerConn.ontrack = (e) => {
            const container = document.getElementById('call-avatar');
            if (container) { container.innerHTML = ''; const v = document.createElement('video'); v.srcObject = e.streams[0]; v.autoplay = true; v.playsInline = true; container.appendChild(v); container.style.backgroundImage = 'none'; }
        };
        peerConn.onicecandidate = (e) => {
            if (e.candidate) sendSignal(window.currentChatId, currentUser.username, 'ice', JSON.stringify(e.candidate));
        };
        peerConn.onconnectionstatechange = () => {
            if (peerConn.connectionState === 'disconnected' || peerConn.connectionState === 'failed') endCall();
        };
        const offer = await peerConn.createOffer();
        await peerConn.setLocalDescription(offer);
        await sendSignal(window.currentChatId, currentUser.username, 'offer', JSON.stringify(offer));
        callState = 'calling';
        showCallOverlay();
        document.getElementById('call-name').textContent = otherUser.firstname;
        document.getElementById('call-status').textContent = 'Звоним...';
        const initials = getInitials(otherUser.firstname, otherUser.lastname);
        const colors = getAvatarColors(otherUser.username);
        const av = document.getElementById('call-avatar');
        if (av) { av.style.backgroundImage = `url('${avatarSVG(initials, 80, colors)}')`; av.style.backgroundSize = 'cover'; av.innerHTML = ''; }
        document.getElementById('call-video-btn').dataset.active = isVideo ? '1' : '0';
        document.getElementById('call-timer').textContent = '';
    } catch (e) { showMessage('❌ Ошибка звонка: ' + e.message); }
}
async function answerCall() {
    if (!window._pendingCall) return;
    if (!navigator.mediaDevices) { showMessage('Звонки доступны только через HTTPS или localhost'); return; }
    const { chatId, from, offer } = window._pendingCall;
    const currentUser = await getCurrentUser();
    const otherUser = await getUserByUsername(from);
    if (!otherUser) return;
    hideIncoming();
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        const videoEl = document.getElementById('call-local-video');
        if (videoEl) { videoEl.innerHTML = ''; videoEl.appendChild(document.createElement('video')); videoEl.firstChild.srcObject = localStream; videoEl.firstChild.muted = true; videoEl.firstChild.play(); }
        peerConn = new RTCPeerConnection({ iceServers: [{ urls: STUN }] });
        localStream.getTracks().forEach(t => peerConn.addTrack(t, localStream));
        peerConn.ontrack = (e) => {
            const container = document.getElementById('call-avatar');
            if (container) { container.innerHTML = ''; const v = document.createElement('video'); v.srcObject = e.streams[0]; v.autoplay = true; v.playsInline = true; container.appendChild(v); container.style.backgroundImage = 'none'; }
        };
        peerConn.onicecandidate = (e) => {
            if (e.candidate) sendSignal(chatId, currentUser.username, 'ice', JSON.stringify(e.candidate));
        };
        peerConn.onconnectionstatechange = () => {
            if (peerConn.connectionState === 'disconnected' || peerConn.connectionState === 'failed') endCall();
        };
        await peerConn.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConn.createAnswer();
        await peerConn.setLocalDescription(answer);
        await sendSignal(chatId, currentUser.username, 'answer', JSON.stringify(answer));
        callState = 'in_call';
        showCallOverlay();
        document.getElementById('call-name').textContent = otherUser.firstname;
        document.getElementById('call-status').textContent = 'В разговоре';
        const initials = getInitials(otherUser.firstname, otherUser.lastname);
        const colors = getAvatarColors(otherUser.username);
        const av = document.getElementById('call-avatar');
        if (av) { av.style.backgroundImage = `url('${avatarSVG(initials, 80, colors)}')`; av.style.backgroundSize = 'cover'; av.innerHTML = ''; }
        delete window._pendingCall;
    } catch (e) { showMessage('❌ Ошибка ответа: ' + e.message); }
}
async function endCall() {
    if (peerConn) peerConn.close();
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    peerConn = null; localStream = null;
    callState = 'idle';
    hideCallOverlay();
    hideIncoming();
    if (window.currentChatId) {
        await sendSignal(window.currentChatId, getCookie('currentUsername'), 'end', '{}');
    }
    delete window._pendingCall;
}
async function sendSignal(chatId, sender, type, payload) {
    await fetch(`${API_URL}/api/call/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, sender, type, payload })
    });
}
async function pollSignals(chatId, sender) {
    try {
        const resp = await fetch(`${API_URL}/api/call/poll/${chatId}/${sender}`);
        const signals = await resp.json();
        for (const sig of signals) {
            if (sig.type === 'end') { endCall(); return; }
            if (sig.type === 'offer' && callState === 'idle') {
                const offer = JSON.parse(sig.payload);
                window._pendingCall = { chatId, from: sig.sender, offer };
                const otherUser = await getUserByUsername(sig.sender);
                if (otherUser) {
                    document.getElementById('incoming-name').textContent = otherUser.firstname;
                    const initials = getInitials(otherUser.firstname, otherUser.lastname);
                    const colors = getAvatarColors(otherUser.username);
                    const av = document.getElementById('incoming-avatar');
                    if (av) { av.style.backgroundImage = `url('${avatarSVG(initials, 80, colors)}')`; av.style.backgroundSize = 'cover'; }
                }
                showIncoming();
            }
            if (sig.type === 'answer' && peerConn && peerConn.signalingState === 'have-local-offer') {
                const answer = JSON.parse(sig.payload);
                await peerConn.setRemoteDescription(new RTCSessionDescription(answer));
                document.getElementById('call-status').textContent = 'В разговоре';
                callState = 'in_call';
            }
            if (sig.type === 'ice' && peerConn) {
                const candidate = JSON.parse(sig.payload);
                if (candidate) await peerConn.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
            }
        }
    } catch (e) { /* poll errors */ }
}
document.getElementById('header-call')?.addEventListener('click', () => showMessage('📞 Звонки недоступны в приложении'));
document.getElementById('header-video-call')?.addEventListener('click', () => showMessage('📹 Видеозвонки недоступны в приложении'));
document.getElementById('call-end-btn')?.addEventListener('click', endCall);
document.getElementById('call-answer-btn')?.addEventListener('click', answerCall);
document.getElementById('call-decline-btn')?.addEventListener('click', () => { endCall(); if (window._pendingCall) sendSignal(window._pendingCall.chatId, getCookie('currentUsername'), 'end', '{}'); });
document.getElementById('call-mute-btn')?.addEventListener('click', () => {
    if (localStream) {
        const enabled = !localStream.getAudioTracks()[0]?.enabled;
        localStream.getAudioTracks().forEach(t => t.enabled = enabled);
        document.getElementById('call-mute-btn').classList.toggle('muted', !enabled);
    }
});
document.getElementById('call-video-btn')?.addEventListener('click', async () => {
    if (!localStream) return;
    const vidTrack = localStream.getVideoTracks()[0];
    if (vidTrack) {
        vidTrack.stop();
        localStream.removeTrack(vidTrack);
        document.getElementById('call-video-btn').classList.remove('video-on');
        document.getElementById('call-local-video').classList.remove('active');
    } else {
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            newStream.getVideoTracks().forEach(t => { localStream.addTrack(t); peerConn?.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(t); });
            const videoEl = document.getElementById('call-local-video');
            if (videoEl) { const v = document.createElement('video'); v.srcObject = newStream; v.muted = true; v.play(); }
            document.getElementById('call-video-btn').classList.add('video-on');
            document.getElementById('call-local-video').classList.add('active');
        } catch (e) {}
    }
});
