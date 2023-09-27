import { registerDestructor } from '@ember/destroyable';
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
    element?: Element;
    name?: string;

    constructor(owner: any, args: any) {
        super(owner, args);
        registerDestructor(this, this.willRemove);
    }

    modify(element: any, name: any, _: any) {
        this.element = element;
        this.name = name[0];
        const { onEnter } = this.inViewport.watchElement(this.element as HTMLElement);
        onEnter(() => {
            this.didEnterViewport();
        });
    }

    didEnterViewport() {
        const name = this.name;
        if (!this.didShow && this.element) {
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

    willRemove(instance: TrackScrollModifier) {
        instance.inViewport.stopWatching(instance.element as HTMLElement);
    }
}
