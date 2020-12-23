const SuratKeluar = require('../../models/SuratKeluar.model');
const fs = require('fs');

module.exports = (_id, cb, client) => {
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
            cb({ type: 'error', message: 'Mohon hubungi Admin' })
        } else {
            if (fs.existsSync(suratYgAkanDihapus.arsip)) {
                fs.unlinkSync(suratYgAkanDihapus.arsip);
            }
            cb({ type: 'OK', suratYgAkanDihapus })
        }
    })
}