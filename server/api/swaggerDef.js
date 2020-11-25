module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'AMO blockchain explorer API',
    contact: {
      name: 'AMO Labs dev team',
      url: 'https://github.com/amolabs',
      email: 'dev@amolabs.io',
    },
    license: {
      name: 'Apache 2.0',
    },
    version: '2.0',
  },
  tags: [
    {
      name: 'default',
    },
    {
      name: 'chain',
    },
    {
      name: 'blocks',
    },
    {
      name: 'txs',
      description: 'transactions',
    },
    {
      name: 'accounts',
    },
    {
      name: 'validators',
    },
    {
      name: 'governance',
      description: 'drafts and votes',
    },
    {
      name: 'incentives',
    },
    {
      name: 'penalties',
    },
    {
      name: 'data trade',
    },
    {
      name: 'nodes',
      description: 'blockchain nodes',
    },
  ],
  basePath: '/',
}
