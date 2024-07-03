const types = require("../types");

class ClientStatus {
    constructor(actionId) {       
        this._actionId = actionId;
    }

    packetId = () => Buffer.from([0x09]);

    actionId = () => types.writeVarInt(this._actionID);

    data = () => Buffer.concat([
        this.actionId()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = ClientStatus;