const types = require("../types");

class SetPlayerPosition {
    constructor(x, feetY, z, onGround) {   
        this._x = x;    
        this._feetY = feetY;    
        this._z = z;    
        this._onGround = onGround;    
    }

    packetId = () => Buffer.from([0x1A]);

    x = () => types.writeDouble(this._x);
    feetY = () => types.writeDouble(this._feetY);
    z = () => types.writeDouble(this._z);
    onGround = () => types.writeBoolean(this._onGround);

    data = () => Buffer.concat([
        this.x(),
        this.feetY(),
        this.z(),
        this.onGround(),
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = SetPlayerPosition;