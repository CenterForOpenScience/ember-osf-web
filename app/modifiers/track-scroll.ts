import { inject as service } from '@ember/service';

import InViewport from 'ember-in-viewport/services/in-viewport.js';
import Analytics from 'ember-osf-web/services/analytics';

import Modifier from 'ember-oo-modifiers';

class TrackScrollModifier extends Modifier {
    @service analytics!: Analytics;

    @service inViewport!: InViewport;

    didShow = false;

    didInsertElement([name]: [string]) {
        const { onEnter } = this.inViewport.watchElement(this.element);
        onEnter(() => { this.didEnterViewport(name); });
    }

    didEnterViewport(name: string) {
        if (!this.didShow) {
            // Run analytics when the component comes into view
            this.analytics.trackFromElement(
                this.element,
                {
                    name,
                    category: 'page',
                    action: 'scroll',
                    nonInteraction: true,
                },
            );
            this.didShow = true;
        }
    }

    willDestroyElement() {
        this.inViewport.stopWatching(this.element);
    }
}

export default Modifier.modifier(TrackScrollModifier);
