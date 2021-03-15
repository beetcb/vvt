// Alias for cb func (used inside Dep)
let activeEffect = null

// Dependency tracking: track deps at component level (subscrbers depends on component)
class Dep {
  // Store deps cb
  subscribers = new Set()

  // Add dep cb to subscribers
  depend() {
    if (activeEffect && !(activeEffect in this.subscribers)) {
      this.subscribers.add(activeEffect)
    }
  }

  // Value changed, call watchEffect cb func
  notify() {
    this.subscribers.forEach((cb) => cb())
  }
}

export function watchEffect(cb) {
  activeEffect = cb
  cb()
  activeEffect = null
}

export function reactive(data) {
  // getter & setter approach
  /*
  Object.keys(data).forEach((key) => {
    const dep = new Dep()
    let value = data[key]
    // Rewrite data key's getter and setter
    Object.defineProperty(data, key, {
      get() {
        dep.depend()
        return value
      },
      set(newValue) {
        value = newValue
        dep.notify()
      },
    })
  })
  return data
  */

  // Store different targets, using target Object as their key, depsMap as their value
  /*
    targetMap:WeakMap {
      target:Object {} => depsMap:Array {
        key => dep:Dep Class,
        key => dep:Dep Class
      },
      target:Object {} => depsMap:Array {
        key => dep:Dep Class,
      },
    }
  */
  const targetMap = new WeakMap()

  // Create & reactivate dep entity
  function handleDeps(target, key, value) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
      dep = new Dep()
      depsMap.set(key, dep)
    }

    value ? dep.notify() : dep.depend()
  }

  // Proxy approach
  return new Proxy(data, {
    get(target, key, receiver) {
      handleDeps(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      // set => then notify, order matters
      const result= Reflect.set(target, key, value, receiver)
      handleDeps(target, key, value)
      return result
    },
  })
}
