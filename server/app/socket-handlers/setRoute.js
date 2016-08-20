import SocketMessageTypes from "../../../shared/SocketMessageTypes";

export default function (koa) {
    

    koa.io.route("command:request", function* () {
        const [commandId] = this.args;
        this.emit("command:response", {
            commandId,
        });
    });
}
