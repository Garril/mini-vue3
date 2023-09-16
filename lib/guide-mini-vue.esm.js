var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN"; // 1000
})(ShapeFlags || (ShapeFlags = {}));
// num..toString('2') --> get num's binary system

const PublicInstanceProxyHanlders = {
    get({ _: instance }, key) {
        // setupState
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // $el -> the root dom element
        if (key == '$el') {
            return instance.vnode.el;
        }
        // $data
        // $props
        // $options
        // $parent
        // $root
        // $slots
        // $refs
        // $attrs
    }
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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHanlders);
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
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.ELEMENT) {
        // processElement (type == element)
        processElement(vnode, container);
    }
    else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
function mountComponent(initVnode, container) {
    /* instance may be:
      const component = {
        vnode: vnode --> { type,props,children },
        type: vnode.type --> { render,setup }
      };  */
    const instance = createComponentInstance(initVnode);
    /* instance attached lots of attributes by setupComponent
      such as:
        setupState and render (it's just run the methods before) */
    setupComponent(instance);
    // get tree and patch
    setupRenderEffect(instance, initVnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children, shapeFlag } = vnode;
    // create dom(element type vnode like: "div")
    const el = (vnode.el = document.createElement(type));
    // props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    // children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
function setupRenderEffect(instance, initVnode, container) {
    const { proxy } = instance;
    // get vnode
    const subTree = instance.render.call(proxy);
    // mountElement
    patch(subTree, container);
    // after all the element mounted.
    // subTree is the root vnode,we can get el through it,attach it into component's vnode
    initVnode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlag(type)
    };
    // children
    if (typeof children == 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type == 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
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
