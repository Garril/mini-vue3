import { createApp, effectWatch, h, reactive } from '../../core/index'
export default {
  // template -> render
  render(context) {
    return h('div', { id: 'box' }, [
      h('div', { class: 'inner_div' }, [h('span', {}, 'I am text1')]),
      h('div', {}, [h('span', {}, 'context.obj.count: ' + context.obj.count)])
    ])
  },
  setup() {
    const obj = reactive({
      count: 1
    })
    window.obj = obj
    return {
      obj
    }
  }
}
