export function h(tag, props, children) {
  return {
    tag,
    props,
    children,
  }
}

export function mount(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.tag))

  if (vnode.props) {
    Object.keys(vnode.props).forEach((key) => {
      el.setAttribute(key, vnode.props[key])
    })
  }

  if (vnode.children) {
    if (typeof vnode.children === 'string') {
      el.innerHTML = vnode.children
    } else {
      vnode.children.forEach((i) => {
        mount(i, el)
      })
    }
  }

  container.appendChild(el)
}

export function patch(h1, h2) {
  const el = (h2.el = h1.el)
  const [oldChildren, newChildren] = [h1.children, h2.children]

  // Assume they have the same tag
  if (h2) {
    // Diff & Update props
    Object.keys(h2.props || {}).forEach((prop) => {
      if (!(prop in h1.props)) {
        // Create
        el.setAttribute(prop, h2.props[prop])
      } else if (h2.props[prop] !== h1.props[prop]) {
        // Update
        el.setAttribute(prop, h2.props[prop])
      } else {
        // Delete
        el.removeAttribute(prop)
      }
    })

    // Diff & Update children
    if (typeof newChildren === 'string') {
      el.innerHTML = newChildren
    } else {
      if (typeof oldChildren === 'string') {
        el.innerHTML = ''
        newChildren.forEach((child) => {
          mount(h2, el)
        })
      } else {
        // Compare two children
        const commonChild = Math.min(oldChildren.length, newChildren.length)
        for (let i = 0; i < commonChild; i++) {
          patch(oldChildren[i], newChildren[i])
        }
        if (oldChildren.length < newChildren.length) {
          newChildren.slice(oldChildren.length).forEach((i) => {
            mount(newChildren[i], el)
          })
        } else if (oldChildren.length > newChildren.length) {
          oldChildren.slice(newChildren.length).forEach((i) => {
            el.removeChild(i)
          })
        }
      }
    }
  }
}
