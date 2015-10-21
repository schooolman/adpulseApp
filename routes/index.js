var express = require('express');
var router = express.Router();
var twitter = require('twitter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AD Pulse' });
});

module.exports = router;
