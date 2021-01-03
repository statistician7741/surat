const SuratKeluar = require('../../models/SuratKeluar.model');
const async = require('async')

module.exports = (_id, cb, client) => {
    const tahun_terpilih = 2020
    async.auto({
        minDate: (cb_bb) => {
            SuratKeluar.findOne({
                _id: { $ne: _id },
                tahun: tahun_terpilih,
                nomor: { $lt: _id.match(/\d+$/)[0] },
                tgl_surat: { $exists: true },
            }, (e, hasil) => {
                cb_bb(null, hasil?hasil.tgl_surat:undefined)
            })
        },
        maxDate: (cb_ba) => {
            SuratKeluar.findOne({
                _id: { $ne: _id },
                tahun: tahun_terpilih,
                nomor: { $gt: _id.match(/\d+$/)[0] },
                tgl_surat: { $exists: true },
            }, (e, hasil) => {
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