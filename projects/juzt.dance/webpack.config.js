const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (_, argv) => {
  console.log("====================================");
  console.log("Webpack Config", argv.mode);
  console.log("Environment", process.env.NODE_ENV);
  console.log("====================================");
  return {
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      alias: {
        "@cairnsgames": path.resolve(__dirname, "../../src/packages"),
      },
    },

    devServer: {
      port: 3003,
      historyApiFallback: true,
    },

    module: {
      rules: [
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                modules: {
                  mode: "icss",
                },
              },
            },
            { loader: "postcss-loader" },
            { loader: "sass-loader" },
          ],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",

          options: {
            configFile: path.resolve(__dirname, '.babelrc') // Specify .babelrc
          }

          },
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "Cairnsgames",
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {},
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new CopyPlugin({
        patterns: [
          { from: "./public/", to: "." },
          { from: "./public/images", to: "./images" },
        ],
      }),
      new Dotenv({
        path:
        argv.mode === "production"
            ? "./.env.production"
            : "./.env.development",
      }),
    ],
  };
};
