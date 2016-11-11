var middleware = require("./../app/policies/auth");
module.exports = function(app, express) {
	var router = express.Router();
	var uploadObj = require('./../app/controllers/uploads/uploads.js');

	router.post('/uploads',[middleware.checkAdminPermission(null) ], uploadObj.uploads);
	

	app.use('/uploads', router);
}