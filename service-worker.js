// 🤖 김비서 Service Worker
// 오프라인 기능, 캐싱, 백그라운드 동기화

const CACHE_NAME = 'kimbiseo-v1.0';
const URLS_TO_CACHE = [
  './',
  './dashboard.html',
  './chart.html',
  './meeting-result.html',
  './report.html',
  './diagram.svg',
  './styles.css',
  './script.js',
  './manifest.json',
  './김비서-데이터/매출데이터.csv',
  './김비서-데이터/업무목록.csv',
  './김비서-데이터/주간일정.txt',
  './김비서-데이터/프로젝트현황.csv',
  './김비서-데이터/회의록.txt'
];

// 설치 이벤트 - 캐시에 파일 저장
self.addEventListener('install', event => {
  console.log('[Service Worker] 설치 시작');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 캐시에 파일 저장 중...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] 모든 파일이 캐시에 저장되었습니다');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] 캐시 저장 실패:', error);
      })
  );
});

// 활성화 이벤트 - 오래된 캐시 제거
self.addEventListener('activate', event => {
  console.log('[Service Worker] 활성화');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] 오래된 캐시 제거: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch 이벤트 - 네트워크 우선, 실패 시 캐시 사용
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 외부 요청은 캐시하지 않음
  if (url.origin !== location.origin) {
    return;
  }

  // GET 요청만 처리
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // 성공한 응답을 캐시에 저장
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // 네트워크 오류 시 캐시에서 가져오기
        return caches.match(request)
          .then(response => {
            if (response) {
              console.log(`[Service Worker] 캐시에서 로드: ${request.url}`);
              return response;
            }

            // HTML 파일 요청이 실패하면 오프라인 페이지 반환
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('./dashboard.html');
            }

            // 기타 요청 실패 시 에러 응답
            return new Response(
              '오프라인 상태입니다. 인터넷 연결을 확인하세요.',
              { status: 503, statusText: 'Service Unavailable' }
            );
          });
      })
  );
});

// 메시지 받기 - 클라이언트와 통신
self.addEventListener('message', event => {
  console.log('[Service Worker] 메시지 받음:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[Service Worker] 캐시가 초기화되었습니다');
      event.ports[0].postMessage({ success: true });
    });
  }
});

// 푸시 알림 받기
self.addEventListener('push', event => {
  console.log('[Service Worker] 푸시 알림 받음');

  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="45" fill="%234CAF50"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="120" font-weight="bold" fill="white" font-family="system-ui">🤖</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="%234CAF50"/><text x="48" y="48" text-anchor="middle" dy=".35em" font-size="60" fill="white">📊</text></svg>',
    tag: 'kimbiseo-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('김비서', options)
  );
});

// 알림 클릭
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] 알림 클릭됨');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // 이미 열려있는 창이 있으면 포커스
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === './' && 'focus' in client) {
          return client.focus();
        }
      }
      // 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow('./dashboard.html');
      }
    })
  );
});

console.log('[Service Worker] 로드 완료');
