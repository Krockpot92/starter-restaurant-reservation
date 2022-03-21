/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://uzgksfxz:FpCg3V10Chdn0pJT2SDgKb_4crQRsYwH@jelani.db.elephantsql.com/uzgksfxz",
  DATABASE_URL_DEVELOPMENT = "postgres://qlffnamp:l_MT-sqwtTaxNmicxY-aV7KDxo4Yy4q4@jelani.db.elephantsql.com/qlffnamp",
  DATABASE_URL_TEST = "postgres://mvxjjjjb:xR8CWAvqinCxLdTNuHqcbCiPCV-4nR6U@jelani.db.elephantsql.com/mvxjjjjb",
  DATABASE_URL_PREVIEW = "postgres://zllcwvsl:D8Zj4DGMZXrKqJwfJgTjqYHSVP6OSGPO@jelani.db.elephantsql.com/zllcwvsl",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
