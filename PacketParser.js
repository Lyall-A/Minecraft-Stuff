const parsePacket = require("./parsePacket");
const states = require("./states");

class PacketParser {
    constructor(state = states["HANDSHAKING"], boundTo = 1) {
        this.packetIdListeners = { };
        this.stateListeners = { };
        this.parserListeners = { };

        this._state = state;
        this._boundTo = boundTo;
        this._compressionThreshold = -1;
    }

    setState(state) {
        this._state = states[state];
        this.stateCall(state);
    };

    setCompression(threshold) {
        this._compressionThreshold = threshold;
    }

    parse(packet) {
        try {
            const parsed = parsePacket(packet, this._compressionThreshold);
            this.parserCall("parsed", parsed);
            this.parserCall("packet", packet);
            this.packetIdCall(parsed, packet);
            return parsed;
        } catch (err) {
            if (this.parserListeners["error"]) this.parserCall("error", err); else throw err;
        }
    }

    packetIdCall(packet, ...args) { this.packetIdListeners[packet.packetId]?.(packet, ...args) }
    onPacketId(packetId, callback) {
        const func = this.packetIdListeners[packetId];
        this.packetIdListeners[packetId] = (...args) => { func?.(...args); callback(...args) };
    }
    oncePacketId(packetId, callback) {
        const func = this.packetIdListeners[packetId];
        this.packetIdListeners[packetId] = (...args) => { func?.(...args); callback(...args); this.packetIdListeners[packetId] = func };
    }

    stateCall(state) { this.stateListeners[state]?.() }
    onState(state, callback) {
        const func = this.stateListeners[state];
        this.stateListeners[state] = () => { func?.(); callback() };
    }
    onceState(state, callback) {
        const func = this.stateListeners[state];
        this.stateListeners[state] = () => { func?.(); callback(); this.stateListeners[state] = func };
    }

    parserCall(name, ...args) { this.parserListeners[name]?.(...args) }
    onParser(name, callback) {
        const func = this.parserListeners[name];
        this.parserListeners[name] = (...args) => { func?.(...args); callback(...args) };
    }
    onceParser(name, callback) {
        const func = this.parserListeners[name];
        this.parserListeners[name] = (...args) => { func?.(...args); callback(...args); this.parserListeners[name] = func };
    }
}

module.exports = PacketParser;