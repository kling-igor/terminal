import { join } from "path";
import HTMLWebpackPlugin from "html-webpack-plugin";
import packagejson from "./package.json";
import nodeExternals from "webpack-node-externals";

module.exports = env => ({
  target: "node",
  entry: join(__dirname, "src", "renderer", "index.js"),
  output: {
    filename: "index.js",
    path: join(__dirname, "app")
  },

  watch: false,

  node: {
    __dirname: false
  },

  watchOptions: {
    aggregateTimeout: 100
  },

  externals: [nodeExternals()],

  devtool: env.dev ? "source-map" : false,

  resolve: {
    extensions: ["*", ".js", ".jsx", ".css"]
  },

  plugins: [
    new HTMLWebpackPlugin({
      title: packagejson.description,
      filename: "index.html",
      template: join(__dirname, "src", "renderer", "index.html"),
      inject: "body",
      hash: true,
      debug: env.dev
    })
  ],

  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        include: [join(__dirname, "src"), join(__dirname, "src", "renderer")],
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      }
    ]
  }
});
