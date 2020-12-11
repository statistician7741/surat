const simpanSuratKeluar = require('./suratkeluar.on/simpanSuratKeluar.on');
const removeFileUploaded = require('./suratkeluar.on/removeFileUploaded.on');
const getListSuratKeluar = require('./suratkeluar.on/getListSuratKeluar.on');

function applyToClient(client) {
    client.on('api.master_suratkeluar.editor/simpanSuratKeluar', (query,cb)=>simpanSuratKeluar(query,cb,client));
    client.on('api.master_suratkeluar.editor/removeFileUploaded', (data,cb)=>removeFileUploaded(data,cb,client));
    client.on('api.master_suratkeluar.list/getListSuratKeluar', (cb)=>getListSuratKeluar(cb,client));
}

module.exports = applyToClient