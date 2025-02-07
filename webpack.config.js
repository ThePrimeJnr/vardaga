const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
// @ts-ignore
const CopyPlugin = require("copy-webpack-plugin");

dotenv.config();

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "chatbot.js",
    library: "ChatbotWidget",
    libraryTarget: "umd",
    globalObject: "this",
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          // @ts-ignore
          filter: (resourcePath) => {
            // Don't copy index.html as it's handled by HtmlWebpackPlugin
            return !resourcePath.includes("index.html");
          },
        },
      ],
    }),
  ],
  devServer: {
    allowedHosts: "all",
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/",
    },
    historyApiFallback: true,
    compress: true,
    port: 3000,
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    // @ts-ignore
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }

      // @ts-ignore
      devServer.app.use((req, res, next) => {
        try {
          decodeURIComponent(req.path);
          next();
        } catch (err) {
          res.status(400).send("Bad Request");
        }
      });

      return middlewares;
    },
  },
};
