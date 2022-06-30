const SuratKeluar = require('../../models/SuratKeluar.model');
const fs = require('fs');
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