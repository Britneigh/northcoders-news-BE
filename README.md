# NC News Seeding

## Set Up

### Install all dependencies:
```npm install```

### Create two .env files:
- .env.test
- .env.development

### Inside the .env.test, write: 
```PGDATABASE=nc_news_test```
### Inside the .env.development, write: 
```PGDATABASE=nc_news```

### Then run this command in the terminal to set up the databases:
```npm run setup-dbs```
### To run tests:
```npm run test-seed```
### To run the seed for the development database:
```npm run seed-dev```

