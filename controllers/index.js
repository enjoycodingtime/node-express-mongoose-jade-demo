var home = function () {
	var register = function (req, res) {
		res.render('register',{title:'Register'});
	};
	var index = function (req, res) {
		var obj = {
			title:'Home'
		};
		if(req.session && req.session.user) {
			obj.user = req.session.user
		}
		res.render('index',obj)
	};
	var login = function (req, res) {
		res.render('login')
	};
	return {
		renderRegisterPage: register,
		index: index,
		login: login
	};
}();
module.exports = home;