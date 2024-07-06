const types = require("../types");

class ChatMessage {
    // TODO: write
    constructor(message, timestamp = Date.now(), salt = 0, hasSignature = false, signature = [], messageCount = 0) { 
        this._message = message;      
        this._timestamp = timestamp;      
        this._salt = salt;      
        this._hasSignature = hasSignature;      
        this._signature = signature;      
        this._messageCount = messageCount;      
        // this._acknowledged = acknowledged;
    }

    packetId = Buffer.from([0x06]);

    message = () => types.writeString(this._message, 256);
    timestamp = () => types.writeLong(this._timestamp);
    salt = () => types.writeLong(this._salt);
    hasSignature = () => types.writeBoolean(this._hasSignature);
    signature = () => types.writeByteArray(this._signature, 256);
    messageCount = () => types.writeVarInt(this._messageCount);
    acknowledged = () => types.writeFixedBitSet(20);

    data = () => Buffer.concat([
        this.message(),
        this.timestamp(),
        this.salt(),
        this.hasSignature(),
        this.signature(),
        this.messageCount(),
        this.acknowledged(),
    ]);

    length = () => types.writeVarInt(this.packetId.length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId,
        this.data()
    ]);
}

module.exports = ChatMessage;