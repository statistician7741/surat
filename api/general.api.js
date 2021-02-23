const getSuggestion = require('./general.on/getSuggestion');
const getSuggestSM = require('./suratmasuk.on/getSuggest.on');

function applyToClient(client) {
    client.on('api.general.autocomplete/getSuggestion', (q, cb)=>getSuggestion(q, cb,client));
    client.on('api.general.autocomplete/getSuggestSM', (q, cb)=>getSuggestSM(q, cb,client));
}

module.exports = applyToClient