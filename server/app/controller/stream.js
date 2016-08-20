export default function* (channel) {
    const movieId = req.params.movieId;

    if (!/(?:sm|nm)[1-9]\d*?/.test(movieId)) {
        res.set("Content-Type", "text/plain").status(404).end("Not found.");
        return;
    }

    const audioPath = Path.join(this.getConfig("cache.path"), movieId + ".mp3");

    if (! fs.existsSync(audioPath)) {
        res.set("Content-Type", "text/plain").status(404).end("Not found");
        return;
    }

    this.body = fs.createReadStream(audioPath);
};
