let url = require('url');

console.log(url.parse('https://www.baidu.com/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1#news', true))

/* Url {
    protocol: 'https:',
    slashes: true,
    auth: null,
    host: 'www.baidu.com',
    port: null,
    hostname: 'www.baidu.com',
    hash: '#news',
    search: '?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1',
    query: [Object: null prototype] {
      cl: '3',
      tn: 'baidutop10',
      fr: 'top1000',
      rsv_idx: '2',
      hisfilter: '1'
    },
    pathname: '/s',
    path: '/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1',
    href: 'https://www.baidu.com/s?cl=3&tn=baidutop10&fr=top1000&rsv_idx=2&hisfilter=1#news'
  } */