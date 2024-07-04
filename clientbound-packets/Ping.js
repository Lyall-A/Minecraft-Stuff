const types = require("../types");

class Ping {
    constructor(data) {
        this._data = data;
    }

    parse() {
        const parsed = { };
        let offset = 0;

        const { value: id, size: idSize } = types.readInt(this._data, offset);
        parsed.id = id;
        offset += idSize;

        return parsed;
    }
}

module.exports = Ping;