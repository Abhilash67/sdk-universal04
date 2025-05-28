const path = require("path");

module.exports = {
  entry: "./src/index.js", // or your entry file
  output: {
    filename: "GMF-CIAM-sdk.umd.js",
    path: path.resolve(__dirname, "dist"),
    library: "GMFCIAMAuth", // Changed from UniversalAuth to avoid conflicts
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