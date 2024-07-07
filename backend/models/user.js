const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    lists: [{
        location: {type: String, required: true},
        activities: [{
            title: {type: String, required: true},
            description: {type: String, required: true},
            checked: {type: Boolean, required: true}
        }]
    }]
});

module.exports = mongoose.model('User', userSchema);