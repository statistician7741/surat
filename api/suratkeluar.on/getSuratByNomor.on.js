const SuratKeluar = require('../../models/SuratKeluar.model');

module.exports = (_id, cb, client) => {
    if (_id) {
        if (!_id.match(/^\d{4}_\d+$/)) {
            cb({ type: 'error', message: 'Format nomor salah' })
        } else {
            SuratKeluar.findOne({ _id }, '_id nomor perihal tujuan pemohon seksi arsip_filename nomor_kosong').exec((e, suratYgDicari) => {
                if (e) {
                    console.log(e);
                    cb({ type: 'error', message: 'Mohon hubungi Admin' })
                } else {
                    if (suratYgDicari) cb({ type: 'OK', suratYgDicari })
                    else {
                        SuratKeluar.create({
                            _id,
                            nomor: _id.match(/\d+$/)[0],
                            tgl_surat: new Date(),
                            nomor_kosong: true
                        }, (err, suratYgDicari) => {
                            if (err)
                                console.log(err);
                            else
                                cb({ type: 'OK', suratYgDicari })
                        })
                    }
                }
            })
        }
    }
}