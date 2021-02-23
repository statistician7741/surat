const SuratMasuk = require('../../models/SuratMasuk.model');

module.exports = (_id, cb, client) => {
    const tahun_terpilih = 2021
    if (_id) {
        SuratMasuk.findOne({ _id }).exec((e, suratYgDicari) => {
            if (e) {
                console.log(e);
                cb({ type: 'error', message: 'Mohon hubungi Admin' })
            } else {
                if (suratYgDicari) cb({ type: 'OK', suratYgDicari })
                else cb({ type: 'error' })
            }
        })
    }
}