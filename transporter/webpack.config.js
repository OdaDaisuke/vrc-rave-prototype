const path = require('path')
const Dotenv = require('dotenv-webpack')

const env = process.env.NODE_ENV

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
  },
  mode: env,
  target: ['web', 'es5'],
  entry: {
    'dj_app': './src/dj_app.js',
    'vj_app': './src/vj_app.js',
  },
  output: {
    filename: '[name].js',
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
    new Dotenv()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
