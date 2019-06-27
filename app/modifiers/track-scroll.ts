import { service } from '@ember-decorators/service';

import InViewport from 'ember-in-viewport/services/in-viewport.js';
import Analytics from 'ember-osf-web/services/analytics';

import Modifier from 'ember-oo-modifiers';

class TrackScrollModifier extends Modifier {
    @service analytics!: Analytics;
    @service InViewport!: InViewport;

    didInsertElement([eventName]: [string]) {
        const { onEnter } = this.InViewport.watchElement(this.element);
        onEnter(() => { this.didEnterViewport(eventName); });
    }

    didEnterViewport(eventName: string) {
        // Run analytics when the component comes into view
        this.analytics.trackFromElement(
            this.element,
            {
                name: eventName,
                category: 'page',
                action: 'scroll',
            },
        );
    }

    willDestroyElement() {
        this.InViewport.stopWatching(this.element);
    }
}

export default Modifier.modifier(TrackScrollModifier);
