import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Media from 'ember-responsive';
import Intl from 'ember-intl/services/intl';

export default class Preprints extends Controller {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    @service media!: Media;
    @service intl!: Intl;

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

    get supportEmail(): string {
        const { isProvider, provider } = this.theme;

        // eslint-disable-next-line max-len
        return `mailto:${isProvider && provider && provider.emailSupport ? provider.emailSupport : this.intl.t('contact.email')}`;
    }
}
