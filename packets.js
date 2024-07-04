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

module.exports = {
    create,
    parse
};