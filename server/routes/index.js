/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
var networksRouter = require('./networks');
var chainRouter = require('./chain');

router.param('chain_id', function(req, res, next, val) {
  res.locals.chain_id = val;
  next();
});

/**
 * @swagger
 * /:
 *   get:
 *     description: Get welcome message
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get('/', function(req, res, next) {
  res.send(JSON.stringify({
    name: 'AMO blockchain explorer support server',
  }));
});

router.use('/networks', networksRouter);
router.use('/chain/:chain_id([a-zA-Z0-9-]+)', chainRouter);

module.exports = router;
