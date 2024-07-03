const types = require("../types");

class ServerboundKnownPacks {
    // TODO: create this
    constructor(knownPackCount = 0, knownPacks = []) {       
        this._knownPackCount = knownPackCount;
        this._knownPacks = knownPacks;
    }

    packetId = () => Buffer.from([0x07]);

    // protocolVersion = () => types.writeVarInt(this._protocolVersion);
    // serverAddress = () => types.writeString(this._serverAddress, 255);

    data = () => Buffer.concat([
        Buffer.from([0x01, 0x09, 0x6d, 0x69, 0x6e, 0x65, 0x63, 0x72, 0x61, 0x66, 0x74, 0x04, 0x63, 0x6f, 0x72, 0x65, 0x04, 0x31, 0x2e, 0x32, 0x31])
        // this.protocolVersion(),
        // this.serverAddress(),
        // this.serverPort(),
        // this.nextState()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = ServerboundKnownPacks;