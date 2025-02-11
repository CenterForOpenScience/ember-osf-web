import { registerDestructor } from '@ember/destroyable';
import { inject as service } from '@ember/service';

import Analytics from 'ember-osf-web/services/analytics';

import Modifier from 'ember-modifier';

interface TrackDownloadModifierArgs {
    Args: {
        Positional: [string],
        Named: {
            doi?: string,
            event?: string,
        },
    };
}

export default class TrackDownloadModifier extends Modifier<TrackDownloadModifierArgs> {
    @service analytics!: Analytics;

    _destructors: Array<() => void> = [];

    constructor(owner: any, args: any) {
        super(owner, args);
        registerDestructor(this, () => this._run_destructors());
    }

    modify(element: any, [osfguid]: [string], {doi, event = 'click'}: {doi?: string, event?: string}): void {
        this._run_destructors();
        const _eventHandler = () => this.analytics.trackDownload(osfguid, doi);
        this._addEventListenerWithDestructor(element, event, _eventHandler);
    }

    _addEventListenerWithDestructor(element: any, event: any, handler: any) {
        element.addEventListener(event, handler);
        const _destructor = () => element.removeEventListener(event, handler);
        this._destructors.push(_destructor);
    }

    _run_destructors() {
        this._destructors.forEach(_destruct => _destruct());
        this._destructors.clear();
    }
}
