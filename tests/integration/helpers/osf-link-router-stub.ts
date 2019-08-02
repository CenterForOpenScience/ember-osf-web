import Service from '@ember/service';
import defaultTo from 'ember-osf-web/utils/default-to';

export class OsfLinkRouterStub extends Service {
    urlForResponse: string = defaultTo(this.urlForResponse, 'https://localhost:4200/route');
    transitionToResponse: string = defaultTo(this.transitionToResponse, '');
    isActiveResponse: boolean = defaultTo(this.isActiveResponse, false);
    currentURL: string = defaultTo(this.currentURL, '/current');

    urlFor() {
        return this.urlForResponse;
    }

    transitionTo() {
        return this.transitionToResponse;
    }

    isActive() {
        return this.isActiveResponse;
    }
}
