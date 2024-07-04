const types = require("../types");

class UpdateSign {
    constructor(location, isFrontText = true, line1, line2, line3, line4) {   
        this._location = location;    
        this._isFrontText = isFrontText;    
        this._line1 = line1;    
        this._line2 = line2;    
        this._line3 = line3;    
        this._line4 = line4;    
    }

    packetId = () => Buffer.from([0x35]);

    location = () => types.writePosition(this._location);
    isFrontText = () => types.writeBoolean(this._isFrontText);
    line1 = () => types.writeString(this._line1, 384);
    line2 = () => types.writeString(this._line2, 384);
    line3 = () => types.writeString(this._line3, 384);
    line4 = () => types.writeString(this._line4, 384);

    data = () => Buffer.concat([
        this.location(),
        this.isFrontText(),
        this.line1(),
        this.line2(),
        this.line3(),
        this.line4()
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = UpdateSign;