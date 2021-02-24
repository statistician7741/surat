var mongoose = require('mongoose');
const moment = require('moment')

var Schema = mongoose.Schema;

var SuratMasukSchema = new Schema({
    "_id": { //nomor surat
        type: String,
        required: true
    },
    "tahun": {
        type: Number,
        required: true
    },
    "tgl_masuk": {
        type: Date,
        required: true
    },
    "tgl_surat": {
        type: Date,
        required: true
    },
    "perihal": {
        type: String,
        required: true
    },
    "pengirim": {
        type: String,
        required: true
    },
    "arsip": {
        type: String,
        required: true
    },
    "arsip_filename": {
        type: String,
        required: true
    },
    "timestamp": {
        'type': Date,
        'default': Date.now
    },
}, { collection: 'suratmasuk' });

module.exports = mongoose.model('SuratMasuk', SuratMasukSchema);

// SuratMasukSchema.virtual('tahun').get(function () {
//     return moment(this.tgl_masuk).format('YYYY')
// });