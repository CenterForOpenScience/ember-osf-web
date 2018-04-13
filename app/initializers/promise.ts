import RSVP from 'rsvp';

export function initialize(): void {
    window.Promise = RSVP.Promise;
}

export default {
    name: 'promise',
    initialize,
};

declare global {
    interface Window {
        Promise: any;
    }
}
