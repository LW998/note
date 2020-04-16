let express = require('express'),
    app = express();
app.listen(8000, () => {
    console.log('server create on 8000');
});

app.get('/list', (req, res) => {
    let {
        callback = Function.prototype
    } = req.query;
    let data = {
        code: 0,
        msg: 'JSONP',
    };
    res.send(`${callback}(${JSON.stringify(data)})`);
})