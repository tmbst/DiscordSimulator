const fs = require("fs");
const dataPath = "./data.json";
const absoluteDataPath = `./store/${dataPath}`;
const { isObject } = require("../util");

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
    console.log({ guildID, data });
    const isObj = isObject(data);
    if (!isObj) {
      throw new TypeError(
        `setGuildData: Data should be a non null object. Data: ${data}`
      );
    }
    diskData[guildID] = data;
  },
  getChains(guildID) {
    return this.getGuildData(guildID).chains || {};
  },
  setChains(guildID, chains) {
    const guildData = this.getGuildData(guildID);
    guildData.chains = chains;
    this.setGuildData(guildID, guildData);
  },
  getUserChain(guildID, userID) {
    return this.getChains(guildID)[userID] || null;
  },
  setUserChain(guildID, userID, chain) {
    // TODO save chain data correctly - can't save object directly and also write to disk
    const chains = this.getChains(guildID);
    chains[userID] = chain;
    this.setChains(guildID, chains);
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
