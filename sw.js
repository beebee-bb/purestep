/* PureStep service worker: ทำให้ติดตั้งเป็นแอปได้ และเปิดได้เร็วขึ้น
   ใช้แบบ "เน็ตก่อน" เสมอ เพื่อให้แก้ไฟล์บน GitHub แล้วลูกค้าเห็นเวอร์ชันใหม่ทันที */
const CACHE = 'purestep-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'stamp-card.jpg', 'stamp-logo.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // ไม่ยุ่งกับการเรียก Apps Script
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request)));
});
