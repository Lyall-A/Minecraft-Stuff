const types = require("../types");

class ConfirmTeleportation {
    constructor(teleportId) {   
        this._teleportId = teleportId; 
    }

    packetId = () => Buffer.from([0x00]);

    teleportId = () => types.writeVarInt(this._teleportId);

    data = () => Buffer.concat([
        this.teleportId()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = ConfirmTeleportation;