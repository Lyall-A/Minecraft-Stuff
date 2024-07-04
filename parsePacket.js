const types = require("./types");

function parsePacket(packet) {
    let offset = 0;
    const { value: length, size: lengthSize } = types.readVarInt(packet, offset);
    offset += lengthSize;
    const { value: packetId, size: packetIdSize } = types.readVarInt(packet, offset);
    offset += packetIdSize;

    const data = packet.subarray(offset, offset + length - packetIdSize);

    return {
        length,
        packetId,
        data
    }
}

module.exports = parsePacket;