~ function anonymous(window) {
    class tabPlugin {
        constructor(container, options = {}) {
            //第一个参数必传
            if (typeof container === 'undefined' || container.nodeType !== 1) {
                throw new SyntaxError('The first parameter is the item that must be passed, and it must be an element object type!');
            }
            //参数初始化（初始化配置项）
            let {
                lastIndex = 0,
                    eventType = 'mouseover',
                    customPageClass = 'option',
                    customContentClass = 'con',
                    changeEnd
            } = options;

            //把处理好的参数配置项挂载到当前类的实例上，成为实例的私有属性
            //这样不仅在公共或者私有方法可以获取使用，而且也保证每一个实例之间是不冲突的
            ['lastIndex', 'eventType', 'customPageClass', 'customContentClass', 'changeEnd'].forEach(item => {
                //this:实例，如果用function：this是window
                this[item] = eval(item);
            });
            //获取需要操作的元素并挂载到实例上
            this.container = container;
            let child = [...container.children],
                option = null;
            option = child.find(item => this.hasClass(item, this.customPageClass));
            this.optionList = options ? [...option.children] : [];
            this.conList = child.filter(item => this.hasClass(item, this.customContentClass));
            //=>让个LAST-INDEX对应项有选中样式，其余项没有选中样式
            this.optionList.forEach((item, index) => {
                if (index === this.lastIndex) {
                    this.addClass(this.optionList[index], 'active');
                    this.addClass(this.conList[index], 'active');
                    return;
                }
                this.removeClass(this.optionList[index], 'active');
                this.removeClass(this.conList[index], 'active');
            });

            //=>实现选项卡
            this.changeTab();

        }
        hasClass(ele, str) {
            return ele.className.trim().split(/ +/).indexOf(str) >= 0;
        }

        addClass(ele, str) {
            if (this.hasClass(ele, str)) return;
            ele.className += ` ${str}`;
        }
        removeClass(ele, str) {
            if (!this.hasClass(ele, str)) return;
            ele.className = ele.className.trim().split(/ +/).filter(item => item !== str).join(' ');
        }
        changeTab() {
            this.optionList.forEach((item, index) => {
                //this:实例
                let _this = this;
                item[`on${this.eventType}`] = function anonymous() {
                    //this当前操作的li，_this:实例
                    if (_this.lastIndex === index) return;
                    _this.addClass(this, 'active');
                    _this.removeClass(_this.optionList[_this.lastIndex], 'active');

                    _this.addClass(_this.conList[index], 'active');
                    _this.removeClass(_this.conList[_this.lastIndex], 'active');
                    _this.lastIndex = index;
                    //切换完毕后执行传递的回调函数
                    //参数(当前的LI，当前的con，当前的索引，上一项的索引)
                    _this.changeEnd && _this.changeEnd(this, _this.conList[index], index, _this.lastIndex);
                };
            });
        }

    }
    window.tabPlugin = tabPlugin;
}(window);