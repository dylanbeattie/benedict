// html.js

/**
 * Creates an HTML element based on a tag name, attributes and innerText properties.
 * @param {*} tagName - the HTML tag to create, e.g. 'h1', 'div', 'span'
 * @param {*} attributes - a JS object that will be converted to HTML attributes. { id: 'my-heading', style: 'color: red;' }
 * @param {*} innerText - a string to passed to the new element's innerText property.
 * @returns an HTML Element
 */
function element(tagName:string, attributes:object = {}, innerText:string = "") : HTMLElement {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    if (innerText) element.innerText = innerText;
    return element;
}

export { element };

