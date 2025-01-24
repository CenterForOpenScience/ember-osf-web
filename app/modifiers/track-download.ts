import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

import Modifier from 'ember-modifier';

interface TrackDownloadModifierArgs {
    Args: {
        Positional: [string],
        Named: {
            doi?: string,
        },
    };
}


export default class TrackDownloadModifier extends Modifier<TrackDownloadModifierArgs> {
    @service analytics!: Analytics;

    _cleanups: Array<() => void> = [];

    constructor(owner: any, args: any) {
        super(owner, args);
        registerDestructor(this, () => this.cleanup());
    }

    cleanup() {
        // call each "cleanup" function
        this._cleanups.map(_fn => _fn());
        this._cleanups.clear();
    }

    modify(element: any, [osfguid]: [string], {doi}: {doi?: string}): void {
        this.cleanup();
        this._addEventListenerWithCleanup(
            element,
            'click',
            () => this.analytics.trackDownload(osfguid, doi),
        );
    }

    _addEventListenerWithCleanup(element: Element, event: any, handler: any) {
        element.addEventListener(event, handler);
        this._cleanups.push(
            () => element.removeEventListener(event, handler),
        );
    }
}
