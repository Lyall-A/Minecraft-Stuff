// https://wiki.vg/Protocol
const net = require("net");

const uuid = require("./uuid");
const types = require("./types");
const packets = require("./packets");

const PacketCapturer = require("./PacketCapturer");
const PacketParser = require("./PacketParser");

const host = "localhost";
const port = 25420;
const username = "notch"

const conn = net.createConnection({ host, port });

const packetCapturer = new PacketCapturer();
const packetParser = new PacketParser();

conn.on("connect", () => {
    console.log("TCP connected");
    packetParser.setState("LOGIN");
    conn.write(Buffer.concat([
        packets.create("Handshake", undefined, host, port, 2),
        packets.create("LoginStart", username, uuid.offlinePlayer(username))
    ]));
});
conn.on("close", () => console.log("TCP connection closed"));
conn.on("data", data => packetCapturer.capture(data));
packetCapturer.onPacket(packet => packetParser.parse(packet));

packetParser.onceState("LOGIN", () => {
    packetParser.oncePacketId(0x02, () => {
        console.log("Login");
        conn.write(Buffer.concat([
            packets.create("LoginAcknowledged"),
            packets.create("ClientInformation")
        ]));
        packetParser.setState("CONFIGURATION");
    });
});

packetParser.onState("CONFIGURATION", () => {
    packetParser.oncePacketId(0x0E, () => {
        console.log("Sending known packs");
        conn.write(packets.create("ServerboundKnownPacks"));
    });

    packetParser.oncePacketId(0x03, () => {
        packetParser.setState("PLAY");
        conn.write(packets.create("AcknowledgeFinishConfiguration"));
    });
});

packetParser.onceState("PLAY", () => {
    console.log("Play!");

    packetParser.onPacketId(0x26, packet => {
        const keepAliveId = types.readLong(packet.data).value;
        console.log("Got Keep Alive ID:", keepAliveId);
        conn.write(packets.create("ServerboundKeepAlive", keepAliveId))
    });

    packetParser.onPacketId(0x3C, packet => {
        console.log("Got killed, respawning");
        conn.write(packets.create("ClientStatus", 0));
    });

    packetParser.onPacketId(0x40, (packet, raw) => {
        const parsed = packets.parse("SynchronizePlayerPosition", raw);
        console.log("Confirming teleport for teleport ID:", parsed.teleportId);
        conn.write(packets.create("ConfirmTeleportation", parsed.teleportId))
        // console.log(parsed);
        x = parsed.x;
        y = parsed.y;
        z = parsed.z;
    });

    // TODO: worked once then never again?
    // packetParser.oncePacketId(0x40, (packet, raw) => {
    //     console.log("Got synchronize player position, starting movement");

    //     setInterval(() => {
    //         x += 0.5;

    //         console.log("Moving to XYZ:", x, y, z);
    //         conn.write(packets.create("SetPlayerPosition", x, y, z, true));
    //     }, 200);
    // });
});

// packetParser.onParser("packet", console.log)

packetParser.onParser("error", err => console.log("Parser Error:", err));