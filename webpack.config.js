const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
// Check folder 'fonts' - exists it is or not;
const hasFonts = fs.existsSync(path.resolve(__dirname, "src/fonts"));
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.svg$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html", inject: "body" }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["build"],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/images"), to: "images" },
        ...(hasFonts
          ? [{ from: path.resolve(__dirname, "src/fonts"), to: "fonts" }]
          : []),
      ],
    }),
  ],
  devServer: {
    compress: true,
    open: true,
    client: {
      logging: "error",
    },
    watchFiles: ["src/**/*"],
  },
};
