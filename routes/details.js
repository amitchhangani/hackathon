
var middleware = require("./../app/policies/auth");
module.exports = function(app, express) {
var router = express.Router();
var detailObj = require('./../app/controllers/details/details.js');
router.post('/addDetail',[middleware.checkAdminPermission(null) ],detailObj.addDetail);
router.post('/getDetail',detailObj.getDetail);
router.post('/getShopDetail',detailObj.getShopDetail);
router.post('/deleteDetail', detailObj.deleteDetail);
router.post('/addGroup',[middleware.checkPayment(null) ], detailObj.addGroup);
router.post('/bulkExport',[middleware.checkPayment(null) ], detailObj.bulkExport);
router.post('/loadGroups',detailObj.fetchGroups);
router.post('/deleteGroup',detailObj.remove);
router.post('/editGroup',[middleware.checkPayment(null) ],detailObj.editGroup);
router.post('/getAlllocations',[middleware.addLocation(null) ],detailObj.getAlllocations);
router.post('/searchedLocations',detailObj.searchedPlaces);
app.use('/details', router);
}