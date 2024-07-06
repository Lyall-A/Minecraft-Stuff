const types = require("../types");

class Handshake {
    constructor(protocolVersion = 767, serverAddress, serverPort = 25565, nextState = 1) {       
        this._protocolVersion = protocolVersion;
        this._serverAddress = serverAddress;
        this._serverPort = serverPort;
        this._nextState = nextState;
    }

    packetId = Buffer.from([0x00]);

    protocolVersion = () => types.writeVarInt(this._protocolVersion);
    serverAddress = () => types.writeString(this._serverAddress, 255);
    serverPort = () => types.writeUnsignedShort(this._serverPort);
    nextState = () => types.writeVarInt(this._nextState);

    data = () => Buffer.concat([
        this.protocolVersion(),
        this.serverAddress(),
        this.serverPort(),
        this.nextState()
    ]);

    length = () => types.writeVarInt(this.packetId.length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId,
        this.data()
    ]);
}

module.exports = Handshake;