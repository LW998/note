const axios = require('axios');
const fs = require('fs')

async function getPage(num) {
    let httpUrl = `http://www.app-echo.com/api/recommend/sound-day?page=${num}`
    let res = await axios.get(httpUrl);
    res.data.list.forEach(item => {
        let title = item.sound.name;
        let mp3Url = item.sound.source;
        title = title.trim().replace(/\[|\]|《|》|【|】|「|」|!|——|[a-zA-Z]+|'|\*| |\?/g, '')
        download(title, mp3Url)
    })
}

async function download(title, mp3Url) {
    let res = await axios.get(mp3Url, {
        responseType: "stream"
    })
    let ws = fs.createWriteStream(`./mp3/${title}.mp3`)
    res.data.pipe(ws)
        // res.data.on('close', () => {
        // ws.close()
        // })
}

getPage(1)