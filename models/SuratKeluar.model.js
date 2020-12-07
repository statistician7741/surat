var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SuratKeluarSchema = new Schema({
    "nomor": {
        type: Number,
        required: true
    },
    "tgl_spd": {
        type: Date,
        required: true
    },
    "perihal": {
        type: Number,
        required: true
    },
    "tujuan": {
        type: Number,
        required: true
    },
    "seksi": {
        type: Number,
        required: true
    },
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