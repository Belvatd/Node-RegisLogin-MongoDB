const mongoose = require ('mongoose');
let db = mongoose.connection;

mongoose
    .connect('mongodb://localhost:27017/nama-database',{
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(()=>{
        console.info('Terkoneksi pada database!');
    })
    .catch(err=>{
        console.error('Koneksi gagal:', err);
        process.exit();
    });

    module.exports = db;