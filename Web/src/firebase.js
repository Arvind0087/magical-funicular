import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const firebaseConfig = {
 // latest 
  apiKey: "AIzaSyBnSTJkBkwfBnk_9eN-5Y7hpwrvEJr6Y40",
  authDomain: "veda-academy-6316b.firebaseapp.com",
  databaseURL: "https://veda-academy-6316b-default-rtdb.firebaseio.com",
  projectId: "veda-academy-6316b",
  storageBucket: "veda-academy-6316b.appspot.com",
  messagingSenderId: "853648592714",
  appId: "1:853648592714:web:2c9440fe81e0132dd37bb3",
  measurementId: "G-JWSJPSYZF1"
  
  // old veda ....
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

  export const firebaseComm = initializeApp(firebaseConfig);
  
  // if (firebase.messaging.isSupported()) {
  //     let messaging = initializedFirebaseApp.messaging();
  //     console.log("messaging",messaging)
  // }
  export const messaging = getMessaging(firebaseComm);