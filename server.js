const express = require("express");
const App = express();
const prisma = require('./stream').prisma;
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
        console.log(e)
    } finally {
        res.json(trades)
    }
})

App.get("/stats", async (req,res) => {
    const buyersQuery = {
        orderBy: {
            total_portfolio_value: "desc"
        }, 
        take: 5
    }
    let topBuyers, topSymbols, totalTrades;
    try {
        topBuyers = await prisma.top_buyers_view.findMany(buyersQuery)
        topSymbols = await prisma.trade.groupBy({
            by: ['symbol'],
            _sum: {
              bid_price: true
            },
            orderBy: {
                _sum: {
                    bid_price: "desc"
                }
            },
            _count: {
                id: true
            }
        })
        topSymbols = topSymbols.map(symbol => {
            return {...symbol._sum, symbol: symbol.symbol};
        })
        totalTrades = await prisma.trade.aggregate({
            _count: {
                id: true
            },
        })
        totalTrades = totalTrades._count?.id || 0
    } catch(e) {
        console.log(e)
    } finally {
        res.json({topBuyers, topSymbols, totalTrades});
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