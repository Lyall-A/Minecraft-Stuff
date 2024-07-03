// Write data types
function writeVarInt(value) {
    const buffer = Buffer.alloc(5);
    let cursor = 0;
    while (value & ~0x7F) {
        buffer.writeUInt8((value & 0xFF) | 0x80, cursor)
        cursor++;
        value >>>= 7;
    }
    buffer.writeUInt8(value, cursor);
    return buffer.subarray(0, cursor + 1);
}

function writeString(value, maxLength) {
    if (value.length > maxLength) throw new Error(`Length must be <= ${maxLength}`);
    return Buffer.concat([
        writeVarInt(value.length),
        Buffer.from(value)
    ]);
}

function writeUnsignedShort(value) {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(value);
    return buffer;
}

function writeUuid(value) {
    const buffer = Buffer.alloc(16);
    buffer.fill(value);
    return buffer;
}

function writeByte(value) {
    const buffer = Buffer.alloc(1);
    buffer.writeInt8(value);
    return buffer;
}

function writeUnsignedByte(value) {
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(value);
    return buffer;
}

function writeBoolean(value) {
    return Buffer.from(value ? [0x01] : [0x00]);
}

function writeLong(value) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(value));
    return buffer;
}

function writeFixedBitSet(value) {
    return Buffer.alloc(Math.ceil(value / 8));
}

function writeByteArray(value, maxLength) {
    if (value.length > maxLength) throw new Error(`Length must be <= ${maxLength}`);
    return Buffer.from(value);
}

// Read data types
function readVarInt(buffer, offset = 0) {
    let result = 0;
    let shift = 0;
    let cursor = offset;
  
    while (true) {
        if (cursor + 1 > buffer.length) throw new Error();
        const b = buffer.readUInt8(cursor);
        result |= ((b & 0x7f) << shift);
        cursor++;
        if (!(b & 0x80)) {
            return {
                value: result,
                size: cursor - offset
            }
        }
        shift += 7;
        if (shift > 64) throw new Error(`varint is too big: ${shift}`);
    }
}

function readInt(buffer, offset = 0) {
    return buffer.readInt32BE(offset);
}

function readBoolean(buffer, offset = 0) {
    return buffer[offset] == 0x00 ? false : true;
}

function readString(buffer, offset = 0) {
    const { value: length, size: lengthSize } = readVarInt(buffer, offset);
    const string = buffer.subarray(offset + lengthSize, offset + lengthSize + length);
    return { value: string.toString(), size: lengthSize + length };
}

function readLong(buffer, offset = 0) {
    return buffer.readBigInt64BE(offset);
}

module.exports = {
    writeVarInt,
    writeString,
    writeUnsignedShort,
    writeUuid,
    writeByte,
    writeUnsignedByte,
    writeBoolean,
    writeLong,
    writeFixedBitSet,
    writeByteArray,

    readVarInt,
    readString,
    readLong,
    readInt,
    readBoolean
}