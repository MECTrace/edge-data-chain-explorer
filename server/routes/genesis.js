/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const db = require('../db/db');

/**
 * @swagger
 * /chain/{chain_id}/genesis:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *   get:
 *     tags:
 *       - chain
 *     description: Get genesis document of the chain
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Genesis document
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var query_str;
  var query_var;
  query_str = "SELECT `genesis` FROM `c_genesis` WHERE (`chain_id` = ?)";
  query_var = [chain_id];
  db.query(query_str, query_var, function (err, rows, fields) {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    if (rows.length > 0) {
      res.status(200);
      // row.genesis is of string type. We need to parse it to an object to
      // make the response content type to be handled automatically.
      res.send(JSON.parse(rows[0].genesis));
    } else {
      res.status(404);
      res.send('not found');
    }
  });
});

module.exports = router;
