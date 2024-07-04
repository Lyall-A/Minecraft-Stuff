const crypto = require("crypto");

function offlinePlayer(name) {
    const hash = crypto.createHash("md5");
    hash.update(`OfflinePlayer:${name}`);
    return hash.digest();
}

module.exports = {
    offlinePlayer
}