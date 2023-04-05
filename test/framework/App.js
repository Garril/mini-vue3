import { createApp, effectWatch, reactive } from '../../core/index'
export default {
  // template -> render
  render(context) {
    const element = document.createElement('div')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const text1 = document.createTextNode('I am text1')
    const text2 = document.createTextNode(
      'context.obj.count: ' + context.obj.count
    )
    div1.append(text1)
    div2.append(text2)
    element.append(div1)
    element.append(div2)
    return element
  },
  setup() {
    const obj = reactive({
      count: 1
    })
    return {
      obj
    }
  }
}
