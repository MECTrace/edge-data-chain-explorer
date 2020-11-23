/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const draft = require('../models/draft');
const stat = require('../models/stat');

/**
 * @swagger
 * definitions:
 *   DraftId:
 *     name: draft_id
 *     in: path
 *     description: draft ID
 *     required: true
 *     schema:
 *       type: integer
 *     style: simple
 *   DraftInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       draft_id:
 *         type: integer
 *       proposer:
 *         type: string
 *       config:
 *         type: string
 *         description: marshalled JSON object
 *       desc:
 *         type: string
 *       open_count:
 *         type: integer
 *       close_count:
 *         type: integer
 *       apply_count:
 *         type: integer
 *       deposit:
 *         type: string
 *         description: quoted decimal number
 *       proposed_at:
 *         type: integer
 *       closed_at:
 *         type: integer
 *       applied_at:
 *         type: integer
 *       tally_approve:
 *         type: string
 *         description: quoted decimal number
 *       tally_reject:
 *         type: string
 *         description: quoted decimal number
 *       tally_quorum:
 *         type: string
 *         description: quoted decimal number
 */

/**
 * @swagger
 * /chain/{chain_id}/drafts:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - name: anchor
 *       in: query
 *       description: anchor id to query (0 value means last draft)
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: from
 *       in: query
 *       description: offset from the result
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: num
 *       in: query
 *       description: number of items to retrieve
 *       schema:
 *         type: integer
 *         default: 20
 *   get:
 *     tags:
 *       - governance
 *     description: Get draft list in descending order of draft id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Draft list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DraftInfo'
 *
 * /chain/{chain_id}/drafts?stat:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *   get:
 *     tags:
 *       - governance
 *     description: Get draft stat
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Draft stat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 num_drafts:
 *                   type: integer
 *                 num_passed:
 *                   type: integer
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    stat.getDraftStat(chain_id)
      .then((row) => {
        res.status(200);
        res.send(row);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var anchor = req.query.anchor || 0;
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    draft.getList(chain_id, anchor, from, num)
      .then((rows) => {
        res.status(200);
        res.send(rows);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  }
});

/**
 * @swagger
 * /chain/{chain_id}/drafts/{draft_id}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/DraftId'
 *   get:
 *     tags:
 *       - governance
 *     description: Get draft info by draft ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Draft info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/DraftInfo'
 */
router.get('/:draft_id([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const draft_id = req.params.draft_id;
  draft.getOne(chain_id, draft_id)
    .then((row) => {
      if (row) {
        res.status(200);
        res.send(row);
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

/**
 * @swagger
 * /chain/{chain_id}/drafts/{draft_id}/votes:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/DraftId'
 *     - name: absent
 *       in: query
 *       description: when supplied(without value), retrieve absent votes
 *       allowEmptyValue: true
 *   get:
 *     tags:
 *       - governance
 *     description: Get votes on this draft
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Vote list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chain_id:
 *                     type: string
 *                   draft_id:
 *                     type: integer
 *                   voter:
 *                     type: string
 *                   approve:
 *                     type: boolean
 *                     nullable: true
 *                   tally:
 *                     type: string
 *                     description: quoted decimal number
 */
router.get('/:draft_id([0-9]+)/votes', function(req, res) {
  const chain_id = res.locals.chain_id;
  const draft_id = req.params.draft_id;
  var prom;
  if ('absent' in req.query) {
    prom = draft.getVotesAbsent(chain_id, draft_id);
  } else {
    prom = draft.getVotes(chain_id, draft_id);
  }
  prom.then((rows) => {
    res.status(200);
    res.send(rows); // can send empty list
  })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
