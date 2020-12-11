const getSuggestion = require('./general.on/getSuggestion');

function applyToClient(client) {
    client.on('api.general.autocomplete/getSuggestion', (q, cb)=>getSuggestion(q, cb,client));
}

module.exports = applyToClient