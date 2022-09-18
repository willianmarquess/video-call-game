
function createElement(elementType, props = null, text = null, children = []) {
    const element = document.createElement(elementType);

    if(props?.attributes) {
        for (const prop in props.attributes) {
            element.setAttribute(prop, props.attributes[prop]);
        }
    }

    if(props?.events) {
        for (const event in props.events) {
            if(typeof props.events[event] !== 'function') throw new Error('event value must be a callback function')
            element.addEventListener(`${event}`, props.events[event]);
        }
    }

    if (text) element.appendChild(document.createTextNode(`${text}`));

    children.forEach(c => {
        element.appendChild(c);
    });

    return element;
}

export default createElement;