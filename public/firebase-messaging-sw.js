// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqKZKGgqGZKZKGgqGZKZKGgqGZKZKGgqG",
  authDomain: "mayegue-web.firebaseapp.com",
  projectId: "mayegue-web",
  storageBucket: "mayegue-web.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqr"
};

firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const { notification, data } = payload;
  
  if (!notification) return;

  const notificationTitle = notification.title || 'Ma\'a Yegue';
  const notificationOptions = {
    body: notification.body || '',
    icon: notification.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data?.category || 'general',
    data: data || {},
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ],
    requireInteraction: data?.priority === 'high' || data?.priority === 'max',
    silent: data?.priority === 'low'
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  const { notification, action } = event;
  const data = notification.data || {};

  event.notification.close();

  if (action === 'dismiss') {
    // Just close the notification
    return;
  }

  // Handle notification click
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          
          // Send message to client to handle notification
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            notificationId: data.notificationId,
            category: data.category,
            url: data.url
          });
          
          return;
        }
      }
      
      // Open new window if no existing window found
      const urlToOpen = data.url || '/';
      return clients.openWindow(urlToOpen);
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  const data = event.notification.data || {};
  
  // Track notification dismissal
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          client.postMessage({
            type: 'NOTIFICATION_DISMISSED',
            notificationId: data.notificationId,
            category: data.category
          });
          break;
        }
      }
    })
  );
});

// Handle push events (for custom push notifications)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (!event.data) return;

  try {
    const payload = event.data.json();
    const { title, body, icon, badge, tag, data, actions } = payload;

    const notificationOptions = {
      body: body || '',
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/icon-72x72.png',
      tag: tag || 'general',
      data: data || {},
      actions: actions || [
        {
          action: 'open',
          title: 'Ouvrir'
        }
      ],
      requireInteraction: data?.priority === 'high' || data?.priority === 'max'
    };

    event.waitUntil(
      self.registration.showNotification(title || 'Ma\'a Yegue', notificationOptions)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('Firebase messaging service worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('Firebase messaging service worker activated');
  event.waitUntil(self.clients.claim());
});

// Utility function to get category icon
function getCategoryIcon(category) {
  const icons = {
    achievement: '🏆',
    lesson: '📚',
    quiz: '❓',
    reminder: '⏰',
    social: '👥',
    system: '⚙️',
    marketing: '📢',
    announcement: '📣',
    progress: '📈',
    goal: '🎯'
  };
  return icons[category] || '🔔';
}

// Utility function to format notification body
function formatNotificationBody(body, data) {
  if (!data) return body;
  
  // Replace template variables
  let formattedBody = body;
  Object.keys(data).forEach(key => {
    const placeholder = `{${key}}`;
    if (formattedBody.includes(placeholder)) {
      formattedBody = formattedBody.replace(new RegExp(placeholder, 'g'), data[key]);
    }
  });
  
  return formattedBody;
}
