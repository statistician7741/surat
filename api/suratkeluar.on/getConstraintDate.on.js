const SuratKeluar = require('../../models/SuratKeluar.model');
const async = require('async')
const config = require('../../env.config');
const {
    verify
} = require('jsonwebtoken');

module.exports = (_id, cb, client) => {
    let tahun_terpilih = new Date().getFullYear();
    try {
        const { tahun_anggaran } = verify(client.handshake.cookies.jwt, process.env.NODE_ENV !== 'development' ? config.JWT_SECRET_PROD : config.JWT_SECRET_DEV);
        tahun_terpilih = tahun_anggaran;
    } catch (ex) {
        console.log(ex);
    }
    async.auto({
        minDate: (cb_bb) => {
            SuratKeluar.findOne({
                _id: { $ne: _id },
                tahun: tahun_terpilih,
                nomor: { $lt: _id.match(/\d+$/)[0] },
                tgl_surat: { $exists: true },
            }).sort('-nomor').exec((e, hasil) => {
                cb_bb(null, hasil?hasil.tgl_surat:undefined)
            })
        },
        maxDate: (cb_ba) => {
            SuratKeluar.findOne({
                _id: { $ne: _id },
                tahun: tahun_terpilih,
                nomor: { $gt: _id.match(/\d+$/)[0] },
                tgl_surat: { $exists: true },
            }).sort('nomor').exec((e, hasil) => {
                cb_ba(null, hasil?hasil.tgl_surat:undefined)
            })
        }
    }, (e, f) => {
        if (e) {
            console.log(e);
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            cb({ type: 'OK', data: f })
        }
    })
}