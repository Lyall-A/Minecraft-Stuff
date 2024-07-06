const types = require("../types");

class SetCompression {
    constructor(data) {
        this._data = data;
    }

    parse() {
        const parsed = { };
        let offset = 0;

        const { value: threshold, size: thresholdSize } = types.readVarInt(this._data, offset);
        parsed.threshold = threshold;
        offset += thresholdSize;

        return parsed;
    }
}

module.exports = SetCompression;