//My Parse API...
// Variables....
var Parse = require('node-parse-api').Parse;
var options = {
    app_id: 'd8DVPfw910FyMIlUIroB41Yr7bm1p2MwiDk6yYo9',
    api_key: 'KqeF5L73PN6r9OvdXBflEYNwMHViD5Bmd4LuP4nH' // master_key:'...' could be used too
}

var app_parse = new Parse(options);
console.log(app_parse);

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var util = require('util');
var md5 = require('MD5');
var app_express = express();
var sess;
var http = require('http');

app_express.set('views', path.join(__dirname, 'views'));
app_express.set('view engine', 'ejs');
// required for passport
app_express.use(session({secret: 'boomdsome20'})); // session secret
app_express.use(passport.initialize());
app_express.use(passport.session());
app_express.use(flash());
//middleware
app_express.use(bodyParser.urlencoded({extended: false}));
app_express.use(express.static(path.join(__dirname, 'bower_components/bootstrap/dist/css')));
app_express.use(expressValidator([options]));
app_express.use(cookieParser());
// Register request handlers for each route.
// -----------------------------------------------------------------------
//Client Side page
//app_express.get('/boom/:gse', function(req, res) {
//    console.log(req.params.gse);
//    sess = req.session;
//    res.render('index', {data: 0, sess: sess.email});
//});
//------------------------------------------------------------------------
//Login GET
app_express.get('/', function (req, res) {
    sess = req.session;
    if (sess.logged) {
        res.redirect('/users');
    }
    res.render('content/adminlogin/adminlogin', {data: 0, msg: 0});
});
//Post
app_express.post('/', function (req, res) {
    sess = req.session;
    req.assert('email', 'E-mail Address is required').notEmpty();
    req.assert('email', 'Valid email is required').isEmail();
    req.assert('password', 'Password is required').notEmpty();
    var password = req.body.password;
    var email = req.body.email;
    var errors = req.validationErrors();
    if (errors) {
        res.render('content/adminlogin/adminlogin', {data: errors, msg: 0});
        return;
    }
    app_parse.findMany('User', {email: email, password: md5(password), status: 'active'}, function (err, response) {
        if (response.results.length == 0) {
            res.render('content/adminlogin/adminlogin', {data: 0, msg: 'Inactive account or account is not exist. Please wait the admin site to review your account.'});
        } else {
            sess.logged = 'true';
            sess.email = response.results[0].email;
            sess.name = response.results[0].name;
            sess.username = response.results[0].username;
            sess.status = response.results[0].status;
            sess.role = response.results[0].role;
            sess.created = response.results[0].createdAt;
            sess.objid = response.results[0].objectId;
            if (response.results[0].role == "administrator") {
                res.redirect('/users');
            } else {
                res.redirect('/books');
            }

        }
    });
});
//Logout
app_express.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });
});
//Admin users table GET
//Sign Up GET
app_express.get('/signup', function (req, res) {
    sess = req.session;
    if (sess.logged) {
        res.redirect('/users');
    }
    res.render('content/signup/register', {page: 'signup', data: 0, succ: 0, msg: 0});
});
//Post
app_express.post('/signup', function (req, res) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('username', 'Username is required').notEmpty();
    req.assert('password', 'Password is required').notEmpty();
    req.assert('password2', 'Confirm Password is required').notEmpty();
    req.assert('password2', 'Passwords do not match').equals(req.body.password);
    req.assert('email', 'Email is required').notEmpty();
    req.assert('dob', 'Date of Birth is required').notEmpty();
    req.assert('email', 'Valid email is required').isEmail();
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var getgender = req.body.gender;
    var dob = req.body.dob;
    var errors = req.validationErrors();
    if (errors) {
        res.render('content/signup/register', {page: 'signup', data: errors, succ: 0, msg: 0});
        return;
    }
    //if the email is already exist or not exist on db.
    app_parse.findMany('User', {email: email}, function (err, response) {
        if (response.results.length == 0) {
            app_parse.insert('User',
                    {
                        username: username,
                        password: md5(password),
                        email: email,
                        name: name,
                        gender: getgender,
                        dateOfbirth: dob,
                        status: 'pending',
                        role: 'member'
                    }, function (err, response) {
                console.log(response);
            });
            res.render('content/signup/register', {page: 'signup', data: 0, succ: 1, msg: 0});
        } else {
            res.render('content/signup/register', {page: 'signup', data: 0, succ: 0, msg: 'E-mail Address is already exist.'});
        }
    });
});
//Admin Login GET------------------------------------------------------------
//app_express.get('/', function(req, res) {
//    var getData = {data: 0};
//    res.render('content/adminlogin/adminlogin', getData);
//});
//Post
//app_express.post('/', function(req, res) {
//    sess = req.session;
//    req.assert('email', 'E-email Address is required').notEmpty();
//    req.assert('password', 'Password is required').notEmpty();
//    var errors = req.validationErrors();
//    if (errors) {
//        var getData = {data: errors};
//        res.render('content/adminlogin/adminlogin', getData);
//        return;
//    }
//    res.redirect('/adminlogin');
//});
//-----------------------------------------------------------------------------
//Admin users table GET
app_express.get('/users', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    if (sess.role != "administrator") {
        res.redirect('/books');
    }
    app_parse.findMany('User', '', function (err, response) {
        res.render('content/users/users', {page: 'users', title: 'users', userdata: response, setdata: setdatasess});
    });
});
app_express.get('/usersedit', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    app_parse.find('User', sess.usersid, function (err, response) {
        console.log(response.name);
        res.render('content/users/usersedit', {data: 0, succ: 0, page: 'usersedit', title: 'users', setdata: setdatasess, res: response});
    });
});
app_express.post('/usersedit', function (req, res) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('username', 'Username is required').notEmpty();
    req.assert('cnpassword', 'Passwords do not match').equals(req.body.password);
    var password = req.body.password;
    var cpassword = req.body.cnpassword;
    if (password != "") {
        if (cpassword == "") {
            req.assert('cnpassword', 'Confirm Password is required').notEmpty();
        }
    }
    req.assert('dob', 'Date of Birthday is required').notEmpty();
    req.assert('role', 'Role is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Valid email is required').isEmail();
    req.assert('status', 'Status is required').notEmpty();
    var username = req.body.username;
    var email = req.body.email;
    var name = req.body.name;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var address = req.body.address;
    var role = req.body.role;
    var getstatus = req.body.status;
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    var errors = req.validationErrors();
    if (errors) {
        app_parse.find('User', sess.usersid, function (err, response) {
            res.render('content/users/usersedit', {data: errors, succ: 0, page: 'usersedit', title: 'users', setdata: setdatasess, res: response});
        });
        return;
    }
    if (password != "") {
        if (cpassword != "") {
            var usersupdate = {
                username: username,
                email: email,
                name: name,
                password: md5(password),
                gender: gender,
                role: role,
                dateOfbirth: dob,
                address: address,
                status: getstatus
            };
        }
    } else {
        var usersupdate = {
            username: username,
            email: email,
            name: name,
            gender: gender,
            role: role,
            dateOfbirth: dob,
            address: address,
            status: getstatus
        };
    }
    app_parse.update('User', sess.usersid,
            usersupdate, function (err, response) {
                console.log(response);
            });
    app_parse.find('User', sess.usersid, function (err, response) {
        res.render('content/users/usersedit', {data: 0, succ: 1, page: 'usersedit', title: 'users', setdata: setdatasess, res: response});
    });
});
app_express.get('/usersadd', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    res.render('content/users/usersadd', {data: 0, msg: 0, succ: 0, page: 'usersadd', title: 'users', setdata: setdatasess});
});
app_express.post('/usersadd', function (req, res) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('username', 'Username is required').notEmpty();
    req.assert('password', 'Password is required').notEmpty();
    req.assert('confirm_password', 'Confirm Password is required').notEmpty();
    req.assert('confirm_password', 'Passwords do not match').equals(req.body.password);
    req.assert('dob', 'Date of Birthday is required').notEmpty();
    req.assert('role', 'Role is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Valid email is required').isEmail();
    req.assert('status', 'Status is required').notEmpty();
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var address = req.body.address;
    var role = req.body.role;
    var getstatus = req.body.status;
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    var errors = req.validationErrors();
    if (errors) {
        res.render('content/users/usersadd', {data: errors, msg: 0, succ: 0, page: 'usersadd', title: 'users', setdata: setdatasess});
        return;
    }

    //if the email is already exist or not exist on db.
    app_parse.findMany('User', {email: email}, function (err, response) {
        if (response.results.length == 0) {
            app_parse.insert('User',
                    {
                        username: username,
                        password: md5(password),
                        email: email,
                        name: name,
                        gender: gender,
                        role: role,
                        dateOfbirth: dob,
                        address: address,
                        status: getstatus
                    }, function (err, response) {
                console.log(response);
            });
            res.render('content/users/usersadd', {data: 0, succ: 1, page: 'usersadd', title: 'users', setdata: setdatasess, msg: 0});
        } else {
            res.render('content/users/usersadd', {data: 0, succ: 0, page: 'usersadd', title: 'users', setdata: setdatasess, msg: 'E-mail Address is already exist.'});
        }
    });


});
app_express.get('/users/delete/:id', function (req, res) {
    var str = req.params.id;
    var getstr = str.split(',');
    for (var g = 0; g < getstr.length; g++) {
        if (getstr[g] != "") {
            console.log(getstr[g]);
            app_parse.delete('User', getstr[g], function (err) {
                console.log(err);
            });
        }
    }
    res.redirect('/users');
});
app_express.get('/uedit/:id', function (req, res) {
    sess = req.session;
    sess.usersid = req.params.id;
    res.redirect('/usersedit');
});
//******************************************************************************
//Admin  List of Books crud
var getmyrole;
app_express.get('/books', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    if (sess.role != "administrator") {
        var role = {author: sess.objid};
    } else {
        var role = '';
    }
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    console.log(getmyrole);
    app_parse.findMany('Books', role, function (err, response) {
        res.render('content/books/books', {page: 'books', title: 'books', booksdata: response, setdata: setdatasess, myrole: getmyrole});
    });

});
app_express.get('/books/delete/:id', function (req, res) {
    var str = req.params.id;
    var getstr = str.split(',');
    for (var g = 0; g < getstr.length; g++) {
        if (getstr[g] != "") {
            console.log(getstr[g]);
            app_parse.delete('Books', getstr[g], function (err) {
                console.log(err);
            });
        }
    }
    res.redirect('/books');
});
app_express.get('/booksadd', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    res.render('content/books/booksadd', {data: 0, succ: 0, page: 'booksadd', title: 'users', setdata: setdatasess, myrole: getmyrole});
});
app_express.post('/booksadd', function (req, res) {
    req.assert('author', 'Author is required').notEmpty();
    req.assert('description', 'Description is required').notEmpty();
    req.assert('pd', 'Publish Date is required').notEmpty();
    req.assert('books', 'Title of Books is required').notEmpty();
    var author = req.body.author;
    var description = req.body.description;
    var nameofauthor = req.body.nameofauthor;
    var pd = req.body.pd;
    var books = req.body.books;
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    var errors = req.validationErrors();
    if (errors) {
        res.render('content/books/booksadd', {data: errors, succ: 0, page: 'booksadd', title: 'books', setdata: setdatasess});
        return;
    }
    app_parse.insert('Books',
            {
                author: author,
                description: description,
                publishDate: pd,
                title: books,
                nameOfauthor: nameofauthor
            }, function (err, response) {
        console.log(err);
        console.log(response);
    });
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    res.render('content/books/booksadd', {data: 0, succ: 1, page: 'booksadd', title: 'books', setdata: setdatasess, myrole: getmyrole});
});
app_express.get('/edit/:id', function (req, res) {
    sess = req.session;
    sess.uid = req.params.id;
    res.redirect('/booksedit');
});
app_express.get('/booksedit', function (req, res) {
    sess = req.session;
    console.log(sess.uid);
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    app_parse.find('Books', sess.uid, function (err, response) {
        console.log(response);
        res.render('content/books/booksedit', {data: 0, succ: 0, page: 'booksedit', title: 'books', setdata: setdatasess, res: response, myrole: getmyrole});
    });
});
app_express.post('/booksedit', function (req, res) {
    req.assert('author', 'Author is required').notEmpty();
    req.assert('description', 'Description is required').notEmpty();
    req.assert('pd', 'Publish Date is required').notEmpty();
    req.assert('books', 'Title of Books is required').notEmpty();
    var author = req.body.author;
    var nameofauthor = req.body.nameofauthor;
    var description = req.body.description;
    var pd = req.body.pd;
    var books = req.body.books;
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    var errors = req.validationErrors();
    if (errors) {
        app_parse.find('Books', sess.uid, function (err, response) {
            res.render('content/books/booksedit', {data: errors, succ: 0, page: 'booksedit', title: 'books', setdata: setdatasess, res: response});
        });
        return;
    }
    app_parse.update('Books', sess.uid,
            {
                author: author,
                description: description,
                publishDate: pd,
                title: books,
                nameOfauthor: nameofauthor
            }, function (err, response) {
        console.log(err);
        console.log(response);
    });
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    app_parse.find('Books', sess.uid, function (err, response) {
        res.render('content/books/booksedit', {data: 0, succ: 1, page: 'booksedit', title: 'books', setdata: setdatasess, res: response, myrole: getmyrole});
    });
});

app_express.get('/searchbooks', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    var searchbooks = req.body.search;
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    app_parse.findMany('Books', searchbooks, function (error, response) {
        res.render('content/search/search', {search: 0, page: 'searchbooks', title: 'book search enginge', booksdata: response, setdata: setdatasess, myrole: getmyrole});
    });
});
app_express.post('/searchbooks', function (req, res) {
    sess = req.session;
    var setdatasess = [{logged: sess.logged,
            email: sess.email,
            name: sess.name,
            username: sess.username,
            status: sess.status,
            objids: sess.objid,
            role: sess.role,
            created: sess.created
        }];
    if (!sess.logged) {
        res.redirect('/');
    }
    var searchbooks = req.body.search;
    app_parse.findMany('User', '', function (errp, resp) {
        getmyrole = resp;
    });
    app_parse.findMany('Books', {title: escape(searchbooks)}, function (error, response) {
        console.log(response);
        res.render('content/search/search', {search: 1, page: 'searchbooks', title: 'book search enginge', booksdata: response, setdata: setdatasess, myrole: getmyrole});
    });
});

    var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
     var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

http.createServer(app_express).listen(port, ipaddress);
