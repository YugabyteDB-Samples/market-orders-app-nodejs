const PrismaClient =  require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const STREAM_SUBSCRIPION_KEY = "sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe";
const STREAM_NAME = "pubnub-market-orders";
const PubNub = require('pubnub');
const pubnub = new PubNub({
    subscribeKey: STREAM_SUBSCRIPION_KEY,
    uuid: "market-orders-app-nodejs" //UUID now required for all PubNub SDKs
});

const subscribe = function() {
    console.log("subscribing to stream");
    pubnub.subscribe({
        channels: [STREAM_NAME]
    });
}

const unsubscribe = function() {
    console.log("unsubscribing from stream");
    pubnub.unsubscribe({
        channels: [STREAM_NAME]
    });
}

async function initialize() {
    // used for random selection on each trade
    let users;
    try {
        users = await prisma.user.findMany();
    } catch (e) {
        console.log(e);
    }

    subscribe();

    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log(`Subscribed to: ${statusEvent.subscribedChannels}`)
            }
        },
        message: function(messageEvent) {
            // Uncomment if you'd like to see messages printed to your terminal
            // console.log(messageEvent);
            // Index of randomly selected user
            const i = Math.floor(Math.random() * users.length)
            addTradeToDB(messageEvent.message, users[i]?.id)
        }
    })
}


async function addTradeToDB(trade, userId) {
    delete trade.timestamp;
    trade.user_id = userId;
    let committedTrade;
    try {
        committedTrade = await prisma.trade.create({
            data: trade || {}
        })
        console.log("Committed Trade", committedTrade)
    } catch (e) {
        console.log(e)
    }

    // Uncomment if you'd like to see committed trades printed to your terminal
    // console.log(`Trade committed to DB: ${JSON.stringify(committedTrade)}`)
}

module.exports = {subscribe, unsubscribe, initialize, prisma};