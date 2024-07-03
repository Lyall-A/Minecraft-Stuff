// https://wiki.vg/Protocol
const net = require("net");

const parsePacket = require("./parsePacket");
const uuid = require("./uuid");
const states = require("./states");
const types = require("./types");
const packets = require("./packets");

const PacketCapturer = require("./PacketCapturer");

const host = "localhost";
const port = 25420;
const username = "notch"

const packetCapturer = new PacketCapturer();

// const handshake = new Handshake(undefined, host, port, 1); // Create handshake packet
// const statusRequest = new StatusRequest(); // Create status request packet

const conn = net.createConnection({ host, port });

let state;

conn.on("connect", () => {
    state = states["LOGIN"];
    // Send handshake and status request packet as one
    conn.write(Buffer.concat([
        packets.create("Handshake", undefined, host, port, 2),
        packets.create("LoginStart", username, uuid.offlinePlayer(username))
        // statusRequest.buffer()
    ]));
});

conn.on("data", data => packetCapturer.capture(data));

packetCapturer.onPacket(packet =>  {
    const parsed = parsePacket(packet);

    // console.log(parsed)

    if (parsed.packetId == 0x02 && state == states["LOGIN"]) {
        console.log("LOGIN SUCCESS!");
        conn.write(packets.create("LoginAcknowledged"));
        state = states["CONFIGURATION"];
        conn.write(packets.create("ClientInformation"));
    }
    if (parsed.packetId == 0x0E && state == states["CONFIGURATION"]) {
        console.log("known packs")
        conn.write(packets.create("ServerboundKnownPacks"));
    }
    if (parsed.packetId == 0x03 && state == states["CONFIGURATION"]) {
        console.log("PLAY")
        state = states["PLAY"];
        conn.write(packets.create("AcknowledgeFinishConfiguration"));
        // setInterval(() => conn.write(new SwingArm().buffer()), 100)
        // setInterval(() => conn.write(new PlayerCommand(0).buffer()), 1000)
    }
    if (parsed.packetId == 0x26) {
        console.log(types.readLong(parsed.data))
        conn.write(packets.create("ServerboundKeepAlive", types.readLong(parsed.data)));
    }
    if (parsed.packetId == 0x3c) {
        console.log("I DIED")
        conn.write(packets.create("ClientStatus", 0));
    }
    if (parsed.packetId == 0x2b) {
        console.log(packets.parse("Login", parsed.data));
        entityId = packets.parse("Login", parsed.data).entityId;
        console.log(entityId)
        conn.write(packets.create("PlayerCommand", entityId, 0))
    }
    if (parsed.packetId == 0x22) console.log(parsed)
});