const { cond } = require('lodash');
const mongoose = require('mongoose');
const config = require('./../config')
mongoose.Promise = global.Promise;
mongoose.connect(config.db_url+config.db_name,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err)=>{
    if(err) console.log('DB CONNECTION ERROR');
    else console.log('DB CONNECTION OK');
});
module.exports = {
    mongoose
}