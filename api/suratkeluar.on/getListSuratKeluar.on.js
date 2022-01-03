const SuratKeluar = require('../../models/SuratKeluar.model');

module.exports = (cb, client) => {
    const tahun_terpilih = '2022'
    SuratKeluar.find({_id: new RegExp(`^${tahun_terpilih}_`, 'i')}, '_id nomor tgl_surat perihal tujuan pemohon seksi arsip_filename nomor_kosong').sort('-nomor').exec((e, all_suratkeluar) => {
        if (e) {
            console.log(e);
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            cb({ type: 'OK', all_suratkeluar })
        }
    })
}