const path = require("path");

module.exports = {
  entry: "./src/index.js", // or your entry file
  output: {
    filename: "universal-sdk.umd.js",
    path: path.resolve(__dirname, "dist"),
    library: "UniversalAuth",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
