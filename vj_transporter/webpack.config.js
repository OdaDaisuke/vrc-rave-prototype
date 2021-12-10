const path = require('path')

const env = process.env.NODE_ENV

module.exports = {
  mode: env,
  entry: './src/app.js',
  output: {
      filename: 'app.js',
      path: path.join(__dirname, 'public')
  },
}
