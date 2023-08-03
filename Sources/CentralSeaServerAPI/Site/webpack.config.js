const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
    entry: {
        home: "./src/home.ts",
        maps: "./src/maps.ts",
        info: "./src/info.ts",
        market: "./src/market.ts",
        update: "./src/update.ts",
        navigation: "./src/navigation.ts"
    },
    output: {
        path: path.resolve(__dirname, "static"),
        // publicPath: "",
        publicPath: "/CentralSeaServer/static/",
        clean: true
    },
    devServer: {
        open: true,
        host: "localhost"
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: "handlebars-loader"
            },
            {
                test: /\.ts(x)?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader"
                ]
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif)$/i,
              type: "asset/resource",
            }
        ]
    },
    resolve: {
        extensions: [
            ".tsx",
            ".ts",
            ".js",
            ".hbs"
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Home",
            filename: "index.html",
            template: "./src/home.hbs",
            chunks: ["home", "navigation"]
        }),
        new HtmlWebpackPlugin({
            title: "Market",
            filename: "market.html",
            template: "./src/market.hbs",
            chunks: ["market", "navigation"]
        }),
        new HtmlWebpackPlugin({
            title: "Maps",
            filename: "maps.html",
            template: "./src/maps.hbs",
            chunks: ["maps", "navigation"]
        }),
        new HtmlWebpackPlugin({
            title: "Info",
            filename: "info.html",
            template: "./src/info.hbs",
            chunks: ["info", "navigation"]
        }),
        new HtmlWebpackPlugin({
            title: "Update",
            filename: "update.html",
            template: "./src/update.hbs",
            chunks: ["update", "navigation"]
        }),
        new MiniCssExtractPlugin()
    ]
};

module.exports = () =>
{
    if (isProduction)
    {
        config.mode = "production";
    }
    else
    {
        config.mode = "development";
    }

    return config;
};
