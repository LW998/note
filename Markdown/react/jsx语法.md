## ReactDOM.render

```javascript
/* 
ReactDOM.render([jsx],[container],[callback]);
jsx：React虚拟元素
container：容器，把元素放到页面中的哪个容器中
callback： 当把内容放到容器中呈现触发的回调函数

JSX：JavaScript+xml（HTML）
1.不建议直接放到body中，而是放在自建的容器中，一般放在id为root的容器中
2.括号中不能放对象数据类型的值(对象、数组、函数都不行)（除了Style中放对象），可以是基本类型的值(布尔类型不显示，null和undefined也是不显示的)
3.循环数组创建jsx元素（一般都是基于数组的map完成迭代）,循环需要有返回值。需要给创建的元素设置唯一的key值
4.只能出现一个根元素
5.给元素设置样式类用的是className而不是class
6.行内样式style中不能直接写字符串需要基于一个样式对象来遍历赋值
*/
let root = document.getElementById('root')
let data = [
  {
    name: '张三',
    age: 11,
  },
  {
    name: '李四',
    age: 13,
  },
]
ReactDOM.render(
  <div id="hello">
    <ul>
      {data.map((item, index) => {
        let { name, age } = item
        return (
          <ul
            id="box"
            key={index}
            className="box"
            style={{
              backgroundColor: 'lightpink',
              width: '300px',
              height: '30px',
              lineHeight: '30px',
            }}
          >
            <li style={{ color: 'blue' }}>
              <span>{name}</span>
              <span>{age}</span>
            </li>
          </ul>
        )
      })}
    </ul>
  </div>,
  root
)

```

### JSX渲染流程

> 1.通过语法解析包babel解析成React.createElement

```javascript
React.createElement(
    'div',
    {
      id: 'hello',
    },
     React.createElement(
      'ul',
      null,
      data.map((item, index) => {
        let { name, age } = item
        return  React.createElement(
          'ul',
          {
            id: 'box',
            key: index,
            className: 'box',
            style: {
              backgroundColor: 'lightpink',
              width: '300px',
              height: '30px',
              lineHeight: '30px',
            },
          },
          React.createElement(
            'li',
            {
              style: {
                color: 'blue',
              },
            },
             React.createElement('span', null, name),
             React.createElement('span', null, age)
          )
        )
      })
    )
  )
```



> 2.执行React.createElement生成的对象

> 3.基于ReactDOM.render方法把生成的对象动态创建成DOM元素，插入到指定容器中

