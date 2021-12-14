export default {
  name: 'ElCol',

  // props

  // span ------> 栅格占据的列数 --------> number --------> 默认值24
  // offset ----> 栅格 ( 左侧 ) 的间隔格数 -----> number --> 0
  // push ------> 栅格向右移动格数 -------> number --------> 0
  // pull ------> 栅格向左移动格数 -------> number --------> 0
  // tag -------> 自定义元素标签 -------> string --------> div
  // xs ----> <768px 响应式栅格数或者栅格属性对象 --> number/object
  // sm ----> ≥768px
  // md ----> ≥992px
  // lg ----> ≥1200px
  // xl ----> ≥1920px
  // extraSmall small middle large extraLarge
  // 768 768 992 1200 1920

  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },

  computed: {
    gutter() {
      let parent = this.$parent; // vm.$parent 获取父组件
      while (parent && parent.$options.componentName !== 'ElRow') {
        // 如果父组件上不包含componentName，就继续往上找，因为只有el-row组件的配置项上具有componentName属性
        // 浅层目的：这样做的目的是要让 el-col 和 el-row 来一一配对，向上寻找最近的 el-row 和 el-col 来配对
        // 更深的目的：就是为了获取最近父el-row组件上的 gutter 属性
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
  },
  render(h) {
    let classList = [];
    let style = {};
    // style对象中的属性最终会作为el-row的style属性传入
    // - paddingLeft = gutter的一半
    // - paddingRight = gutter的一半
    // ---> 而el-row上的style中有 marginLeft和marginRight 分别是 ( 负的gutter的一半 )
    // ---> 在el-row的最左边和左右边所以相互抵消了

    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if (this[prop] || this[prop] === 0) { // 两个条件满足一个就可以
        classList.push(
          prop !== 'span'
            ? `el-col-${prop}-${this[prop]}` // 非span
            : `el-col-${this[prop]}` // span
            // 这里需要注意，如果span不传值时，默认值是24，即 el-col-24
        );
      }
    });

    // xs sm md lg xl 几个属性可以 number｜ object
    // 为object时 { span:4, offset:4，... } 这样的格式
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      if (typeof this[size] === 'number') { // number
        classList.push(`el-col-${size}-${this[size]}`);
      } else if (typeof this[size] === 'object') { // object
        let props = this[size];
        Object.keys(props).forEach(prop => { // 遍历该对象的key，key只能是 span，offset, push, pull
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}` // 非span
              : `el-col-${size}-${props[prop]}` // span，即 遍历响应类型 + 响应类型对应的object中的每个值
          );
        });
      }
    });

    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default);
  }
};
