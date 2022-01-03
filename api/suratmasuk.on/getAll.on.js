const SuratMasuk = require('../../models/SuratMasuk.model');

module.exports = (cb, client) => {
    const tahun = '2022'
    SuratMasuk.find({tahun: tahun}, '_id tgl_masuk tgl_surat perihal pengirim arsip_filename').sort('-tgl_masuk').exec((e, all_suratmasuk) => {
        if (e) {    
            console.log(e);
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            cb({ type: 'OK', all_suratmasuk })
        }
    })
}