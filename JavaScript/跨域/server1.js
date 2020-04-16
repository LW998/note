let express = require('express'),
    app = express();
app.listen(1001, () => {
    console.log('server create on 1001');
});

app.use(express.static('./'));