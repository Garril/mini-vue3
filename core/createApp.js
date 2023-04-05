import { effectWatch, mountElement } from './index'
export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      effectWatch(() => {
        rootContainer.textContent = ``
        const subTree = rootComponent.render(setupResult)
        mountElement(subTree, rootContainer)
      })
    }
  }
}
