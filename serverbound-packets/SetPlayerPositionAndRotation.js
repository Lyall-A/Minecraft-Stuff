const types = require("../types");

class SetPlayerPositionAndRotation {
    constructor(x, feetY, z, yaw, pitch, onGround) {   
        this._x = x;
        this._feetY = feetY;
        this._z = z;
        this._yaw = yaw;
        this._pitch = pitch;
        this._onGround = onGround;
    }

    packetId = Buffer.from([0x1B]);

    x = () => types.writeDouble(this._x);
    feetY = () => types.writeDouble(this._feetY);
    z = () => types.writeDouble(this._z);
    yaw = () => types.writeFloat(this._yaw);
    pitch = () => types.writeFloat(this._pitch);
    onGround = () => types.writeBoolean(this._onGround);

    data = () => Buffer.concat([
        this.x(),
        this.feetY(),
        this.z(),
        this.yaw(),
        this.pitch(),
        this.onGround(),
    ]);

    length = () => types.writeVarInt(this.packetId.length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId,
        this.data()
    ]);
}

module.exports = SetPlayerPositionAndRotation;