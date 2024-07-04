const types = require("../types");

class Pong {
    constructor(id) {       
        this._id = id;
    }

    packetId = () => Buffer.from([0x18]);

    id = () => types.writeInt(this._id);

    data = () => Buffer.concat([
        this.id()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = Pong;