// Import Firebase Admin SDK
const { initializeApp } = require("firebase-admin/app");

// Initialize Firebase Admin SDK
initializeApp();

// TODO: Need to add the credentials still
// EXAMPLE
// initializeApp({
//     credential: admin.credential.cert({
//       projectId: 'YOUR_PROJECT_ID',
//       clientEmail: 'YOUR_CLIENT_EMAIL',
//       privateKey: 'YOUR_PRIVATE_KEY',
//     }),
//   });

const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
