const zlib = require("zlib");
const types = require("./types");
const serverboundPackets = {};
const clientboundPackets = {};

// TODO: lazy
const fs = require("fs");
const path = require("path");
fs.readdirSync("serverbound-packets").filter(i => path.extname(i) == ".js").forEach(i => serverboundPackets[path.basename(i, path.extname(i))] = require(`./serverbound-packets/${i}`));
fs.readdirSync("clientbound-packets").filter(i => path.extname(i) == ".js").forEach(i => clientboundPackets[path.basename(i, path.extname(i))] = require(`./clientbound-packets/${i}`));

function create(type, args, compression, packetId) {
    const packet = new serverboundPackets[type](...(args || []));
    if (packetId) packet.packetId = packetId;
    const data = packet.data();
    if (compression >= 0 || compression == true) {
        if (compression != true && packet.packetId.length + data.length >= compression) {
            // Compressed format (compressed)
            const compressed = compress(packet.packetId, data);
            return Buffer.concat([
                types.writeVarInt(packet.length().length + compressed.length),
                packet.length(),
                compressed
            ]);
        } else {
            // Compressed format (uncompressed)
            const dataLength = types.writeVarInt(0);
            return Buffer.concat([
                types.writeVarInt(dataLength.length + packet.packetId.length + data.length),
                dataLength,
                packet.packetId,
                data
            ]);
        }
    } else return packet.buffer(); // Uncompressed format
}

function parse(type, data) {
    const parsedPacket = new clientboundPackets[type](data);
    return parsedPacket.parse();
}

function compress(packetId, data) {
    return zlib.gzipSync(Buffer.concat([packetId, data]));
}

// TODO: complete
const ids = {
    HANDSHAKE: 0x00,
    STATUS_RESPONSE: 0x00,
    PING_RESPONSE: 0x01,
    STATUS_REQUEST: 0x00,
    PING_REQUEST: 0x01,
    DISCONNECT_LOGIN: 0x00,
    ENCRYPTION_REQUEST: 0x01,
    LOGIN_SUCCESS: 0x02,
    SET_COMPRESSION: 0x03,
    LOGIN_PLUGIN_REQUEST: 0x04
}

module.exports = {
    create,
    parse,
    compress,
    ids
};