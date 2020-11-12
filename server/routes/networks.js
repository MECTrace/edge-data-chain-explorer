/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const network = require('../models/network');

/**
 * @swagger
 * /networks:
 *   get:
 *     description: Get available network list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Available network list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chain_id:
 *                     type: string
 */
router.get('/', function(req, res) {
  network.getList()
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
