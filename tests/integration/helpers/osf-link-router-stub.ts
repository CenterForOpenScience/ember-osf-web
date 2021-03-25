import Service from '@ember/service';

export class OsfLinkRouterStub extends Service {
    urlForResponse: string = 'https://localhost:4200/route';
    transitionToResponse: string = '';
    isActiveResponse: boolean = false;
    currentURL: string = '/current';

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
