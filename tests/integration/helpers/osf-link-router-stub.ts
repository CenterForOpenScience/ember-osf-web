import Service from '@ember/service';

export class OsfLinkRouterStub extends Service {
    urlForResponse = 'https://localhost:4200/route';
    transitionToResponse = '';
    isActiveResponse = false;
    currentURL = '/current';

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
