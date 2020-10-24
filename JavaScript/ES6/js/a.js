let name = '小明',
  age = 18,
  flag = true
let sum = (num1, num2) => num1 + num2
if (flag) {
  console.log(sum(20, 30))
}
//1.导出方式一
export { flag, sum }

//2.导出方式二
export let num1 = 1000
export let height = 1.8

//3.导出方式三
let a = 1,
  b = 2,
  c = 3
export { a, b, c }

//4.导出函数/类
export function ma(num1, num2) {
  console.log(arguments)
  return num1 * num2
}

export class person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  run() {
    console.log(this.age + '岁的' + this.name + '跑')
  }
}
//5.export default
const address = '湖南'

//只能有一个，导入的时候名字可以随便起
export default address
