const SuratKeluar = require('../../models/SuratKeluar.model');
const fs = require('fs');
const async = require('async')

module.exports = (_id, cb, client) => {
    const tahun_terpilih = 2020
    async.auto({
        isLastNomor: (cb_i) => {
            SuratKeluar.findOne({
                tahun: tahun_terpilih,
                nomor: { $gt: _id.match(/\d+$/)[0] }
            }, (e, r) => {
                if (r)
                    cb_i(null, false)
                else
                    cb_i(null, true)
            })
        },
        removeNomor: ['isLastNomor', (prevResult, cb_r) => {
            if (!prevResult.isLastNomor) {
                SuratKeluar.findOneAndUpdate({ _id }, {
                    $unset: {
                        tgl_surat: "",
                        perihal: "",
                        tujuan: "",
                        seksi: "",
                        seksi: "",
                        arsip: "",
                        arsip_filename: "",
                        pemohon: "",
                    },
                    nomor_kosong: true
                }).exec((e, suratYgAkanDihapus) => {
                    if (e) {
                        console.log(e);
                        cb_r('Mohon hubungi Admin', null)
                    } else {
                        if (fs.existsSync(suratYgAkanDihapus.arsip)) {
                            fs.unlinkSync(suratYgAkanDihapus.arsip);
                        }
                        cb_r(null, 'OK')
                    }
                })
            } else {
                SuratKeluar.findByIdAndDelete({ _id }, (e, suratYgAkanDihapus) => {
                    if (e) {
                        console.log(e);
                        cb_r('Mohon hubungi Admin', null)
                    } else {
                        if (fs.existsSync(suratYgAkanDihapus.arsip)) {
                            fs.unlinkSync(suratYgAkanDihapus.arsip);
                        }
                        cb_r(null, 'OK')
                    }
                })
            }
        }]
    }, (e, f) => {
        if (e) {
            console.log(e);
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            cb({ type: 'OK' })
        }
    })
}