module.exports.reqBasic = function *(next){
	try {
		yield next;
	}
	catch (err) {
		if (401 == err.status) {
			this.status = 401;
			this.set('WWW-Authenticate', 'Basic');
			this.body = 'Nope... you need to authenticate first. With a proper user!';
		}
		else {
			throw err;
		}
	}
};