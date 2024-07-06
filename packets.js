const serverboundPackets = {};
const clientboundPackets = {};

// TODO: lazy
const fs = require("fs");
const path = require("path");
fs.readdirSync("serverbound-packets").filter(i => path.extname(i) == ".js").forEach(i => serverboundPackets[path.basename(i, path.extname(i))] = require(`./serverbound-packets/${i}`));
fs.readdirSync("clientbound-packets").filter(i => path.extname(i) == ".js").forEach(i => clientboundPackets[path.basename(i, path.extname(i))] = require(`./clientbound-packets/${i}`));

function create(type, ...args) {
    const packet = new serverboundPackets[type](...args);
    return packet.buffer();
}

function parse(type, data) {
    const parsedPacket = new clientboundPackets[type](data);
    return parsedPacket.parse();
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
    ids
};