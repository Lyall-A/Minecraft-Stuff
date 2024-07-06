const types = require("../types");

class CombatDeath {
    constructor(data) {
        this._data = data;
    }

    parse() {
        const parsed = { };
        let offset = 0;

        const { value: playerId, size: playerIdSize } = types.readVarInt(this._data, offset);
        parsed.playerId = playerId;
        offset += playerIdSize;

        // TODO: create read text component
        // const { value: message, size: messageSize } = types.readTextComponent(this._data, offset);
        // parsed.message = message;
        // offset += messageSize;

        return parsed;
    }
}

module.exports = CombatDeath;