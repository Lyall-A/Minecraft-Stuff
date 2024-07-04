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

function writeArray(value, types) {
    let buffer = Buffer.alloc(0);
    for (let i in value) {
        for (let x in types) {
            buffer = Buffer.concat([
                buffer,

                types[x] == "string" ? writeString(types.length > 1 ? value[i][x] : value[i]) :
                Buffer.alloc(0)
            ]);
        }
    }
    return buffer;
}

function writeDouble(value) {
    const buffer = Buffer.alloc(8);
    buffer.writeDoubleBE(value);
    return buffer;
}

function writeFloat(value) {
    const buffer = Buffer.alloc(4);
    buffer.writeFloatBE(value);
    return buffer;
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
    return { value: buffer.readInt32BE(offset), size: 4 };
}

function readBoolean(buffer, offset = 0) {
    return { value: buffer[offset] == 0x00 ? false : true, size: 1 };
}

function readString(buffer, offset = 0) {
    const { value: length, size: lengthSize } = readVarInt(buffer, offset);
    const string = buffer.subarray(offset + lengthSize, offset + lengthSize + length);
    return { value: string.toString(), size: lengthSize + length };
}

function readLong(buffer, offset = 0) {
    return { value: buffer.readBigInt64BE(offset), size: 8 };
}

function readArray(buffer, length, types, offset = 0) {
    const array = [];
    let arrayOffset = 0;
    for (let i = 0; i < length; i++) {
        const subArray = [];
        for (let x in types) {
            subArray.push(
                types[x] == "string" ? readString(buffer, offset + arrayOffset) :
                undefined
            );
            arrayOffset += subArray[x].size;
        }
        subArray.length > 1 ? array.push(subArray) : array.push(...subArray);
    }
    return { value: array, size: arrayOffset };
}

function readByte(buffer, offset = 0) {
    return { value: buffer[offset], size: 1 };
}

function readFloat(buffer, offset = 0) {
    return { value: buffer.readFloatBE(offset), size: 4 }
}

function readDouble(buffer, offset = 0) {
    return { value: buffer.readDoubleBE(offset), size: 8 }
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
    writeArray,
    writeDouble,
    writeFloat,

    readVarInt,
    readString,
    readLong,
    readInt,
    readBoolean,
    readArray,
    readByte,
    readFloat,
    readDouble
}