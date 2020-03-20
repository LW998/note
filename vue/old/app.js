//全局变量
// let data = {
//     name: 'liwei',
//     age: '21',
//     panda: false,
// };
// //全局组件
// Vue.component('great', {
//     //模板
//     template: `<p>全局样式
//     我的名字是<span v-if="panda">{{name}}</span>
//     <span v-else>{{age}}</span>,年龄{{age}}
//     <button @click='panda=!panda'>改名</button>
//     </p>`,
//     //属性
//     data() {
//         return data;
//     },
//     //方法
//     computed: {

//     },
// });

const one = new Vue({
    el: '#app_one',
    data() {
        return {
            todos: [],
            tod: {
                title: '',
                completed: false,
            }
        }
    },

    mounted() {
        //GET
        fetch("http://jsonplaceholder.typicode.com/todos").then(
                res => {
                    return res.json();
                })
            .then(to => {
                this.todos = to;
            })
    },
    methods: {
        onSubmit() {
            console.log(this.tod)
            //post
            fetch("http://jsonplaceholder.typicode.com/todos", {
                method: 'POST',
                body: JSON.stringify(this.tod),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                return res.json();
            }).then(todo => {
                this.todos.unshift(todo);
            })
        }
    },
    computed: {

    },
});

const two = new Vue({
    el: '#app_two',
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {

    },
});