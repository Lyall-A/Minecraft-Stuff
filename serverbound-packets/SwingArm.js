const types = require("../types");

class SwingArm {
    constructor(hand = 0) {       
        this._hand = hand;
    }

    packetId = Buffer.from([0x36]);

    hand = () => types.writeVarInt(this._hand);

    data = () => Buffer.concat([
        this.hand()
    ]);

    length = () => types.writeVarInt(this.packetId.length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId,
        this.data()
    ]);
}

module.exports = SwingArm;