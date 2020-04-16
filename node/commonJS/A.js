let sum = (...arg) => {
    // return eval(arg.join('+'));
    // let total = 0;
    // for (let i = 0; i < arg.length; i++) {
    //     total += arg[i];
    // }
    // return total
    return arg.reduce((a, b) => a + b);
}

module.exports = {
    sum,
}