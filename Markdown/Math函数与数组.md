## **一、**Math函数

> Math 是一个对象。 console.log(typeof Math)=>object
>
> Math方法中传入非数字字符会调用Number()转化为字符串

####  Math中常用的属性和方法

##### 1.Math.abs([number value])

>获取绝对值（绝对值永远是正数或者零）

``` javascript
console.log(Math.abs(-12.5)) //=>12.5
//传递的不是数字类型的值:先基于Number()转化为数字再转换
console.log(Math.abs('-1')) //=>1
console.log(Math.abs('-1px')) //=>NaN
console.log(Math.abs(true)) //=>1
```

##### 2. Math.ceil /floor([number value])

>把一个数向上取整 / 向下取整数

```javascript
//向上取整比原来的数大
console.log(Math.ceil(12.2)); //=>13
console.log(Math.ceil(-12.2)); //=>-12
console.log(Math.ceil(-12.9)); //=>-12
//向下取整比原来的数小
console.log(Math.floor(12.1)); //=>12
console.log(Math.floor(-12.2)); //=>-13
console.log(Math.floor(-12.9)); //=>-12
```

##### 3. Math.round([number value])

   >四舍五入

```JavaScript
//round无关大小，只看小数点后
console.log(Math.round(12.256)) //=>12
console.log(Math.round(12.5)) //=>13  正数里面.5是进1
console.log(Math.round(12.9)) //=>13

console.log(Math.round(-12.2)) //=>-12
console.log(Math.round(-12.5)) //=>-12 负数里.5是舍1
console.log(Math.round(-12.9)) //=>-13
//如果有Number()转化为undefined结果为NaN
console.log(Math.round(undefined)) //=>NaN
```

##### 4. Math.max / min([value1],[value2],[value3]....)

   >获取一对数中的最大值和最下值

```javascript
//会运用函数的Number方法转为数字，如果有转化为NaN的值则最大最小都是NaN
//最大值
console.log(Math.max(12, 15, 23, '', 12, 45, null, undefined)); //=>NaN
console.log(Math.max(12, 15, 23, '', 12, 45, null)); //=>45
//最小值
console.log(Math.min(12, 15, 23, '', 12, 45, null, undefined)); //=>NaN
console.log(Math.min(12, 15, 23, '', 12, 45, null)); // =>0
```

##### 5. Math.sqrt /pow([number value])

   > sqrt : 给一个数开平方
   >
   > pow : 计算一个数的多少次幂

```
//开方
console.log(Math.sqrt(9)); //=> 3 符合 N*N=M 这样的M才能整数开平方，不然是小数
console.log(Math.sqrt(-9)); //=》NaN 负数开不了平方
//幂
console.log(Math.pow(2, 10)) //=>1024  2的十次方
```

##### 6. Math.random()

   >获取0~1之间的随机小数

```JavaScript
//生成100个0-100之间的随机数
for (let i = 0; i < 100; i++) {
    console.log(Math.round(Math.random() * 100));
}
```

#####  获取[n~m]之间的随机整数

>包含n也包含m
>
>n<m

```JavaScript
Math.round(Math.random() *(m-n)+n)
//最大值m最小值n
```