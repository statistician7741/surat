const SuratMasuk = require('../../models/SuratMasuk.model');
const fs = require('fs');
const async = require('async')

module.exports = (_id, cb, client) => {
    const tahun_terpilih = 2021
    async.auto({
        removeNomor: (cb_r) => {
            SuratMasuk.findByIdAndDelete({ _id, tahun_terpilih }, (e, suratYgAkanDihapus) => {
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
    }, (e, f) => {
        if (e) {
            console.log(e);
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            cb({ type: 'OK' })
        }
    })
}