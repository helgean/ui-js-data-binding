/**
 * Create two way databinding by using a Proxy object and change event
 */
export class UiJsDataBind {
  constructor(parent, obj) {
    this.eventSource = parent;
    this.bindings = {};
    this.observe(obj || {});

    this.eventSource.addEventListener('change', ev => {
      if (ev.target.dataset.bind) {
        this._data[ev.target.dataset.bind] = ev.target.value;
      }
    });
  }

  /**
   * Bind all descendant inputs of the parent element to this data source
   * @param {*} parent parent element which holds all inputs being binded
   */
  bindAllInputs(parent) {
    const parentEl = parent || this.eventSource;
    const inputs = parentEl.querySelectorAll('input');

    for (let input of inputs)
      this.bind(input);
  }

  /**
   * Bind an element to a specific property
   * @param {*} el Bind element to a property of the binded object
   * @param {*} propName The property to bind to
   */
  bind(el, propName) {
    const prop = propName || this.getPropName(el);

    if (!Array.isArray(this.bindings[prop]))
      this.bindings[prop] = [];

    el.setAttribute('data-bind', prop);
    this.bindings[prop].push(new WeakRef(el));
  }

  /**
   * Create two way binding to an object by using Proxy
   * @param {*} obj The object to bind to
   */
  observe(obj) {
    this._data = new Proxy(obj, {
      set: (target, key, value) => {
        const oldValue = target[key];
        const newValue = value;

        // Let original object be updated with new value
        target[key] = value;

        if (!this.bindings[key] || oldValue === newValue)
          return;

        // Update binded element with new value
        for (let elRef of this.bindings[key]) {
          const el = elRef.deref();
          if (el)
            el.value = newValue;
          else
            elRef = undefined;
        }

        // dispatch updated event
        this.eventSource.dispatchEvent(new CustomEvent('updated', {
          bubbles: true,
          detail: {
            name: key,
            oldValue: oldValue,
            newValue: newValue
          }
        }));

        return true;
      }
    });
  }

  /**
   * Get name of property this element is binded to
   * @param {*} el Element
   * @returns binded property name as string
   */
  getPropName(el) {
    return el.dataset && el.dataset.bind ? el.dataset.bind : el.name;
  }

  /**
   * Get the binded/proxied data object
   */
  get data() {
    return this._data;
  }

  get plainData() {
    return {...this.data};
  }
}