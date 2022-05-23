# Market Orders Steaming to YugabyteDB on Node.js
This application subscribes to the [PubNub Market Orders Stream](https://www.pubnub.com/developers/realtime-data-streams/financial-securities-market-orders/) via Node.js client and stores the market trades in YugabyteDB.  

## Run using YugabyteDB Managed
1. [Sign up for YugabyteDB Managed](https://docs.yugabyte.com/preview/yugabyte-cloud/cloud-quickstart/) and create a free cluster.  Additionally, follow this [guide](https://docs.yugabyte.com/preview/yugabyte-cloud/cloud-quickstart/cloud-build-apps/cloud-add-ip/#download-your-cluster-certificate) to download your cluster CA certificate and set up your cluster IP allow list. 

2. Create Database named `market_orders_sample`

3. Run the following to install dependencies (first time only):
```
cd market-order-app-nodejs
npm install
```

4. Configure your DATABASE_URL environment variable in the .env file:

```
# format
DATABASE_URL="postgresql://[DB_USERNAME]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/
market_orders_sample?schema=public&sslrootcert=[PATH_TO_ROOT_CERT]"

# example
DATABASE_URL="postgresql://admin:qwerty12345@us-west-2.foobarbaz.aws.ybdb.io:5433/
market_orders_sample?schema=public&sslrootcert=../certs/root.crt"
```

NOTE: Certificate path is relative to the `market-orders-app-nodejs/prisma` directory


5. Run the following to initialize database:

```
npx prisma migrate dev --name "init"
```

6. Run the sample application:

```
node server.js
```

## Run locally

1. [Install YugabyteDB](https://docs.yugabyte.com/quick-start/install/).

2. Create Database named `market_orders_sample`

3. Run the following to install dependencies (first time only):
```
cd market-order-app-nodejs
npm install
```

4. Configure your DATABASE_URL environment variable in the .env file:

```
# format
DATABASE_URL="postgresql://[DB_USERNAME]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/
market_orders_sample?schema=public"

# example
DATABASE_URL="postgresql://yugabyte:yugabyte@127.0.0.1:5433/
market_orders_sample?schema=public"
```

5. Run the following to initialize database:

```
npx prisma migrate dev --name "init"
```

6. Run the sample application to populate database:

```
node server.js
```
