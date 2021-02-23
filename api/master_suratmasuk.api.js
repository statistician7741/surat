const getSuratByNomor = require('./suratmasuk.on/getSuratByNomor.on');
const deleteSuratByNomor = require('./suratmasuk.on/deleteSuratByNomor.on');

function applyToClient(client) {
    client.on('api.master_suratmasuk.entry/getSuratByNomor', (_id,cb)=>getSuratByNomor(_id,cb,client));
    client.on('api.master_suratmasuk.basic/deleteSuratByNomor', (_id,cb)=>deleteSuratByNomor(_id,cb,client));
}

module.exports = applyToClient