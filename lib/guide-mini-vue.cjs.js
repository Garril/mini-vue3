'use strict';

const isObject = (val) => {
    return val != null && typeof val == 'object';
};
const isOnEvent = (key) => {
    // is [A-Z],so onClick's "C" must be capitalized
    return /^on[A-Z]/.test(key);
};
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN"; // 1000
})(ShapeFlags || (ShapeFlags = {}));
// num..toString('2') --> get num's binary system

const targetMap = new WeakMap();
class Dep {
    constructor(value) {
        this._val = value;
        this.effects = new Set();
    }
    get value() {
        this.depend();
        return this._val;
    }
    set value(val) {
        this._val = val;
        this.notify();
    }
    // 收集依赖
    depend() {
    }
    // 触发依赖
    notify() {
        triggerEffects(this.effects);
    }
}
function getDep(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Dep(target[key]);
        depsMap.set(key, dep);
    }
    return dep;
}
// trigger dependency
function triggerEffects(effects) {
    effects &&
        effects.forEach((effect) => {
            if (effect.scheduler) {
                effect.scheduler();
            }
            else {
                effect.run();
            }
        });
}
function trigger(target, key) {
    const dep = getDep(target, key);
    dep.notify();
}

// create when it init,then the function won't be called many times.
const getter = createGetter(false);
const readonlyGetter = createGetter(true);
const shallowReadonlyGetter = createGetter(true, true);
const setter = createSetter();
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        if (key == "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key == "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const val = Reflect.get(target, key, receiver);
        // if the reactive obj(proxy) is shallow,
        // it doesn't matter whether its props is object or not,just return.
        if (isShallow) {
            return val;
        }
        // if the val was an object,it should be transformed to reactive object.
        if (isObject(val)) {
            return isReadonly ? readonly(val) : reactive(val);
        }
        return val;
    };
}
function createSetter() {
    return function set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver);
        trigger(target, key);
        return res;
    };
}
// normal proxy event handlers
const mutableHandlers = {
    get: getter,
    set: setter,
    // we can have other traps
    has() {
        // track operations like: xxx in state
        return true;
    },
    ownKey() {
        // track operations like: Object.keys(state)
        return true;
    }
};
// proxy event handlers for readonly
const readOnlyHandlers = {
    get: readonlyGetter,
    set(target, key, value) {
        console.warn(`key:${key} set failed.Because target is readonly`);
        return true;
    },
    // we can have other traps
    has() {
        // track operations like: xxx in state
        return true;
    },
    ownKey() {
        // track operations like: Object.keys(state)
        return true;
    }
};
const shallowReadonlyHandlers = Object.assign({}, readOnlyHandlers, {
    get: shallowReadonlyGetter
});

function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readOnlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
// create reactive obj
function createReactiveObject(target, proxyHandler) {
    if (!isObject(target)) {
        console.warn(`target ${target} must be an object`);
        return target;
    }
    return new Proxy(target, proxyHandler);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // attrs
}

const PublicInstanceProxyHanlders = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            // setupState
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            // $props
            return props[key];
        }
        // $el -> the root dom element
        if (key == '$el') {
            return instance.vnode.el;
        }
        // $data
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
        setupState: {},
        props: {}
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
    initProps(instance, instance.vnode.props);
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    // create proxy for "this" in template
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHanlders);
    const { setup } = component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props));
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
        if (isOnEvent(key)) {
            // event listener
            const eventName = key.slice(2).toLowerCase();
            el.addEventListener(eventName, val);
        }
        else {
            el.setAttribute(key, val);
        }
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

exports.createApp = createApp;
exports.h = h;
