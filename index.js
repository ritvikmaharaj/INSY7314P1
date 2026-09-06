require("dotenv").config();

// --- Added by Saheel Bhugwandeen ---
// Validate required env vars (JWT_SECRET, MONGO_URI) and secret strength
// BEFORE the app starts - fails fast with a clear error instead of running
// with broken/insecure auth

//Added by Chase Miller
// fs and path used to read file system and manage directory paths
// https import to run encrypted server
const fs = require("fs");
const https = require("https");
const path = require('path');

const validateEnv = require("./config/validateEnv");
validateEnv();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

//Added by Chase Miller
// set servers port
const PORT = process.env.PORT || 5000;

const USE_HTTPS = process.env.USE_HTTPS === 'true'; 

// how incoming traffic is delt with
if (USE_HTTPS) { 
  // used to check the direct address of the key and the public certificate
  // it checks servers variables for a manually provided custom file path
  // and if not automatically creates a local path
  const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'localhost-key.pem'); 

  const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'localhost-cert.pem'); 

  const httpsOptions = { 
    //check cert files before servers accepts traffic
    //used to decrypt transport layer security sessions
    key: fs.readFileSync(keyPath), 
    //used to verify the servers id
    cert: fs.readFileSync(certPath) 

  }; 

  https.createServer(httpsOptions, app).listen(PORT, () => { 

    console.log(`HTTPS server running on port ${PORT}`); 

  }); 

} else { 
  //use HTTP server
  app.listen(PORT, () => { 

    console.log(`HTTP server running on port ${PORT}`); 

  }); 

} 