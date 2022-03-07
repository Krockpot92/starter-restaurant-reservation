const knex = require("../db/connection");

const tableName = "tables";

function list(){
    return knex(tableName)
    .select("*")
}

function create(newTable){
    return knex(tableName)
    .insert(newTable)
    .returning("*")
    .then((createdRecords)=> createdRecords[0])
}

module.exports={
    list,
    create,
}