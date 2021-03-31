const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('mi ultra hiper secreto'));

app.use(session({
    secret: 'mi ultra hiper secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function (username, password, done) {
    if (username === "ccharfuUser" && password === "123456")
        return done(null, { id: 1, name: "ccharfu" });
    done(null, false);
}));

// Serializacion
passport.serializeUser(function (user, done) {
    done(null, user.id);
})

// Deserializacion
passport.deserializeUser(function (id, done) {
    done(null, { id: 1, name: "ccharfu" });
})

app.set('view engine', 'ejs');

app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}, (req, res) => {
    // Si ya iniciamos mostramos bienvenida

    // Si no hemos iniciado sesion redireccionamos a /login
    res.send("Hola que hace");
})

app.get("/login", (req, res) => {
    // Mostramos el formulario de login
    res.render("login");
})

app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.listen(8080, () => console.log("Server started"));