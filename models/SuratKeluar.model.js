var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SuratKeluarSchema = new Schema({
    "nomor": Number,
    "tgl_spd": Date,
    "perihal": String,
    "tujuan": String,
    "seksi": String,
    "pemohon": {
        'nama': String,
        'nip': String
    },
    "timestamp": {
        'type': Date,
        'default': Date.now
    }
}, { collection: 'suratkeluar' });

module.exports = mongoose.model('SuratKeluar', SuratKeluarSchema);