export default function closest(el, selector) {
    const matchesSelector = el.matches
        || el.matchesSelector
        || el.webkitMatchesSelector
        || el.mozMatchesSelector
        || el.msMatchesSelector
        || el.oMatchesSelector;

    if (typeof selector !== 'string') {
        while (el) {
            if (el === selector) {
                break;
            }

            el = el.parentElement;
        }
    } else {
        while (el) {
            if (matchesSelector.call(el, selector)) {
                break;
            }

            el = el.parentElement;
        }
    }


    return el;
}
