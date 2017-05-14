var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var SuperLogin = require('superlogin');

var app = express();
app.set('port', process.env.PORT || 4000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var config = {
    dbServer: {
        protocol: 'https://',
        host: 'couchdb-77cd9f.smileupps.com',
        user: 'admin',
        password: '162f3130f0f5',
        userDB: 'sl-users',
        couchAuthDB: '_users'
    },
    mailer: {
        fromEmail: 'gmail.user@gmail.com',
        options: {
            service: 'Gmail',
            auth: {
                user: 'gmail.user@gmail.com',
                pass: 'userpass'
            }
        }
    },
    userDBs: {
        defaultDBs: {
            private: ['supertest']
        },
        // If you specify default roles here (and use CouchDB not Cloudant) then these will be added to the _security object
        // of each new user database created. This is useful for preventing anonymous access.
        defaultSecurityRoles: {
            admins: ['$slAdmin'],
            members: []
        }
    }
}

// Initialize SuperLogin
var superlogin = new SuperLogin(config);

// Mount SuperLogin's routes to our app
app.use('/auth', superlogin.router);

// // app.get('/admin', superlogin.requireAuth, superlogin.requireRole('admin'),
// //     function(req, res) {
// //         res.send('Welcome Admin');
// //     });
//
// http.createServer(app).listen(app.get('port'));