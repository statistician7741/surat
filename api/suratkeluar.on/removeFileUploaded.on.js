const async = require('async')
const fs = require('fs');
const SuratKeluar = require('../../models/SuratKeluar.model');
const file_path = __dirname + "/../../arsip/";

module.exports = (input, cb, client) => {
    const { _id, filename } = input;
    async.auto({
        removeOldFile: (r_cb) => {
            if (fs.existsSync(`${file_path}${filename}`)) {
                fs.unlinkSync(`${file_path}${filename}`);
                r_cb(null, 'deleted')
            }
            else if(fs.existsSync(`${file_path}${_id}_${filename}`)){
                fs.unlinkSync(`${file_path}${_id}_${filename}`);
                r_cb(null, 'deleted')
            }
            else r_cb('none to delete', null)
        },
        updateNomor: ['removeOldFile', (prevR, u_cb) => {
            SuratKeluar.updateOne({
                _id
            }, {
                $unset: {
                    'arsip': "",
                    'arsip_filename': "",
                }
            }, (err, result) => {
                if (err) {
                    u_cb(err, null)
                } else {
                    u_cb(null, 'update Nomor OK')
                }
            })
        }]
    }, (e, f) => {
        if (e) {
            console.log(e);
            cb({type: 'error'})
        } else {
            cb({type: 'OK'})
        }
    })
}