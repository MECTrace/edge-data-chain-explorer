/* vim: set sw=2 ts=2 expandtab : */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDef.js');
const swaggerOptions = {
  swaggerDefinition,
  apis: [
    'routes/index.js',
    'routes/networks.js',
    'routes/chain.js',
    'routes/genesis.js',
    'routes/app_config.js',
    'routes/blocks.js',
    'routes/txs.js',
    'routes/accounts.js',
    'routes/validators.js',
    'routes/drafts.js',
    'routes/parcels.js',
    'routes/storages.js',
    'routes/nodes.js',
    'routes/incentives.js',
    'routes/penalties.js',
  ]
}
const swaggerSpec = swaggerJSDoc(swaggerOptions);

const indexRouter = require('./routes/index');

var app = express();

app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*', optionsSuccessStatus: 200}));

app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
