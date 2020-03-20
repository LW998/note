import {
    a,
    b,
    c,
    flag,
    sum
} from "./a.js"
import {
    name
} from "./b.js"
if (flag) {
    console.log("小明")
    console.log(sum(a, b), c);
    console.log(name)
}

//统一全部导入
import * as bbb from "./b.js"

console.log(bbb.height);