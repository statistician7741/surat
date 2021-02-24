const async = require('async')
const express = require('express')
const router = express.Router()
const formidable = require("formidable");
const fs = require('fs');
const SuratMasuk = require('../models/SuratMasuk.model');
const moment = require('moment');

function entri(req, res) {
    const tahun = 2021
    const file_path = __dirname + "/../arsip/suratmasuk/";
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
        const {
            tgl_masuk,
            _id,
            tgl_surat,
            perihal,
            pengirim,
            _id_current
        } = fields
        const file_name = files['files[]'] ? `${moment().unix()}_${files['files[]'].name}` : undefined
        const new_name = files['files[]'] ? `${form.uploadDir}${file_name}` : undefined
        //3. update db
        async.auto({
            removeOldFile: (r_cb) => {
                if (files['files[]']) {
                    SuratMasuk.findOne({ _id: _id_current ? _id_current : _id }, (e, r) => {
                        if (r) {
                            if (r.arsip)
                                if (fs.existsSync(r.arsip)) {
                                    fs.unlinkSync(r.arsip);
                                }
                            r_cb(null, 'ok')
                        }
                        else r_cb(null, 'none to delete')
                    })
                } else {
                    r_cb(null, 'none to delete')
                }
            },
            isExist: cb_isExist => {
                if (_id || _id_current) {
                    SuratMasuk.findOne({ _id: _id_current ? _id_current : _id }, (err, result) => {
                        if (err) {
                            console.log(err);
                            cb_isExist(err, null)
                        } else
                            cb_isExist(null, result) //result: null/object
                    })
                } else
                    cb_isExist(null, false)
            },
            storeDB: ['isExist', 'removeOldFile', ({ isExist }, cb_storeDB) => {
                files['files[]'] && fs.rename(files['files[]'].path, new_name, () => { });
                const q_update = files['files[]'] ? {
                    tahun,
                    tgl_masuk,
                    tgl_surat,
                    perihal,
                    pengirim,
                    arsip: new_name,
                    arsip_filename: file_name
                } : {
                        tahun,
                        tgl_masuk,
                        tgl_surat,
                        perihal,
                        pengirim
                    }
                if (isExist) {
                    SuratMasuk.updateOne(
                        { _id: _id_current ? _id_current : _id },
                        q_update,
                        (e, updatedResult) => {
                            if (e)
                                console.log(e)
                            else
                                cb_storeDB(null, updatedResult)
                        })
                } else {
                    SuratMasuk.create({
                        _id,
                        ...q_update
                    }, (err, newNomorResult) => {
                        if (err)
                            console.log(err)
                        else
                            cb_storeDB(null, newNomorResult)
                    })
                }
            }],
            isIdChanged: ['storeDB', ({ storeDB }, cb_isIdChg) => {
                if (_id_current) {
                    SuratMasuk.findByIdAndDelete({ _id: _id_current, tahun }, (e, {
                        tahun,
                        tgl_masuk,
                        tgl_surat,
                        perihal,
                        pengirim,
                        arsip: new_name,
                        arsip_filename: file_name
                    }) => {
                        if (e) {
                            console.log(e);
                            cb_r('Mohon hubungi Admin', null)
                        } else {
                            const q_update = {
                                tahun,
                                tgl_masuk,
                                tgl_surat,
                                perihal,
                                pengirim,
                                arsip: new_name,
                                arsip_filename: file_name
                            }
                            SuratMasuk.create({
                                _id,
                                ...q_update
                            }, (err, newNomorResult) => {
                                if (err){
                                    console.log(err)
                                    cb_isIdChg('error simpan new id changed', null)
                                }
                                else
                                    cb_isIdChg(null, newNomorResult)
                            })
                        }
                    })
                } else cb_isIdChg(null, 'id no change')
            }]
        }, (e, f) => {
            if (e) {
                console.log(e);
                res.sendStatus(500)
            } else {
                res.end(file_name ? file_name : 'arsip unchanged')
            }
        })
    });
}

router.post("/entri", entri)

module.exports = router;