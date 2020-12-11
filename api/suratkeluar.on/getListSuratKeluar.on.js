const SuratKeluar = require('../../models/SuratKeluar.model');

module.exports = (cb, client) => {
    const tahun_terpilih = '2020'
    SuratKeluar.find({_id: new RegExp(`^${tahun_terpilih}_`, 'i')}).sort('-_id').exec((e, all_suratkeluar) => {
        if (e) {
            console.log(e);
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            cb({ type: 'OK', all_suratkeluar })
        }
    })
}