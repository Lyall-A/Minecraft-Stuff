const types = require("../types");

class ServerboundKnownPacks {
    // TODO: create this
    constructor(knownPackCount = 1, knownPacks = { value: [["minecraft", "core", "1.21"]], types: ["string", "string", "string"]}) {       
        this._knownPackCount = knownPackCount;
        this._knownPacks = knownPacks;
    }

    packetId = () => Buffer.from([0x07]);

    knownPackCount = () => types.writeVarInt(this._knownPackCount);
    knownPacks = () => types.writeArray(this._knownPacks.value, this._knownPacks.types);

    data = () => Buffer.concat([
        // Buffer.from([0x01, 0x09, 0x6d, 0x69, 0x6e, 0x65, 0x63, 0x72, 0x61, 0x66, 0x74, 0x04, 0x63, 0x6f, 0x72, 0x65, 0x04, 0x31, 0x2e, 0x32, 0x31])
        this.knownPackCount(),
        this.knownPacks()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = ServerboundKnownPacks;