import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Media from 'ember-responsive';

export default class Preprints extends Controller {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    @service media!: Media;

    get isMobile(): boolean {
        return this.media.isMobile;
    }

    get isOsf(): boolean {
        return this.theme?.provider?.id === 'osf';
    }

    @action
    onSearch(query: string) {
        let route = 'search';

        if (this.theme.isSubRoute) {
            route = 'provider.discover';
        }

        this.router.transitionTo(route, { queryParams: { q: query } });
    }
}
