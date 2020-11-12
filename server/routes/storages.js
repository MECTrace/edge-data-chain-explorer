/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const storage = require('../models/storage');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  storage.getList(chain_id)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.get('/:storage([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  storage.getOne(chain_id, req.params.storage)
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

module.exports = router;
