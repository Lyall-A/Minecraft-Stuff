const types = require("../types");

class ServerboundKeepAlive {
    constructor(keepAliveId) {       
        this._keepAliveId = keepAliveId;
    }

    packetId = Buffer.from([0x18]);

    keepAliveId = () => types.writeLong(this._keepAliveId);

    data = () => Buffer.concat([
        this.keepAliveId()
    ]);

    length = () => types.writeVarInt(this.packetId.length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId,
        this.data()
    ]);
}

module.exports = ServerboundKeepAlive;