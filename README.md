# Northcoders News

API and database developed to serve data on articles and attached comments.

A live hosted version of this API can be found at \
https://nc-news-host.herokuapp.com/api/

## Getting Started

Clone the [repository](https://github.com/HGartland/nc-news) and navigate into the folder

```bash
git clone https://github.com/HGartland/nc-news
cd nc-news
```

## Installing dependecy libraries

### Install all dependencies:

- Use this **instead** of individual installs below

once inside the nc-news directory run

```
npm install
```

### Installing invididual dependencies:

- #### Dependencies for running _(express, fs, knex, pg)_
- #### Dev depedencies _(chai, chai-sorted, mocha, supertest)_

### 1. [node-postgres (aka pg)](https://www.npmjs.com/package/pg)

> Non-blocking **PostgreSQL** client for Node.js. Pure **JavaScript** and optional native libpq bindings.

Requirement on nc-news API for using **knex** and interacting with the **psql** db

```
npm install pg
```

### 2. [express](https://expressjs.com/)

> Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

```
npm install express
```

### 3. [knex](http://knexjs.org/)

> Knex.js is an SQL query builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift designed to be flexible, portable, and fun to use.

```
npm install knex pg
```

### 4. [fs](https://nodejs.org/api/fs.html)

> The fs module provides an API for interacting with the file system namely in providing the /api endpoint as a json

```
npm install fs
```

## Commands

see package.json scripts for the full list

### `npm run setup-dbs`

runs the setup.sql file - dropping (if exists) and creating the nc_news and nc_news_test databases.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />

### `npm test`

Runs tests on the database with using Mocha and Chai for interacting with all endpoints on test data to test both allowed and disallowed queries.

Running a the tests will trigger the re-seeding of the test DB between each.

### `npm run seed` / `seed:prod`

seeds either the test or production data into the SQL database using the seed function in seed.js

Utilised the following migration methods from knex in order to remove data existing on the table before re-adding.

### `migration`

used automatically by `npm run seed`.
`npm run migrate rollback` and `npm run migrate-latest(:prod)`
will drop and then reimpliment the tables to the SQL database.

## Authors

- **Harlan Gartland** - _Initial work_ - [HGartland on github](https://github.com/HGartland)

## Acknowledgments

- Special thanks to Mr.Bubz for being my rock when times are hard.
