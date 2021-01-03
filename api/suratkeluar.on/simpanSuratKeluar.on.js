const async = require('async')
const SuratKeluar = require('../../models/SuratKeluar.model');

module.exports = (input, cb, client) => {
    const tahun_terpilih = 2021
    const { tgl_surat, perihal, tujuan, seksi, _id } = input;
    async.auto({
        isExist: cb_isExist => {
            if (_id) {
                SuratKeluar.findOne({ _id }, (err, result) => {
                    if (err) {
                        console.log(err);
                        cb_isExist(err, null)
                    } else
                        cb_isExist(null, result) //result: null/object
                })
            } else
                cb_isExist(null, false)
        },
        storeDB: ['isExist', ({ isExist }, cb_storeDB) => {
            if (isExist) {
                SuratKeluar.updateOne(
                    { _id },
                    { tahun_terpilih, tgl_surat, perihal, tujuan, seksi, nomor_kosong: false },
                    (e, updatedResult) => {
                        if (e)
                            console.log(e)
                        else
                            cb_storeDB(null, updatedResult)
                    })
            } else {
                SuratKeluar
                    .findOne({ tahun: tahun_terpilih })
                    .sort('-nomor')
                    .exec((e, lastNomorResult) => {
                        if (e)
                            cb_storeDB(e, null)
                        else {
                            if (lastNomorResult) {
                                const nomor_baru = lastNomorResult.nomor + 1
                                SuratKeluar.create({
                                    _id: `${tahun_terpilih}_${nomor_baru}`,
                                    tahun: tahun_terpilih,
                                    nomor: nomor_baru,
                                    tgl_surat,
                                    perihal,
                                    tujuan,
                                    seksi,
                                    pemohon: { nama: '(dlm pengembangan)', nip: '199402242018021001' }
                                }, (err, newNomorResult) => {
                                    if (err)
                                        console.log(err)
                                    else
                                        cb_storeDB(null, newNomorResult)
                                })
                            } else {
                                SuratKeluar.create({
                                    _id: `${tahun_terpilih}_1`,
                                    tahun: tahun_terpilih,
                                    nomor: 1,
                                    tgl_surat,
                                    perihal,
                                    tujuan,
                                    seksi,
                                    pemohon: { nama: 'Muh. Shamad', nip: '199402242018021001' }
                                }, (err, newNomorResult) => {
                                    if (err)
                                        console.log(err)
                                    else
                                        cb_storeDB(null, newNomorResult)
                                })
                            }
                        }
                    })
            }
        }]
    }, (e, f) => {
        if (e)
            cb({ type: 'error', message: 'Terjadi kendala di server. Mohon hubungi IPDS' })
        else
            cb({ type: 'OK', data: f.storeDB })
    })
}