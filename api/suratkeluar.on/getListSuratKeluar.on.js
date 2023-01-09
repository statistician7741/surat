const SuratKeluar = require('../../models/SuratKeluar.model');
const config = require('../../env.config');
const {
    verify
} = require('jsonwebtoken');

module.exports = (cb, client) => {
    let tahun_terpilih = new Date().getFullYear();
    try {
        const { tahun_anggaran } = verify(client.handshake.cookies.jwt, process.env.NODE_ENV !== 'development' ? config.JWT_SECRET_PROD : config.JWT_SECRET_DEV);
        tahun_terpilih = tahun_anggaran;
    } catch (ex) {
        console.log(ex);
    }
    SuratKeluar.find({
        _id: new RegExp(`^${tahun_terpilih}_`, 'i')
    }, '_id nomor tgl_surat perihal tujuan pemohon seksi arsip_filename nomor_kosong klasifikasi_keamanan klasifikasi_arsip').sort('-nomor').exec((e, all_suratkeluar) => {
        if (e) {
            console.log(e);
            cb({
                type: 'error',
                message: 'Mohon hubungi Admin'
            })
        } else {
            cb({
                type: 'OK',
                all_suratkeluar
            })
        }
    })
}