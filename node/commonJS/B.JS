let A = require('./A');
let avg = (...arg) => A.sum(...arg) / arg.length

module.exports = {
    avg,
};