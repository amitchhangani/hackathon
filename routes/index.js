var express = require('express');
var router = express.Router();
var city = require('./../app/controllers/cities.js');
var dumpYard = require('./../app/controllers/dumpYards.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fetchCity',city.fetch);

router.post('/createCity',city.create);



router.get('/fetchDumpYards',dumpYard.fetch);

router.post('/createDumpYard',dumpYard.create);

router.delete('/deleteDumpYard/:dumpYardId',dumpYard.delete);

module.exports = router;
