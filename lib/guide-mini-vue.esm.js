const isObject = (val) => {
    return val != null && typeof val == 'object';
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    /*
      instance is an object:
      { vnode: { type,props,children} and type is object exported by App.js,
        type: vnode.type
      }
    */
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    // create proxy for "this" in template
    instance.proxy = new Proxy({}, {
        get(target, key) {
            // setupState
            const { setupState } = instance;
            if (key in setupState) {
                return setupState[key];
            }
            // $el -> the root dom element
            if (key == '$el') {
                return instance.vnode.el;
            }
        }
    });
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult == 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    console.log('vnode.type: ', vnode.type);
    // check type of vnode
    if (typeof vnode.type == 'string') {
        // processElement (type == element)
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // processComponent (type == component)
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountComponent(vnode, container) {
    /* instance may be:
      const component = {
        vnode: vnode --> { type,props,children },
        type: vnode.type --> { render,setup }
      };  */
    const instance = createComponentInstance(vnode);
    /* instance attached lots of attributes by setupComponent
      such as:
        setupState and render (it's just run the methods before) */
    setupComponent(instance);
    // get tree and patch
    setupRenderEffect(instance, vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    // create dom(element type vnode like: "div")
    const el = (vnode.el = document.createElement(type));
    // props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    // children
    if (typeof children == 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // mount dom
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((vnode) => {
        patch(vnode, container);
    });
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    // get vnode
    const subTree = instance.render.call(proxy);
    // mountElement
    patch(subTree, container);
    // after all the element mounted.
    // subTree is the root vnode,we can get el through it.
    vnode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // transform to vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
