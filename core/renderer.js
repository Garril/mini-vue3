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

function remove(el, parent) {
  parent.removeChild(el)
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
// 真正diff算法路径：runtime-core/renderer.ts/patchElement
export function diff(n1, n2) {
  // 1.tag
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(createElement(n2.tag))
  } else {
    // 2.props
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
    // 3.children
    /*
      1. new string old string
      2. new string old array
      3. new array old string
      4. new array old array
    */
    const oldChildren = n1.children
    const newChildren = n2.children
    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string' && oldChildren !== newChildren) {
        // 1. new string old string
        el.innerText = newChildren
      } else if (Array.isArray(oldChildren)) {
        // 2. new string old array
        el.innerText = newChildren
      }
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren === 'string') {
        // 3. new array old string
        el.innerText = ''
        newChildren.forEach((child) => {
          mountElement(child, el)
        })
      } else if (Array.isArray(oldChildren)) {
        // 4. new array old array(暴力版)
        /*
          A. new > old  -> add
          B. new < old  -> remove
          这里没有考虑 [a,b,c] -> [a,c,b]的节点复用情况
        */
        const commonLen = Math.min(newChildren.length, oldChildren.length)
        for (let i = 0; i < commonLen; i++) {
          const oldVnode = oldChildren[i]
          const newVnode = newChildren[i]
          diff(oldVnode, newVnode)
        }
        // A. new > old  -> add
        if (newChildren.length > commonLen) {
          for (let i = commonLen; i < newChildren.length; i++) {
            const vnode = newChildren[i]
            mountElement(vnode, el)
          }
        }
        // B. new < old  -> remove
        if (oldChildren.length > commonLen) {
          for (let i = commonLen; i < oldChildren.length; i++) {
            const vnode = oldChildren[i]
            remove(vnode.el, el)
          }
        }
      }
    }
  }
}
