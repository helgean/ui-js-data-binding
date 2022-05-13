## two-way databinding

Simple example of Modern two-way databinding with vanilla javascript and Proxy object.

This example binds all inputs on a form to an object:

##### form.js:

```javascript
import { UiJsDataBind } from "./ui-js-data-bind.js";

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
    this.binding = new UiJsDataBind(this, {});
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
```

##### index.html:

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=1000, initial-scale=1.0">
  <title>Document</title>
  <script type="module" src="form.js"></script>
</head>
<body>
  <data-form></data-form>
</body>
</html>
```

