const express = require("express");
const App = express();
const PrismaClient =  require('@prisma/client').PrismaClient;
const prisma = new PrismaClient();
require("./stream").initialize();
const {subscribe, unsubscribe} = require("./stream");
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.get("/trades", async (req, res) => {
    const query = {}
    if (req.query?.sort) {
        const [field, direction] = req.query.sort.split(":");
        query.orderBy = {
            [field]: direction
        }
    }

    if (req.query?.limit) {
        query.take = parseInt(req.query.limit);
    }

    query.include = {User: true};
    let trades;
    try {
     trades = await prisma.trade.findMany(query)
    } catch (e) {
        throw e;
    } finally {
        await prisma.$disconnect();
        res.json(trades)
    }
})

App.get("/stats", async (req,res) => {
    const query = {
        orderBy: {
            total_portfolio_value: "desc"
        }
    }
    let topBuyers;
    try {
        topBuyers = await prisma.top_buyers_view.findFirst(query)
    } catch(e) {
        throw e
    } finally {
        await prisma.$disconnect();
        res.json(topBuyers);
    }
})

App.post("/controls", async (req, res) => {
    if(req.body.value) {
        subscribe();
    } else {
        unsubscribe();
    }

    res.sendStatus(200).end();
})

const path = require('path');
App.use(express.static("market-orders-client/build"));

App.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

App.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`);
})