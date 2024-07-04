const types = require("../types");

class Login {
    constructor(data) {
        this._data = data;
    }

    parse() {
        // TODO: add everything
        const parsed = { };
        let offset = 0;

        const { value: entityId, size: entityIdSize } = types.readInt(this._data, offset);
        parsed.entityId = entityId;
        offset += entityIdSize;

        return parsed;
    }
}

module.exports = Login;