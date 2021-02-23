const SuratMasuk = require('../../models/SuratMasuk.model')
module.exports = (q, cb, client) => {
    SuratMasuk.find({[q.field]: new RegExp(q.query, "i")}).distinct(q.field).exec((err, result) => {
        if (err) {
            console.log(err);
            cb({ 'type': 'error', 'data': err })
        } else {
            cb({ 'type': 'ok', 'data': result.map(r=>({value: r})) })
        }
    })
}