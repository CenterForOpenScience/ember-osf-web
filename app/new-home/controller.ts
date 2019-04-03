import { action } from '@ember-decorators/object';
import Controller from '@ember/controller';
import { serviceLinks } from 'ember-osf-web/const/service-links';

export default class NewHome extends Controller {
    @action
    search(query: string) {
        const { search } = serviceLinks;
        window.location.href = `${search}?q=${query}&page=1`;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'new-home': NewHome;
    }
}
