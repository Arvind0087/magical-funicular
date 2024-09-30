const express = require("express");
const { config } = require("./config/db.config");
const app = express();
const cors = require("cors");
const port = config.PORT || 8080;
const adminRoute = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const helmet = require("helmet");
const { errorHandlerMiddleware } = require("././helpers/errorHandling")
require("./models/index");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const session = require("express-session");
const ejs = require("ejs");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: "*"
}); //NOTE -  input/output server
const db = require("./models/index");
const eventChatMap = db.event_chat_map;
const moment = require("moment");

//require('./helpers/init_redis')


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//NOTE -  start socket and connect to new user
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  //NOTE - send message
  socket.on('send-message', (message, eventId, role, userId) => {

    //NOTE - Get the current datetime
    const now = moment().toDate();
    const currentDate = moment(now).add(5, 'hours').add(30, 'minutes').toDate();

    //NOTE - save user response of event chat
    eventChatMap.create({
      userId: role === "User" ? userId : null, teacherId: role === "Teacher" ? userId : null, eventId: eventId, role: role, message: message, dateTime: currentDate
    })

    //NOTE - send message to all user
    io.emit('receive-message', message);
  });

  //NOTE - disconnect socket
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});


//middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(cors());
app.use(errorHandlerMiddleware)


//NOTE - swagger
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/working", async (req, res) => {
  res.send({
    status: 200,
    message: "working",
  });
});


app.set("view engine", "ejs");

app.use(session({
  secret: '82rwF9onDOGwX-4mMm',
  resave: false,
  saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: "apps.googleusercontent.com",
      clientSecret: "A4wgufk82rwF9onDOGwX-4mMm",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      //NOTE - Use the profile information to authenticate the user
      cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));


//NOTE - login user
app.get("/googlelogin", (req, res) => {
  res.render(path.join(__dirname, "./login.ejs"));
});

//NOTE - dashboard user
app.get("/dashboard", (req, res) => {
  //check if user is logged in
  if (req.isAuthenticated()) {
    return res.send({
      staus: 200,
      message: "Login successfully",
      data: {
        name: req.user._json.name,
        picture: req.user._json.picture,
        email: req.user._json.email,
        email_verified: req.user._json.email_verified,
        id: req.user._json.sub,
        login_status: true
      }
    })
  } else {
    res.redirect("/login");
  }
});

//NOTE - google auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//NOTE - google auth
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);


//NOTE - google logout
app.get("/googlelogout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/googlelogin");
    }
  });
});


// Middleware function to log API path and payload
const loggingMiddleware = (req, res, next) => {
  console.log(`API Path: ${req.path}`);
  console.log(`Payload: ${JSON.stringify(req.body)}`);
  next();
};

// // Apply loggingMiddleware to all incoming requests
app.use(loggingMiddleware);

//routers
app.use(adminRoute);

// app.listen(port, () => {
//   console.log(`Server Running On http://localhost:${port}`);
// });

server.listen(port, () => {
  console.log(`Server Running On http://localhost:${port}`);
});
