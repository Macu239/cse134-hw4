/**
 * <hello-world> - Custom Element #2.
 * Logs "Hello World!" to the browser console when placed on a page.
 * It intentionally does not read from or modify the DOM.
 */
class HelloWorld extends HTMLElement {
  /**
   * Called when the element is inserted into the document.
   * @returns {void}
   */
  connectedCallback() {
    console.log('Hello World!');
  }
}

customElements.define('hello-world', HelloWorld);
