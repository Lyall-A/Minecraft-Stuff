const types = require("./types");

class PacketCapturer {
    constructor() {
        this.callbacks = null;

        this.packetLength = 0;
        this.capturedLength = 0;
        this.lastPacket = null;
    }

    capture(data) {
        if (this.packetLength == this.capturedLength) {
            const { value: length, size: lengthSize } = types.readVarInt(data)

            this.packetLength = length + lengthSize;
            this.capturedLength = 0;
            this.lastPacket = null;
        }

        const packetPart = data.subarray(0, this.packetLength - this.capturedLength);
        this.lastPacket = this.lastPacket ? Buffer.concat([ this.lastPacket, packetPart ]) : packetPart;
        this.capturedLength += packetPart.length;
        if (this.capturedLength == this.packetLength) {
            this.call(this.lastPacket); // Call "packet" event
            if (data.length > packetPart.length) this.capture(data.subarray(packetPart.length)); // Capture again if data contains more than 1 packet
        }
    }

    call(packet) {
        this.callbacks?.(packet);
    }

    onPacket(callback) {
        const func = this.callbacks;
        this.callbacks = (packet) => { func?.(packet); callback(packet) };
    }

    oncePacket(callback) {
        const func = this.callbacks;
        this.callbacks = (packet) => { func?.(packet); callback(packet); this.callbacks = func };
    }
}

module.exports = PacketCapturer