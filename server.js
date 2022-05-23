const PrismaClient =  require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
const STREAM_SUBSCRIPION_KEY = "sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe";
const STREAM_NAME = "pubnub-market-orders";
const PubNub = require('pubnub');
const pubnub = new PubNub({
    subscribeKey: STREAM_SUBSCRIPION_KEY,
    uuid: "market-orders-app-nodejs" //UUID now required for all PubNub SDKs
});

pubnub.subscribe({
    channels: [STREAM_NAME]
});

pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            console.log(`Subscribed to: ${statusEvent.subscribedChannels}`)

            // Automatically unsubscribe after 10 seconds
            setTimeout(() => {
                console.log(`Unsubscribing from stream ${STREAM_NAME}`)
                pubnub.unsubscribe({
                    channels: [STREAM_NAME]
                });
            }, 10000)
        }
    },
    message: function(messageEvent) {
        console.log(messageEvent);
        addTradeToDB(messageEvent.message).catch((e) => {
            throw e;
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
    }
})


async function addTradeToDB(trade) {
    delete trade.timestamp;
    const committedTrade = await prisma.trade.create({
        data: trade || {}
    })

    console.log(`Trade committed to DB: ${JSON.stringify(committedTrade)}`)
    
}

