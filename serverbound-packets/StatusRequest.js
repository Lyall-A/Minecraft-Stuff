const types = require("../types");

class StatusRequest {
    packetId = () => Buffer.from([0x00]);

    data = () => Buffer.alloc(0);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = StatusRequest;