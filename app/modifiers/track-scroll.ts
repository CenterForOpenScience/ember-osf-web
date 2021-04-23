import { inject as service } from '@ember/service';

import InViewport from 'ember-in-viewport/services/in-viewport';
import Analytics from 'ember-osf-web/services/analytics';

import Modifier from 'ember-modifier';

interface TrackScrollModifierArgs {
    positional: [string];
    named: {};
}

export default class TrackScrollModifier extends Modifier<TrackScrollModifierArgs> {
    @service analytics!: Analytics;
    @service inViewport!: InViewport;

    didShow = false;

    didInstall() {
        const { onEnter } = this.inViewport.watchElement(this.element as HTMLElement);
        onEnter(() => {
            this.didEnterViewport();
        });
    }

    didEnterViewport() {
        const name = this.args.positional[0];
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

    willRemove() {
        this.inViewport.stopWatching(this.element as HTMLElement);
    }
}
