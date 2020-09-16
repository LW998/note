let puppeteer = require('puppeteer')

async function test() {
    let options = {
        // headless有无界面 false:有界面，true:无界面
        headless: false,
        //设置视图大小
        // defaultViewport: { width: 1595, height: 754 },
        defaultViewport: null,
        // 设置窗口最大化
        args: ['--start-maximized'],
    }
    let browser = await puppeteer.launch(options)
    let page = await browser.newPage()

    // 访问页面
    await page.goto('https://www.dytt8.net/index.htm')

    // 网页截图
    // await page.screenshot({path: 'aa.png'})

    // 获取页面
    // $$eval函数可以运行在浏览器中，并且通过浏览器的方式进行输出
    let elements = await page.$$eval('#menu > div > ul > li > a', (ele) => {
        // console.log('ele: ', ele)
        let eleArr = []
        ele.forEach((item) => {
            // console.log(item.innerHTML)
            if (item.getAttribute('href') != "#") {
                let eleObj = {
                    href: item.getAttribute('href'),
                    text: item.innerText
                }
                eleArr.push(eleObj)
                console.log(eleObj);
            }
        })
        return eleArr
    })

    // 打开新页面
    let chinaPage = await browser.newPage();
    await chinaPage.goto(elements[2].href);
    console.log(elements);
    // 监听浏览器控制台的输出
    // page.on('console', (eventMsg) => {
    //     console.log(eventMsg.text())
    // })
}

test()