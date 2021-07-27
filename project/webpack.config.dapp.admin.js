const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, "src/dappadmin")],
  output: {
    path: path.join(__dirname, "prod/dappadmin"),
    filename: "bundle.admin.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.join(__dirname, "src/dappadmin/index.html")
    })
  ],
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    contentBase: [
      path.join(__dirname, "src/dappadmin"),
    ],
    port: 8001,
    stats: "minimal"
  }
};
