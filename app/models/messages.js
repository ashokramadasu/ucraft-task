'use strict'

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

module.exports = mongoose.model('Messages', {
    username: {
        type: String
    },
    message: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId
    },
    createdAt: {
        type: Date
    }
});

