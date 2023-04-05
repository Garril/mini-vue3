// 自定义渲染器
// 后续当用户想跨平台的时候，只需要重写这个函数即可。
function createElement(tag) {
  return document.createElement(tag)
}

function patchProps(el, key, preValue, nextValue) {
  // event listener
  if (key.startsWith('on')) {
    el.addEventListener(key.slice(2).toLowerCase(), nextValue)
  } else {
    el.setAttribute(key, nextValue)
  }
}

function insert(el, parent) {
  parent.append(el)
}

function createTextNode(text) {
  return document.createTextNode(text)
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode
  const el = (vnode.el = createElement(tag))
  // props
  if (props) {
    // object
    for (const key in props) {
      const value = props[key]
      patchProps(el, key, null, value)
    }
  }
  // children
  if (children) {
    // array --- notice: if([])==> true
    if (typeof children === 'string') {
      insert(createTextNode(children), el)
    } else if (Array.isArray(children)) {
      children.forEach((child) => {
        mountElement(child, el)
      })
    }
  }
  insert(el, container)
}
