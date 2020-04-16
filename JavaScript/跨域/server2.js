let express = require('express'),
    app = express();
app.listen(1002, () => {
    console.log('server create on 1002');
});

app.use(express.static('./'));