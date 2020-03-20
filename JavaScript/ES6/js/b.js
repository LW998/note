import {
    sum,
    height,
    num1
} from './a.js'

let name = "小红",
    age = 25,
    flag = false;

console.log(sum(20, 50));
console.log(num1, height);

export {
    name,
    age,
    height
}

//导入函数和类
import {
    ma,
    person
} from "./a.js"

let a = new person(name, age);
a.run();
console.log(ma(10, 20))

//只有default方式导出的才能这样导入
import addr from "./a.js"
console.log(addr)