import { effectWatch } from './reactivity'
import { mountElement, diff } from './renderer'
export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      let prevSubTree
      let isMounted = false

      effectWatch(() => {
        if (!isMounted) {
          isMounted = true
          const subTree = rootComponent.render(setupResult)
          prevSubTree = subTree
          mountElement(subTree, rootContainer)
        } else {
          const subTree = rootComponent.render(setupResult)
          // diff
          diff(prevSubTree, subTree)
          prevSubTree = subTree
        }
      })
    }
  }
}
