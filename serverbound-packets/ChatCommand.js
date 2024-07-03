const types = require("../types");

class ChatCommand {
    constructor(command) {   
        this._command = command;    
    }

    packetId = () => Buffer.from([0x04]);

    command = () => types.writeString(this._command, 32767);

    data = () => Buffer.concat([
        this.command()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = ChatCommand;