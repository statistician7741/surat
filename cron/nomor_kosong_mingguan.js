const schedule = require('node-schedule');
const SuratKeluar = require('../models/SuratKeluar.model')

const senin_rabu_jumat_jam12malam = '0 0 * * 1,3,5';
const setiap_akhir_tahun = '0 0 1 1 *'
const test = '0,10,20,30,40,50 * * * * *'

var nomor_kosong_mingguan = schedule.scheduleJob(senin_rabu_jumat_jam12malam, () => {
    const tahun_terpilih = new Date().getFullYear().toString();
    SuratKeluar
        .findOne({ _id: new RegExp(`^${tahun_terpilih}_`, 'i') })
        .sort('-_id').exec((err, suratKeluarWithNomorTerakhir) => {
            // console.log(suratKeluarWithNomorTerakhir);
            if (suratKeluarWithNomorTerakhir) {
                const nomor_baru = suratKeluarWithNomorTerakhir.nomor + 1;
                SuratKeluar.create({
                    _id: `${tahun_terpilih}_${nomor_baru}`,
                    nomor: nomor_baru,
                    tahun: tahun_terpilih,
                    // tgl_surat: new Date(),
                    nomor_kosong: true
                }, (err, suratKeluarKosongMingguan) => {
                    if (err)
                        console.log(err);
                    else
                        console.log(`Nomor surat cadangan dibuat: ${suratKeluarKosongMingguan._id}`)
                })
            } else
                console.log('Belum ada Surat Keluar Kosong yg dibuat.');
        })
})

module.exports = nomor_kosong_mingguan;