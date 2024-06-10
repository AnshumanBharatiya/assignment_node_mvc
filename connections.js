const mongoose = require('mongoose');
// mongoose.set("strictQuery", true); // if any warning occurs
async function createConnection(url){
   return mongoose.connect(url);
}
module.exports = createConnection;