const types = require("../types");

class SynchronizePlayerPosition {
    constructor(data) {
        this._data = data;
    }

    parse() {
        const parsed = { };
        let offset = 0;

        const { value: x, size: xSize } = types.readDouble(this._data, offset);
        parsed.x = x;
        offset += xSize;

        const { value: y, size: ySize } = types.readDouble(this._data, offset);
        parsed.y = y;
        offset += ySize;

        const { value: z, size: zSize } = types.readDouble(this._data, offset);
        parsed.z = z;
        offset += zSize;

        const { value: yaw, size: yawSize } = types.readFloat(this._data, offset);
        parsed.yaw = yaw;
        offset += yawSize;

        const { value: pitch, size: pitchSize } = types.readFloat(this._data, offset);
        parsed.pitch = pitch;
        offset += pitchSize;

        const { value: flags, size: flagsSize } = types.readByte(this._data, offset);
        parsed.flags = flags;
        offset += flagsSize;

        const { value: teleportId, size: teleportIdSize } = types.readVarInt(this._data, offset);
        parsed.teleportId = teleportId;
        offset += teleportIdSize;

        return parsed;
    }
}

module.exports = SynchronizePlayerPosition;