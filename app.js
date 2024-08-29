if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// external files, libraries, and frameworks
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js'); 
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const signupRouter = require('./routes/user.js');

const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//for User
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user.js');
const { Console } = require('console');

//altasDB URl
const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:secret
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOpt = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

// server code
const app = express();

// middlewares 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to get params data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve public directory
app.use(express.static(path.join(__dirname, '/public')));

// method override (for DELETE, PATCH, etc.)
app.use(methodOverride("_method"));

// EJS Mate
app.engine('ejs', ejsMate);


// Connect to MongoDB
async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

//for session
app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//all routes
app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter );
app.use("/", signupRouter);

// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error/error.ejs", { message });
});

// Start Server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
