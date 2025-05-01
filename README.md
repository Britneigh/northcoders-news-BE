# NC News Seeding

## Project Summary:
### This project is the back-end for NC News, a news site. The PSQL database has been seeded with data on articles, users, topics, and comments. The RESTful API was built using Node.js and Express to access the data from the database.

### Server URL: https://northcoders-news-vjlm.onrender.com
- Refer to the **endpoints.json** file to see the list of endpoints you can access and the details for each endpoint.
- Just add the endpoint at the end of the server URL to access the data at that endpoint.
- Example: https://northcoders-news-vjlm.onrender.com/api/users

## Set Up

### 1. Clone this repository:
- ```$ git clone https://github.com/Britneigh/northcoders-news-BE.git```

### 2. Install all dependencies:
```npm install```

### 3. Create two .env files:
- .env.test
- .env.development

### 4. Inside .env.test, write: 
```PGDATABASE=nc_news_test```
###  5. Inside .env.development, write: 
```PGDATABASE=nc_news```

### 6. Then run this command in the terminal to set up the databases:
```npm run setup-dbs```
### To run tests:
```npm run test-seed```
### To run the seed for the development database:
```npm run seed-dev```

### Minimum requirements to run this project:
- **Node.js**: 23.10.0
- **dotenv**: 16.5.0
- **express**: 5.1.0
- **pg**: 8.15.6
- **pg-format**: 1.0.4
