# NC News Seeding

- Instructions:
- Set up two env files:
- .env.test
- .env.development

- Inside the .env.test, write: PGDATABASE=nc_news_test
- Inside the .env.development, write: PGDATABASE=nc_news
- Now run this command to set up the databases: npm run setup-dbs