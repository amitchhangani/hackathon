var express = require('express');
var router = express.Router();
var city = require('./../app/controllers/cities.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fetchCity',city.fetch);

router.post('/createCity',city.create);



module.exports = router;
