module.exports = function(app, express) {
var router = express.Router();
var dispSettingObj = require('./../app/controllers/dispSetting/dispSetting.js');
router.post('/updateSettings',dispSettingObj.updateSettings);

router.get('/getSetting',dispSettingObj.getSetting);
router.post('/getDispalySettings',dispSettingObj.getDisplaySettings);

app.use('/dispSetting', router);
}