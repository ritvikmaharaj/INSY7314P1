const express = require('express');
const app = express();
// cors implemented to prevent unauthorized sites making requests to server
const cors = require('cors'); 
//used to protect users from attacks that compromise user data, 
// hijacked sessions and manipulated web applications
const helmet = require('helmet'); 
// Required to parse JSON bodies
app.use(express.json());

// Required to parse URL-encoded bodies 
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');

const errorHandler = require('./middleware/errorHandler'); 

app.use("/api/auth", require("./routes/authRoutes"));

app.listen(6000, () => console.log('Server running on port 6000'));

//used to configure frontend client domain that makes the API calls
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:6000'; 
//used to make it more difficult to fingerprint the server stack
app.disable('x-powered-by'); 

app.use( 

  helmet({ 
    //used to restrict which browser resources load
    contentSecurityPolicy: { 

      directives: { 
        //defaults resource types to own domain if resource not defined
        defaultSrc: ["'self'"], 
        //only executes files from users exact domain
        scriptSrc: ["'self'"], 

        styleSrc: ["'self'"], 

        imgSrc: ["'self'", 'data:'], 

        connectSrc: ["'self'", CLIENT_ORIGIN], 

        objectSrc: ["'none'"], 

        baseUri: ["'self'"], 

        frameAncestors: ["'none'"] 

      } 

    }, 

    crossOriginResourcePolicy: { policy: 'same-site' } 

  }) 

); 

app.use( 

  cors({ 
    //make it so only requests from this domain can make API calls
    origin: CLIENT_ORIGIN, 

    allowedHeaders: ['Content-Type', 'Authorization'] 

  }) 

);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "HustleHub API is running"
    });
});

//listens for http get request 
app.get('/health', (req, res) => { 

  res.status(200).json({ 

    status: 'OK', 

    protocol: USE_HTTPS ? 'HTTPS' : 'HTTP' 

  }); 

}); 
// used if request does not match any of the defined routes above
app.use((req, res) => { 

  res.status(404).json({ error: 'Route not found' }); 

}); 

app.use(errorHandler); 

module.exports = app;
