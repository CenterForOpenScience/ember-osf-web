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

function cleanup(instance: TrackDownloadModifier) {
    const { element, event, handler } = instance;

    if (element && event && handler) {
        element.removeEventListener(event, handler);

        instance.element = undefined;
        instance.event = null;
        instance.handler = null;
    }
}

export default class TrackDownloadModifier extends Modifier<TrackDownloadModifierArgs> {
    @service analytics!: Analytics;

    element?: Element;
    event?: any;
    handler?: any;

    constructor(owner: any, args: any) {
        super(owner, args);
        registerDestructor(this, cleanup);
    }

    modify(element: any, [osfguid]: [string], {doi}: {doi?: string}): void {
        const doTrackDownload = () => this.analytics.trackDownload(osfguid, doi);
        this.addEventListener(element, 'click', doTrackDownload);
    }

    // methods for reuse
    addEventListener = (element: any, event: any, handler: any) => {
        // Store the current element, event, and handler for when we need to remove
        // them during cleanup.
        this.element = element;
        this.event = event;
        this.handler = handler;

        element.addEventListener(event, handler);
    };

}

