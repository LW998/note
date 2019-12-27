// let person = {
//     name: '李威',
//     age: 21,
//     height: '170CM',
//     weight: '70KG',
//     1: 200
// }
// console.log(person.name);
// console.log(person['age']);
// console.log(person.sex);
// console.log(person[1]);

// let arr = [1, 2, 3, 4, 5, 'aa']

// console.log(arr);
// arr[arr.length] = 8;

// let a = {
//     n: 1
// };
// let b = a;
// a.x = a = {
//     n: 2
// };
// console.log(a.x);
// console.log(b);

//判断为false的五种情况 0、NaN、null、''、undefined
// console.log(Number([]));


//浏览器窗口弹框 alert/confirm/prompt
//三种方法输出之间都会先执行toString方法
//都会会阻断当前代码的执行，页面不点继续代码不会执行
//1 . alert
// for (var i = 0; i < 5; i++) {
//     alert(i);
//     console.log(i);
// }
//2 .confirm确认选择型弹框
//confirm('确定要？');

//3. prompt 在选择型弹框上多了一个输入框
//prompt('确定要？请说明原因');

//4.document.write往页面中写入

// let a = [{
//         name: 'lisi',
//         id: 22
//     }, {
//         name: 'zhangsan',
//         id: 11
//     },
//     {
//         name: 'wangwu',
//         id: 33
//     }
// ]
// 
// console.table(a);