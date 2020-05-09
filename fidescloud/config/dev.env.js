'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
console.log(process.env.npm_package_version)
// http://211.152.32.173
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL: '"http://demo.fidescloud.com"',
  // BASE_API: '"http://demo.fidescloud.com/fides/backend"'
  BASE_URL: '"https://fctest.accuat.com"',
  BASE_API: '"https://fcdev.accuat.com/fides/backend"'
})
