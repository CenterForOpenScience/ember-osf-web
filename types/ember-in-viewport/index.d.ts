declare module 'ember-in-viewport/services/in-viewport.js' {
    import { A } from '@ember/array';
    import Computed from '@ember/object/computed';
    import Service from '@ember/service';

    export default class InViewport extends Service {
        stopWatching: (a: HTMLElement | null, ...args: any[]) => void;

        watchElement: (a: HTMLElement | null, ...args: any[]) => {
            onEnter: (a: () => void) => void,
            onExit: (a: () => void) => void,
        };
    }
}
