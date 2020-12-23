const async = require('async')
const express = require('express')
const router = express.Router()
const formidable = require("formidable");
const fs = require('fs');
const SuratKeluar = require('../models/SuratKeluar.model');

function upload(req, res) {
    const file_path = __dirname + "/../arsip/";
    const form = new formidable.IncomingForm({
        // multiples: true,
        uploadDir: file_path,
        keepExtensions: true
    });
    if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path);
    }
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        //1. simpan arsip ke disk
        const { _id } = fields
        //3. update db
        async.auto({
            removeOldFile: (r_cb) => {
                SuratKeluar.findOne({ _id }, (e, r) => {
                    if (r) {
                        if (r.arsip)
                            if (fs.existsSync(r.arsip)) {
                                fs.unlinkSync(r.arsip);
                            }
                        r_cb(null, 'ok')
                    }
                    else r_cb(null, 'none to delete')
                })
            },
            updateNomor: ['removeOldFile', (prevR, u_cb) => {
                const new_name = `${form.uploadDir}${_id}_${files['files[]'].name}`
                fs.rename(files['files[]'].path, new_name, () => { });
                //2. rename 
                SuratKeluar.updateOne({
                    _id
                }, {
                    $set: {
                        'arsip': new_name,
                        'arsip_filename': `${_id}_${files['files[]'].name}`
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
                res.sendStatus(500)
            } else {
                res.sendStatus(200)
            }
        })
    });
}

router.post("/upload", upload)

module.exports = router;