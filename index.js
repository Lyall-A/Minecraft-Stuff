// https://wiki.vg/Protocol
const net = require("net");

const uuid = require("./uuid");
const types = require("./types");
const packets = require("./packets");

const PacketCapturer = require("./PacketCapturer");
const PacketParser = require("./PacketParser");

const host = "192.168.1.217";
// const host = "localhost";
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
            packets.create("ClientInformationConfiguration")
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
        conn.write(packets.create("AcknowledgeFinishConfiguration"));
        packetParser.setState("PLAY");
    });
});

packetParser.onceState("PLAY", () => {
    console.log("Play");

    conn.write(packets.create("ChatMessage", "hi im notch"));
    
    packetParser.onPacketId(0x2B, packet => {
        const parsed = packets.parse("Login", packet.data);
        console.log("Entity ID:", parsed.entityId);
        conn.write(packets.create("PlayerCommand", parsed.entityId, 0));
    });

    packetParser.onPacketId(0x26, packet => {
        const keepAliveId = types.readLong(packet.data).value;
        console.log("Got Keep Alive ID:", keepAliveId);
        conn.write(packets.create("ServerboundKeepAlive", keepAliveId))
    });

    packetParser.onPacketId(0x35, packet => {
        const parsed = packets.parse("Ping", packet.data);
        console.log("Received ping with ID:", parsed.id);
        conn.write(packets.create("PongPlay", parsed.id));
    });

    packetParser.onPacketId(0x3C, packet => {
        console.log("Got killed, respawning");
        conn.write(packets.create("ClientStatus", 0));
    });

    // let x = 0;
    // let y = 0;
    // let z = 0;

    // packetParser.onPacketId(0x40, packet => {
    //     const parsed = packets.parse("SynchronizePlayerPosition", packet.data);
    //     console.log("Confirming teleport for teleport ID:", parsed.teleportId);
    //     conn.write(packets.create("ConfirmTeleportation", parsed.teleportId));
    //     x = parsed.flags & 0x01 ? x + parsed.x : parsed.x;
    //     y = parsed.flags & 0x02 ? y + parsed.y : parsed.y;
    //     z = parsed.flags & 0x04 ? z + parsed.z : parsed.z;
    // });

    // packetParser.oncePacketId(0x40, packet => {
    //     console.log("Got synchronize player position, starting movement");

    //     setInterval(() => {
    //         x += 0.25;
    //         // y += 0.25;
    //         z += 0.25;
    //         console.log("Moving to XYZ:", x, y, z);
    //         conn.write(packets.create("SetPlayerPosition", x, y, z, true));
    //     }, 100);
    // });
});

// packetParser.onParser("packet", console.log)

packetParser.onParser("error", err => console.log("Parser Error:", err));