
// REQUIRED DEPENDENCIES
//////////////////////////////////////////////////////////////////////////////////////////
require('dotenv').config();
const cors = require('cors')
, express = require('express')
, bodyParser = require('body-parser')
, massive = require('massive')
, session = require('express-session')
, passport = require('passport')
, Auth0Strategy = require('passport-auth0')
const app = express();
const port  =  3300;
//////////////////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('build'));
//////////////////////////////////////////////////////////////////////////////////////////

// CONTROLLERS
//////////////////////////////////////////////////////////////////////////////////////////
const controller = require('./controllers/controller');
//////////////////////////////////////////////////////////////////////////////////////////

// DB CONNECTION
//////////////////////////////////////////////////////////////////////////////////////////
massive(process.env.CONNECTION_STRING)
.then( db => {
    app.set('db', db)
})
//////////////////////////////////////////////////////////////////////////////////////////

// REST ENDPOINTS
//////////////////////////////////////////////////////////////////////////////////////////
// GET
    // app.get('/api/profiles', contoller.getProfileData);
    app.get('/api/journal', controller.getJournalData);
    app.get('/api/goals', controller.getGoalsData);
// POST
    app.post('/api/profiles', controller.submitProfileData);
    app.post('/api/journal', controller.submitJournalData);
    app.post('/api/goals', controller.submitGoalData);
// PUT
// DELETE
    app.delete('/api/journal', controller.deleteJournalData);
    app.delete('/api/goals', controller.deleteGoalsData);
//////////////////////////////////////////////////////////////////////////////////////////

// AUTH0
//////////////////////////////////////////////////////////////////////////////////////////
passport.use( new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
        db.get_user([profile.identities[0].user_id]).then( user => {
            if (user[0]) {
                done(null, user[0].id)
            } else {
                db.create_user([
                    profile.emails[0].value,
                    profile.identities[0].user_id]).then( user => {
                        done(null, user[0].id)
                    })
            }})
      }))
passport.serializeUser(function(userId, done) {
    done(null, userId);
})
passport.deserializeUser( function( userId, done) {
    app.get('db').current_user(userId).then(user => {
            done(null, user[0])
    })
})
app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0',{
    successRedirect: `${process.env.FRONT_END_HOST}/#/dashboard`,
    failureRedirect: '/auth'
}))
app.get('/auth/logout', (req,res) => {
    req.logOut();
    res.redirect(302, process.env.AUTH_LOGOUT)
})
app.get('/auth/user',  passport.authenticate('auth0'), (req, res) => {
    req.app.get('db').current_user().then(user =>{
        res.status(200).send(user)
    }).catch((err) => {console.log(err)})
})
//////////////////////////////////////////////////////////////////////////////////////////

// PORT
//////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => console.log(`listening on port ${port}`));