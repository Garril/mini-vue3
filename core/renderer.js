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
    // props
    if (nextValue === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextValue)
    }
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
// n1 -> oldVnode
// n2 -> newVnode
export function diff(n1, n2) {
  // 1.tag
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(createElement(n2.tag))
  } else {
    // props
    /*
      old = {a}
      new = {a,b}
      (add b)
    */
    const oldProps = n1.props
    const newProps = n2.props
    const el = (n2.el = n1.el)
    if (newProps) {
      for (const key in newProps) {
        if (oldProps[key] !== newProps[key]) {
          patchProps(el, key, oldProps[key], newProps[key])
        }
      }
    }
    /*
      old = {a,b}
      new = {b}
      (remove a)
    */
    if (oldProps) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          patchProps(el, key, oldProps[key], null)
        }
      }
    }
    // children
  }
  // 2.props

  // 3.children
}
