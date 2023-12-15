class CustomSelect extends HTMLElement {
  constructor() {
    super();

    this.value = null;
    this.isExpanded = false;
  }

  /**
   * В зависимости от атрибута "multiple" выбор одного или нескольких значений из выпадающего списка
   */
  selectHandler(node) {
    return (e) => {
      e.stopPropagation();

      if (this.getAttribute('multiple')) {
        this.value = this.value ?? [];

        this.value.includes(node.textContent)
          ? this.value = this.value.filter(elem => elem !== node.textContent)
          : this.value.push(node.textContent);

        this._shadowRoot.querySelector('.hidden-input').value = this.value.join(', ');
        this._shadowRoot.querySelector('.select-field').innerHTML = this.value.join(', ');

        [...this.children].forEach(item => {
          if (this.value.includes(item.textContent)) {
            item.classList.add('selected-item');
          } else {
            item.classList.remove('selected-item');
          }
        });
      } else {
        this.value = node.textContent;
        this._shadowRoot.querySelector('.hidden-input').value = this.value;
        this._shadowRoot.querySelector('.select-field').innerHTML = this.value;

        [...this.children].forEach(item => item.classList.remove('selected-item'));
        node.classList.add('selected-item');
      }

      this.isExpanded = true;
      this._shadowRoot.querySelector('ul.select-menu').classList.remove('open');
    }
  }

  /**
   * Открытие выпадающего списка селекта
   */
  clickMenu = () => {
    this.isExpanded = !this.isExpanded;
    this._shadowRoot.querySelector('ul.select-menu').classList.add('open');
  }

  static get observedAttributes() {
    return ['placeholder','defaultValue', 'name', 'multiple'];
  }

  connectedCallback() {
    this._shadowRoot = this.attachShadow({mode: 'open'});

    const template = document.querySelector('#template');
    this.shadowRoot.append(template.content.cloneNode(true));

    this.shadowRoot.querySelector('.select-field').addEventListener('click', this.clickMenu);
    this.shadowRoot.querySelector('.select-field').innerHTML = this.getAttribute('defaultValue') ?? this.getAttribute('placeholder');

    /**
     * Установка значения по дефолту, если передан атрибут "defaultValue"
     */
    if (this.getAttribute('defaultValue')) {
      this.shadowRoot.querySelector('.select-field').innerHTML = this.getAttribute('defaultValue');
      [...this.children].find(elem => elem.textContent === this.getAttribute('defaultValue')).classList.add('selected-item');

      this.getAttribute('multiple')
        ? this.value = [this.getAttribute('defaultValue')]
        : this.value = this.getAttribute('defaultValue');
    }

    this.childNodes.forEach((node) => node.addEventListener('click', this.selectHandler(node)));
  }

  disconnectedCallback() {
    this.childNodes.forEach((node) => node.removeEventListener('click', this.selectHandler(node)));
    this.shadowRoot.querySelector('.select-field').removeEventListener('click', this.clickMenu);
  }
}

customElements.define('custom-select', CustomSelect);
