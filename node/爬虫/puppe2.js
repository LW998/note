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
    // 设置放慢每个步骤的毫秒数
    // slowMo: 200,
  }
  let browser = await puppeteer.launch(options)
  let page = await browser.newPage()

  // 访问页面
  await page.goto('https://www.dytt8.net/index.htm')

  //获取页面对象 单个对象用 $ 多个对象用 $$
  // let elementHandles = await page.$$("#menu li a");
  // elementHandles[2].click()

  let elem = await page.$('#menu > div > ul > li:nth-child(2) > a')
  let elHref = await elem.getProperty('href')
  elHref = elHref._remoteObject.value
  console.log(elHref)
  // 获取输入框
  InputEle = await page.$(
    '#header > div > div.bd2 > div.bd3 > div:nth-child(2) > div:nth-child(1) > div > div.search > form > div.searchl > p:nth-child(1) > input'
  )
  // 光标进入输入框
  await InputEle.focus()
  // 输入内容
  await page.keyboard.type('哪吒')
  // 点击搜索
  // 取消事件冒泡

  /*   await page.$eval('.bd3rl .search', (ele) => {
    ele.addEventListener('click', (ev) => {
      ev.cancelBubble = true
    })
  }) */
  let btnEle = await page.$(
    '#header > div > div.bd2 > div.bd3 > div:nth-child(2) > div:nth-child(1) > div > div.search > form > div.searchr > input[type=Submit]'
  )
  btnEle.click()
}

test()
