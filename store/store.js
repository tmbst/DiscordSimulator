const fs = require("fs");
const dataPath = "./data.json";
const absoluteDataPath = `./store/${dataPath}`;

/*
 * const blueprint = {
 *   guildID: {
 *     chains: {
 *       userID: chain
 *     },
 *     channels: [
 *       channelID
 *     ]
 * }
 */
let diskData = {};
try {
  diskData = require(dataPath);
} catch (err) {
  console.log("Store: no data found. A new one will be made.");
}

function isObject(obj) {
  const type = typeof obj;
  if (type !== "object" || obj === null) {
    return new TypeError(
      `Data should be a non null object. Instead received ${type}`
    );
  }
  return null;
}

module.exports = {
  writeDiskData() {
    try {
      fs.writeFileSync(absoluteDataPath, JSON.stringify(diskData));
    } catch (err) {
      console.log(`Error writing to disk: ${err}`);
      throw err;
    }
  },
  getGuildData(guildID) {
    return diskData[guildID] || {};
  },
  setGuildData(guildID, data) {
    const err = isObject(data);
    if (err) {
      throw err;
    }
    console.log({ data });
    diskData[guildID] = data;
  },
  getChains(guildID) {
    return this.getGuildData(guildID).chains || {};
  },
  setChains(guildID, chains) {
    const err = isObject(chains);
    if (err) {
      throw err;
    }
    const guildData = this.getGuildData(guildID);
    guildData.chains = chains;
    this.setGuildData(guildData);
  },
  getUserChain(guildID, userID) {
    return this.getChains(guildID)[userID] || null;
  },
  setUserChain(guildID, userID, chain) {
    // TODO save chain data - can't save object directly
    throw new Error("Unimplemented");
  },
  getChannels(guildID) {
    return this.getGuildData(guildID).channels || [];
  },
  setChannels(guildID, channels) {
    if (!Array.isArray(channels)) {
      throw new TypeError(`channels should be an Array. Channels: ${channels}`);
    }
    const data = this.getGuildData(guildID);
    data.channels = channels;
    this.setGuildData(guildID, data);
  },
  toggleChannel(guildID, channelID) {
    const channels = this.getChannels(guildID);
    const idx = channels.indexOf(channelID);
    if (idx === -1) {
      channels.push(channelID);
    } else {
      channels.splice(idx, 1);
    }
    this.setChannels(guildID, channels);
  },
};
