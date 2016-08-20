import * as fs from "fs";
import * as mkdirp from "mkdirp";
import {
    spawn
} from "child_process";
import * as Path from "path";
import * as Request from "request-promise";

const Threasholder = require("../utils/Thresholder");

export default class Encoder {
    constructor() {
        this._caches = {};

        if (app.getConfig("no-cache") === true) {
            console.log("\u001b[36m[Service:Encoder] Video downloading is \u001b[31mDisabled\u001b[m");
        } else {
            console.log("\u001b[36m[Service:Encoder] Video downloading is \u001b[32mEnabled\u001b[m");
        }

        app.onDidLogin((session) => {
            console.log("\u001b[36m[Service:Encoder] Connected to nicovideo\u001b[m");
            this._session = session;
            this._handleCommands();
        });

        this.que = new Threasholder({
            maxParallels: 3,
            maxTask: 10,
            shiftOnOverTask: true,
            delay: 5000
        });
    }

    _handleCommands() {
        app.command.handle({
            "service:encoder:prepare": (movie) => {
                if ((movie == null) || (this._caches[movie.id] != null)) {
                    return Promise.resolve();
                }
                if (app.getConfig("no-cache") === true) {
                    return Promise.resolve();
                }

                const defer = Promise.defer();
                this._caches[movie.id] = defer.promise;

                console.log("\u001b[36m[Service:Encoder] Preprering " + (movie.get("title")) + " (" + movie.id + ")\u001b[m");

                this.que.preQue(async () => {
                    const audioOut = Path.join(app.getConfig("cache.path"), movie.id + ".mp3");
                    const movieOut = Path.join(app.getConfig("cache.movie"), movie.id + "." + (movie.get("movieType")));

                    if (fs.existsSync(audioOut)) {
                        return Promise.resolve();
                    }

                    try {
                        const video = await this._session.video.getVideoInfo(movie.id);
                        const flvInfo = await video.fetchGetFlv();

                        await Request.get({
                            url: "http://www.nicovideo.jp/watch/" + movie.id,
                            jar: this._session.cookie
                        });


                        await new Promise((resolve) => {
                            // get video file
                            const videoReqStream = Request.get({
                                url: flvInfo.url,
                                jar: this._session.cookie
                            }, () => { resolve(); });

                            videoReqStream.pipe(fs.createWriteStream(movieOut));
                            videoReqStream.on("end", function() {
                                return console.log("\u001b[32m[Service:Encoder] Download end (" + movie.id + ")\u001b[m");
                            });

                            console.log("\u001b[36m[Service:Encoder] Donwload started (" + movie.id + ")\u001b[m");
                        });


                        defer.resolve();
                        console.log("\u001b[36m[Service:Encoder] Start encoding (" + movie.id + ")\u001b[m");

                        const ffmpeg = spawn("ffmpeg", ["-i", movieOut, "-vn", "-c:a", "libmp3lame", "-b:a", "256k", audioOut]);
                        ffmpeg.on("error", function(e) {
                            return console.log("\u001b[31m[Service:Encoder] Encoding error! " + e + " " + movie.id + "\u001b[m");
                        });

                        ffmpeg.on("exit", () => {
                            try {
                                fs.unlinkSync(movieOut);
                            } catch (e) {
                                console.error(`\u001b[31m[Service:Encoder] Source file unlink failed. (${movie.id})\n ${e.stack}`);
                            }

                            app.getSocket().emit("events/nco/encoder/stream-available", {
                                movieId: movie.id
                            });

                            console.log("\u001b[32m[Service:Encoder] Encode end. stream-available emitted.(" + movie.id + ")\u001b[m");
                        });
                    } catch (e) {
                        defer.reject();
                        delete this._caches[movie.id];
                        console.error("\u001b[31m[Service:Encoder] Error raised for " + movie.id + "\n" + e.stack + "\u001b[m");
                    }
                });
            }
        });
    }
}
