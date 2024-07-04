const net = require("net");
const fs = require("fs");

const parsePacket = require("../parsePacket");

const proxyServer = net.createServer();

let proxiedData = 0;
const dataLimit = 0;
const proxyPort = 25421;
const host = "localhost";
const port = 25420;

proxyServer.on("connection", socket => {
    const serverConnection = net.createConnection({ host, port });

    socket.on("data", data => {
        serverConnection.write(data);
        proxiedData++;
        if (dataLimit && proxiedData >= dataLimit) serverConnection.end();
        try {
            const parsedPacket = parsePacket(data);
            console.log("[SERVERBOUND]", parsedPacket);
        } catch (err) {
            // console.log("[SERVERBOUND]", "Failed to parse!", data)
        }
    });
    socket.on("error", () => { });
    socket.on("close", () => serverConnection.end());
    
    serverConnection.on("data", data => {
        socket.write(data);
        proxiedData++;
        if (dataLimit && proxiedData >= dataLimit) serverConnection.end();
        try {
            const parsedPacket = parsePacket(data);
            // console.log("[CLIENTBOUND]", parsedPacket);
        } catch (err) {
            // console.log("[CLIENTBOUND]", "Failed to parse!", data)
        }
    });
    serverConnection.on("error", err => { });
    serverConnection.on("close", () => socket.end());
});

proxyServer.listen(proxyPort, () => console.log("Proxy server running"));