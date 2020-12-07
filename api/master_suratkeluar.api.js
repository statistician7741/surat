const simpanSuratKeluar = require('./suratkeluar.on/simpanSuratKeluar.on');

function applyToClient(client) {
    client.on('api.master_suratkeluar.editor/simpanSuratKeluar', (query,cb)=>simpanSuratKeluar(query,cb,client));
}

module.exports = applyToClient