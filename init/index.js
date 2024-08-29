const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/HomeHavenly')
}

main().then(() => { 
    console.log("connected to DB");
}).catch((err ) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"66c85df7fb9499d7f5571f2a"}));
    await Listing.insertMany(initData.data);
}

initDB();


