var user = function() {
    var UserModel = require('../models/users'),
        list = function(req, res) {
            res.render('index');
        },
        register = function(req, res) {
            var schema = {
                'email': req.param('email'),
                'username': req.param('username'),
                'password': req.param('password')
            };
            if (req.param('password') === req.param('repassword')) {
                UserModel.saveUser(schema, function(e, user, result) {
                    if (e) {
                        console.log(e);
                        var obj = {
                            'email': schema.email,
                            'username': schema.username
                        };
                        if (e.code == 11000) {
                            var duplicatedValue = e.errmsg.match(/"\S*/);
                            obj.message = 'The ' + duplicatedValue[0] + ' is already taken. Please take another one!';
                        } else if (e.errors) {
                            for (var key in e.errors) {
                                if (e.errors.hasOwnProperty(key)) {
                                    obj.message = e.errors[key].message;
                                }
                            }
                        } else {
                            obj.message = 'Sorry, Something weired!'
                        }
                        res.render('register', obj);
                    } else {
                        req.session.user = schema.username;
                        res.redirect('/');
                    }

                })
            } else {
                var obj = {
                    'email': schema.email,
                    'username': schema.username,
                    'message': 'Passwords do not match!'
                }
                res.render('register', obj);
            }
        },
        login = function(req, res) {
            UserModel.findOne({
                '$or': [{
                    'email': req.param('email')
                }, {
                    'username': req.param('email')
                }]

                // password: req.param('password')
            }, function(err, doc) {
                if (err) {
                    res.render('login', {
                        'message': 'Sorry,Something gone wrong!'
                    });
                } else if (doc) {
                    if(!doc.authenticate(req.param('password'))){
                        res.render('login', {
                        'message': 'Password is wrong!'
                        })
                    }else{
                        req.session.user = doc.username;
                        res.redirect('/');
                    }
                } else {
                    res.render('login', {
                        'message': 'Email/Username  is wrong!'
                    })
                }
            })
        }
    logout = function(req, res) {
        if (req.session && req.session.user) {
            delete req.session.user
        }
        res.redirect('/login')
    }
    viewProfile = function(req, res) {
        if(!req.session.user) {
            res.render('login', {
                        'message': 'Please Login'
            });
            return;
        }
        UserModel.findOne({
                'username': req.session.user
            }, '-_id email username',
            function(err, doc) {
                if (err) {
                    res.render('login', {
                        'message': 'Sorry, We can\'t find a user!'
                    });
                } else {
                    doc.user = req.session.user;
                    res.render('profile', doc);
                }
            })
    }
    saveProfile = function(req, res) {
        var updateSchema = {
            'email': req.param('email'),
            'username': req.param('username')
        };
        UserModel.update({
                'username': req.session.user
            },
            updateSchema,
            function(e, resultSet) {
                console.log(e, resultSet);
                var obj = updateSchema;
                obj.user = req.session.user;
                if (e) {
                    obj.error = true;
                    if (e.code == 11000) {
                        var duplicatedValue = e.errmsg.match(/"\S*/);
                        obj.message = 'The ' + duplicatedValue[0] + ' is already taken. Please take another one!';
                    } else if (e.errors) {
                        for (var key in e.errors) {
                            if (e.errors.hasOwnProperty(key)) {
                                obj.message = e.errors[key].message;
                            }
                        }
                    } else {
                        obj.message = 'Sorry, Something weired!'
                    }
                } else {
                    delete req.session.user;
                    req.session.user = obj.username;
                    obj.success = true;
                    obj.message = 'Successfully updated your profile...';
                    obj.user = obj.username;
                }
                res.render('profile', obj)
            })
    }
    renderPasswordPage = function(req, res) {
        var obj = {};
        if (req.session && req.session.user) {
            obj.user = req.session.user
        }
        res.render('password', obj);
    }
    changePassword = function(req, res) {
        var obj = {};
        obj.user = req.session.user;
        if (req.param('password') != req.param('repassword')) {
            obj.error = true;
            obj.message = 'Two times the password is not consistent';
            res.render('password', obj);
        } else {
            UserModel.findOne({
                'username': req.session.user,
                'password': req.param('currentpassword')
            }, function(err, doc) {
                if (err) {
                	obj.error = true;
            		obj.message = 'Sorry,Something gone wrong!';
            		res.render('password', obj);
                } else if (doc) {
                    UserModel.update({
                            'username': req.session.user
                        },
                        {'password':req.param('password')},
                        function(e, resultSet) {
                            if (e) {
                                obj.error = true;
                                obj.message = 'Sorry, Something weired!'
                            } else {
                                obj.success = true;
                                obj.message = 'Successfully updated your password...';
                            }
                            res.render('password', obj);
                        })
                } else {
                    obj.error = true;
                    obj.message = 'Currentpassword is wrong!';
                	res.render('password', obj);
                }
            })
        }
        
    };
    return {
        register: register,
        login: login,
        logout: logout,
        viewProfile: viewProfile,
        profile: saveProfile,
        renderPasswordPage: renderPasswordPage,
        changePassword: changePassword
    }
}();

module.exports = user;
