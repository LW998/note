module.exports = {
    PORT: 8080,
    CORS: {
        //允许请求的源
        ALLOW_ORIGIN: 'http://127.0.0.1:5500',
        //允许请求方式
        ALLOW_METHODS: 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
        //允许的请求头
        HEADERS: 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With',
        //是不是允许携带cookies
        CREDENTIALS: true
    },
    SESSION: {
        secret: 'liw',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }
}