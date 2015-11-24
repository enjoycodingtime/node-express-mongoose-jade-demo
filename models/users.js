var Users = function () {
	'use  strict';
	var mongoose = require('mongoose'),
		validateEmail = function (email) {
			var re= /\S+@\S+\.\S+/;
			return re.test(email);
		},
		getMinValidator = function (val) {
			return function(v) {
				if( v && v.length) {
					return v.length >= val;
				}
			}
		},
		getMaxValidator = function (val) {
			return function(v) {
				if( v && v.length) {
					return v.length <= val;
				}
			}
		},
		Schema = mongoose.Schema,
		userSchema = new Schema({
			email: {
				type:String,
				required: true,
				index: {unique: true},
				validate: [
					{ validator: validateEmail, msg: 'Email should be valid!'},
					{ validator: getMinValidator(6), msg: 'Email should have minimum length of 6 chars'},
					{ validator: getMaxValidator(16), msg: 'Email should have maximum length of 16 chars'}
				],
			},
			username: {
				type: String,
				required: true,
				index: { unique: true},
				validate: [
					{ validator: getMinValidator(4), msg: 'Username should have minimum length of 4 chars'},
					{ validator: getMaxValidator(16), msg: 'Username should have maximum length of 16 chars'}
				]
			},
			password: {
				type: String,
				required: true,
				validate: [
					{ validator: getMinValidator(6), msg: 'Password should have minimum length of 6 chars'},
					{ validator: getMaxValidator(16), msg: 'Password should have maximum length of 16 chars'}
				]
			},
			created: { type: Date, 'default' : Date.now}
		});

		userSchema.statics.saveUser = function (schema, cb) {
			this.create(schema, cb);
		};

		return mongoose.model('User', userSchema);
}();

module.exports = Users;