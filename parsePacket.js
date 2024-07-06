const zlib = require("zlib");
const types = require("./types");

function parsePacket(packet, compressionThreshold) {
    let offset = 0;

    if (compressionThreshold >= 0) {
        // Packet Length
        const { value: packetLength, size: packetLengthSize } = types.readVarInt(packet, offset);
        offset += packetLengthSize;
        // Data Length
        const { value: dataLength, size: dataLengthSize } = types.readVarInt(packet, offset);
        offset += dataLengthSize;

        // Uncompress data (if over threshold)
        const isCompressed = dataLength >= compressionThreshold;
        const uncompressedData = isCompressed ? zlib.unzipSync(packet.subarray(offset, packetLength + packetLengthSize)) : null;
        if (isCompressed) offset = 0;

        // Packet ID
        const { value: packetId, size: packetIdSize } = types.readVarInt(isCompressed ? uncompressedData : packet, offset);
        offset += packetIdSize;
        // Data
        const data = (isCompressed ? uncompressedData : packet).subarray(offset, packetLength + packetLengthSize);

        return {
            isCompressed,
            length: isCompressed ? dataLength : packetIdSize + data.length,
            packetId,
            data
        }
    } else {
        // Length
        const { value: length, size: lengthSize } = types.readVarInt(packet, offset);
        offset += lengthSize;
        // Packet ID
        const { value: packetId, size: packetIdSize } = types.readVarInt(packet, offset);
        offset += packetIdSize;
        // Data
        const data = packet.subarray(offset, length + lengthSize);

        return {
            length,
            packetId,
            data
        }
    }


}

module.exports = parsePacket;