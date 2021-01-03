const simpanSuratKeluar = require('./suratkeluar.on/simpanSuratKeluar.on');
const removeFileUploaded = require('./suratkeluar.on/removeFileUploaded.on');
const getListSuratKeluar = require('./suratkeluar.on/getListSuratKeluar.on');
const getSuratByNomor = require('./suratkeluar.on/getSuratByNomor.on');
const deleteSuratByNomor = require('./suratkeluar.on/deleteSuratByNomor.on');
const getConstraintDate = require('./suratkeluar.on/getConstraintDate.on');

function applyToClient(client) {
    client.on('api.master_suratkeluar.editor/simpanSuratKeluar', (query,cb)=>simpanSuratKeluar(query,cb,client));
    client.on('api.master_suratkeluar.editor/removeFileUploaded', (data,cb)=>removeFileUploaded(data,cb,client));
    client.on('api.master_suratkeluar.summary/getSuratByNomor', (_id,cb)=>getSuratByNomor(_id,cb,client));
    client.on('api.master_suratkeluar.basic/deleteSuratByNomor', (_id,cb)=>deleteSuratByNomor(_id,cb,client));
    client.on('api.master_suratkeluar.list/getListSuratKeluar', (cb)=>getListSuratKeluar(cb,client));
    client.on('api.master_suratkeluar.summary/getConstraintDate', (_id, cb)=>getConstraintDate(_id, cb,client));
}

module.exports = applyToClient