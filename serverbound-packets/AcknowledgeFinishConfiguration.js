const types = require("../types");

class AcknowledgeFinishConfiguration {
    packetId = () => Buffer.from([0x03]);

    data = () => Buffer.alloc(0);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = AcknowledgeFinishConfiguration;