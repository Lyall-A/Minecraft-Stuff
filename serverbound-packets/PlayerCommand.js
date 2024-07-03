const types = require("../types");

class PlayerCommand {
    constructor(entityId, actionId, jumpBoost = 0) {       
        this._entityId = entityId;
        this._actionId = actionId;
        this._jumpBoost = jumpBoost;
    }

    packetId = () => Buffer.from([0x25]);

    entityId = () => types.writeVarInt(this._entityId);
    actionId = () => types.writeVarInt(this._actionId);
    jumpBoost = () => types.writeVarInt(this._jumpBoost);

    data = () => Buffer.concat([
        this.entityId(),
        this.actionId(),
        this.jumpBoost()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = PlayerCommand;