import { DataBind } from "./ui-js-data-bind.js";

const tpl = `
  <form>
    <fieldset>
      <input type="text" name="number1"> +
      <input type="text" name="number2"> =
      <input type="text" name="sum" readonly>
      <pre></pre>
    </fieldset>
  </form>
`;

class DataForm extends HTMLElement {
  constructor() {
    super();
    this.binding = new DataBind(this, {});
  }

  connectedCallback() {
    this.innerHTML = tpl;
    this.binding.bindAllInputs(this);

    // Listen to databind updates
    this.addEventListener('updated', ev => {
      const name = ev.detail.name;

      if (name == 'number1' || name == 'number2')
        this.data.sum = parseInt(this.data.number1) + parseInt(this.data.number2);
      else if (name == 'sum' && !Number.isInteger(ev.detail.newValue))
        this.data.sum = 0;

      this.querySelector('pre').innerText = JSON.stringify(this.binding.plainData);
    });
  }

  get data() {
    return this.binding.data;
  }

  set data(obj) {
    // Update binding with new object to bind to
    this.binding.observe(obj);
  }
}

customElements.define('data-form', DataForm);