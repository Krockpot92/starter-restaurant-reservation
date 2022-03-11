const knex = require("../db/connection");

const tableName = "reservations";

function search(mobile_number) {
    return knex(tableName)
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

  module.exports={
    search
  }