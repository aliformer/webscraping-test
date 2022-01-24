const { Console } = require('console');
const {searchList, searchItemDetail} = require('./src/main');


// parameter row per request, keyword, limit
searchList(200, "tas ransel", 10000)

