const mongoose = require('mongoose');
const moment = require('moment');

const petSchema = new mongoose.Schema({
    name: String,
    age: Number,
    weight: Number,
    color: String,
    available: Boolean,
    user: Object,
    adopter: Object,
    createdAt: {
        type: String,
        default: () => moment().format('YYYY-MM-DD HH:mm:ss')
    },
    updatedAt: {
        type: String,
        default: () => moment().format('YYYY-MM-DD HH:mm:ss')
    }
});

// Middleware para atualizar a data antes de salvar
petSchema.pre('findOneAndUpdate', function (next) {
    this._update.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    next();
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
