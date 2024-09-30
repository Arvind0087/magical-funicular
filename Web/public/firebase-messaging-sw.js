
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
const firebaseConfig = {

  // latest 
  apiKey: "AIzaSyBnSTJkBkwfBnk_9eN-5Y7hpwrvEJr6Y40",
  authDomain: "veda-academy-6316b.firebaseapp.com",
  databaseURL: "https://veda-academy-6316b-default-rtdb.firebaseio.com",
  projectId: "veda-academy-6316b",
  storageBucket: "veda-academy-6316b.appspot.com",
  messagingSenderId: "853648592714",
  appId: "1:853648592714:web:2c9440fe81e0132dd37bb3",
  measurementId: "G-JWSJPSYZF1"

  // old veda key....

  // apiKey: "AIzaSyCey_y4w63VVd6KJKFaQJRpcU5lIeBUQCc",
  // apiKey: "AIzaSyBnSTJkBkwfBnk_9eN-5Y7hpwrvEJr6Y40",
  // authDomain: "veda-academy-6316b.firebaseapp.com",
  // projectId: "veda-academy-6316b",
  // storageBucket: "veda-academy-6316b.appspot.com",
  // messagingSenderId: "853648592714",
  // appId: "1:853648592714:web:c7c8a2df74adc9a1d37bb3",
  // measurementId: "G-Y21068LD71"

  // apiKey: "AIzaSyAzGWg0dBo7WUwMVEM1FyvGzC08-zzj3Xk",
  // authDomain: "lecture-dekho-43778.firebaseapp.com",
  // projectId: "lecture-dekho-43778",
  // storageBucket: "lecture-dekho-43778.appspot.com",
  // messagingSenderId: "61376966581",
  // appId: "1:61376966581:web:831c7283c68f34a25173fc",
  // measurementId: "G-2LHWJ9MVNC"

};
function NotificationHandler() {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image,
      renotify: true,
      link: "/app/all-notifications"
    };
    
    self.registration.showNotification(notificationTitle,  {
      actions: [
        {
          action: "archive",
          title: "Archive",
        },
      ],
    });
    // Add notification click event listener
    // self.addEventListener("notificationclick", (event) => {
    //   console.log("On notification click: ", event);

    //   event.notification.close(); // Android needs explicit close.
    //   event.waitUntil(
    //     clients.matchAll({ type: "window" }).then((windowClients) => {
    //       // Check if there is already a window/tab open with the target URL
    //       for (var i = 0; i < windowClients.length; i++) {
    //         var client = windowClients[i];
    //         // If so, just focus it.
    //         console.log("url", client.url);
    //         if (client.url === event.notification.link && "focus" in client) {
    //           return client.focus();
    //         }
    //       }
    //       // If not, then open the target URL in a new window/tab.
    //       if (client.openWindow) {
    //         return client.openWindow(event.notification.link);
    //       }
    //     })
    //   );

    //   // Get the notification data from the event
    //   const notificationData = event.notification.data;

    // });
    self.addEventListener(
      "notificationclick",
      (event) => {
        event.notification.close();
        if (event.action === "archive") {
          // User selected the Archive action.
          archiveEmail();
        } else {
          // User selected (e.g., clicked in) the main body of notification.
          // clients.openWindow("/app/all-notifications&userId=12345678&force=true");
          getClippingParents.openWindow("/app/all-notifications")
        }
      },
      false
    );
  });
}
NotificationHandler();


