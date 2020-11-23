/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const parcel = require('../models/parcel');
const request = require('../models/request');

router.get('/', function(req, res) {
  //const chain_id = res.locals.chain_id;
  res.status(200);
  res.send([]);
});

router.get('/:parcel([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  parcel.getOne(chain_id, req.params.parcel)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0]);
      } else {
        res.status(404);
        res.send('not found');
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.get('/:parcel([a-fA-F0-9]+)/requests', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  request.getList(chain_id, req.params.parcel, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
