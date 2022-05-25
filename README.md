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
# create tables and relations
npx prisma db execute --file prisma/db_schema.sql --schema prisma/schema.prisma

# introspect Postgres schema to create Prisma schema
npx prisma db pull

# manually add the materialized view to the schema.prisma file 
# views are not introspected by Prisma
model top_buyers_view {
  first_name String
  last_name String
  total_portfolio_value Int

  @@unique([first_name, last_name, total_portfolio_value])
}

# generate prisma client
npx prisma generate

# seed users in database
npx prisma db seed

```

6. Run the sample application:
```
cd market-orders-client
npm run build
cd ..
npm start;
open localhost:8000
```

7. Development (optional)
```
# This will automatically open browser window and proxy requests to the server
# npm run start-dev
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
# create tables and relations
npx prisma db execute --file prisma/db_schema.sql --schema prisma/schema.prisma

# introspect Postgres schema to create Prisma schema
npx prisma db pull

# manually add the materialized view to the schema.prisma file 
# views are not introspected by Prisma
model top_buyers_view {
  first_name String
  last_name String
  total_portfolio_value Int

  @@unique([first_name, last_name, total_portfolio_value])
}

# generate prisma client
npx prisma generate

# seed users in database
npx prisma db seed

```

6. Run the sample application:

```
cd market-orders-client
npm run build
cd ..
npm start;
open localhost:8000
```

7. Development (optional)
```
# This will automatically open browser window and proxy requests to the server
# npm run start-dev
```