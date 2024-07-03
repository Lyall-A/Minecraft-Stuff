const types = require("../types");

class ClientInformation {
    constructor(locale = "en_GB", viewDistance = 10, chatMode = 0, chatColors = true, displayedSkinParts = 127 , mainHand = 1, enableTextFiltering = false, allowServerListings = true) {   
        this._locale = locale;    
        this._viewDistance = viewDistance;    
        this._chatMode = chatMode;    
        this._chatColors = chatColors;    
        this._displayedSkinParts = displayedSkinParts;    
        this._mainHand = mainHand;    
        this._enableTextFiltering = enableTextFiltering;    
        this._allowServerListings = allowServerListings;    
    }

    packetId = () => Buffer.from([0x00]);

    locale = () => types.writeString(this._locale, 16);
    viewDistance = () => types.writeByte(this._viewDistance);
    chatMode = () => types.writeVarInt(this._chatMode);
    chatColors = () => types.writeBoolean(this._chatColors);
    displayedSkinParts = () => types.writeUnsignedByte(this._displayedSkinParts);
    mainHand = () => types.writeVarInt(this._mainHand);
    enableTextFiltering = () => types.writeBoolean(this._enableTextFiltering);
    allowServerListings = () => types.writeBoolean(this._allowServerListings);

    data = () => Buffer.concat([
        this.locale(),
        this.viewDistance(),
        this.chatMode(),
        this.chatColors(),
        this.displayedSkinParts(),
        this.mainHand(),
        this.enableTextFiltering(),
        this.allowServerListings(),
    ]);

    length = () => types.writeVarInt(this.packetId().length + this.data().length);

    buffer = () => Buffer.concat([
        this.length(),
        this.packetId(),
        this.data()
    ]);
}

module.exports = ClientInformation;