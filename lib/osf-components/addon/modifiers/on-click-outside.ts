import { modifier } from 'ember-modifier';

export default modifier((element: HTMLElement, [callback]: [any]) => {
    function handleClick(event: Event) {
        if (!element.contains(event.target as any)) {
            callback();
        }
    }
    document.addEventListener('click', handleClick);
    return () => {
        document.removeEventListener('click', callback);
    };
});
