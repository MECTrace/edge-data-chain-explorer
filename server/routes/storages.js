/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const storage = require('../models/storage');

/**
 * @swagger
 * definitions:
 *   StorageId:
 *     name: storage_id
 *     in: path
 *     description: storage id to inspect
 *     required: true
 *     schema:
 *       type: integer
 *     style: simple
 *   StorageInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       storage_id:
 *         type: integer
 *       url:
 *         type: string
 *       registration_fee:
 *         type: string
 *         description: quoted decimal number
 *       hosting_fee:
 *         type: string
 *         description: quoted decimal number
 *       owner:
 *         type: string
 *       active:
 *         type: boolean
 */

/**
 * @swagger
 * /chain/{chain_id}/storages:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *   get:
 *     tags:
 *       - data trade
 *     description: Get storage list in descending order of id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Storage list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/StorageInfo'
 */
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

/**
 * @swagger
 * /chain/{chain_id}/storages/{storage_id}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/StorageId'
 *   get:
 *     tags:
 *       - data trade
 *     description: Get storage info by storage id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Storage info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/StorageInfo'
 *       404:
 *         description: Storage not found
 */
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
