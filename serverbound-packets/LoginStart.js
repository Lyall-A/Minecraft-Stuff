const types = require("../types");

class LoginStart {
    constructor(name, playerUuid) {       
        this._name = name;
        this._playerUuid = playerUuid;
    }

    packetId = () => Buffer.from([0x00]);

    name = () => types.writeString(this._name, 16);
    playerUuid = () => types.writeUuid(this._playerUuid);

    data = () => Buffer.concat([
        this.name(),
        this.playerUuid()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = LoginStart;