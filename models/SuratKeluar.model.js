var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SuratKeluarSchema = new Schema({
    "_id": { //tahun+nomor
        type: String,
        required: true
    },
    "tahun": { //nomor
        type: Number,
        required: true
    },
    "nomor": { //nomor
        type: Number,
        required: true
    },
    "tgl_surat": {
        type: Date,
    },
    "perihal": {
        type: String,
    },
    "tujuan": {
        type: String,
    },
    "pemohon": {
        'nama': String,
        'nip': String
    },
    "arsip": {
        type: String,
    },
    "arsip_filename": {
        type: String,
    },
    "timestamp": {
        'type': Date,
        'default': Date.now
    },
    "nomor_kosong": {
        'type': Boolean,
        'default': false
    },
    "klasifikasi_keamanan": {
        type: String,
        'default': 'B'
    },
    "seksi": {
        type: String,
    },
    "klasifikasi_arsip": {
        type: String,
    }
}, { collection: 'suratkeluar' });

module.exports = mongoose.model('SuratKeluar', SuratKeluarSchema);