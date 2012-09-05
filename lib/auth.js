var sha1 = require('crypto');
var auth_user = {login: 'caio', 
				 password: '171e1242c3e2a8b908516985ff56e02f09ae2857'};

var crypto = function(password){
	return sha1.createHash('sha1').update(password).digest('hex');
};

module.exports.validating = function(user){
	if(user && user.login && user.password)
		if(user.login === auth_user.login)
			if(crypto(user.password) === auth_user.password)
				return true;
			return false;
		return false;
	return false;
};
