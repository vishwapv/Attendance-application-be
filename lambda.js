const serverlessExpress = require('@vendia/serverless-express')
const app = require('./sls')
exports.handler = serverlessExpress({ app })