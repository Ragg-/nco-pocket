import 'babel-polyfill';
import * as _ from "lodash";
import * as yargs from "yargs";
import Server from "./app/server";

yargs.string("port")
        .alias("port", "p")
        .default("port", 80)
        .describe("port", "Running port")
    .boolean("no-cache")
        .default(false)
        .describe("no-cache", "Disable video downloading")
    .boolean("help")
        .alias("help", "h")
        .describe("help", "Show command line help")
    .boolean("version")
        .alias("version", "v")
        .describe("version", "Show version");

const args = yargs.parse(process.argv.slice(1));

global.module = require("module");

if (args.help) {
    yargs.showHelp("error");
    process.exit(0);
}

if (args.version) {
    version = Server.getVersion();
    process.stdout.write(version + "\n");
    process.exit(0);
}

process.on("uncaughtException", (e) => {
    console.error(`\u001b[31mUncaught exception!!\n${e.stack}\u001b[m`);
});

process.on("unhandledRejection", (e) => {
    console.error(`\u001b[31mUnhandled rejection!!\n${e.stack ? e.stack : e}\u001b[m`);
});

const config = require("./config");
Server.start(_.assign(config, args));
