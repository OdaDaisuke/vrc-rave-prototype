const path = require('path')
const Dotenv = require('dotenv-webpack')

const env = process.env.NODE_ENV

module.exports = {
  mode: env,
  target: ['web', 'es5'],
  entry: './src/app.js',
  output: {
      filename: 'app.js',
      path: path.join(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new Dotenv({ systemvars: true })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
