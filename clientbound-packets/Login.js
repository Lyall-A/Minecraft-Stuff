const types = require("../types");

class Login {
    constructor(data) {
        this._data = data;
    }

    parse() {
        const parsed = { };
        let offset = 0;

        parsed.entityId = types.readInt(this._data, offset);
        offset += 4;
        parsed.isHardcore = types.readBoolean(this._data, offset);
        offset += 1;
        parsed.dimensionCount = types.readVarInt(this._data, offset);

        return parsed;
    }
}

module.exports = Login;