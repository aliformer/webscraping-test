const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
const db = new Sequelize('tokopedia', 'root', '', {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../db/db.sqlite'),
    define: {
        timestamps: false
      },
  });


const connection = async () => {
    try {
        await db.sync({force: false});
        
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports = {db, connection}

