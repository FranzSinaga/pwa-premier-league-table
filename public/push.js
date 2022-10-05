var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BFc_VNuFV75ymB8C062-omRJWTY3cBE5pytoCyaZSHv3Wc6AFwmwQUmYW89dArmDKIB88b3vCxZOzzndpsQ9wCA",
    "privateKey": "drMt8sOP-dsZQfF9eAOM6lVtxonAbxZdfzAJV-hI6IU"
};


webPush.setVapidDetails(
    'mailto:sinagafranz12@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/emwgGSyhTow:APA91bG15_Zr6Fbpi9v7odoTWfG0fJ6us9AW_64OCawJGHGHqEL5iezHK5Z82kBc5FA3G3_oB8tLWFdjkQ9bjrDMsHIVTgkixpooXyDyOKFwzRYhOtz00I5OAUOJscnHRrW6TYl7eb6r",
    "keys": {
        "p256dh": "BHFs5IdqsGllYRS1hKH0XW7I+FhgM2PZljT0rB3KUdRbHYLn7KU6MZlrp73e7R+sKfx+54EhCtM/8W15kZDOaYE=",
        "auth": "AUF6fXsuLY5Hm5RCxJ/Pmw=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '382808704400',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);