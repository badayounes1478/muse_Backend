const mongoose = require('mongoose')
const schema = mongoose.Schema

const team = new schema({
    creator_email: {
        required: true,
        type: String,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    team_name: {
        required: true,
        type: String
    },
    peoples: [String],
    instance:String,
    flag: { type: Boolean, default: true }
})

module.exports = mongoose.model('Team', team)