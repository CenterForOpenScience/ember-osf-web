import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import Intl from 'ember-intl/services/intl';
import config from 'ember-osf-web/config/environment';

export default class Preprints extends Controller {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    @service intl!: Intl;

    get isDefaultProvider(): boolean {
        return this.theme?.provider?.id === config.defaultProvider;
    }

    @action
    onSearch(query: string) {
        const route = 'preprints.discover';

        this.router.transitionTo(route, this.theme.id, { queryParams: { q: query } });
    }

    get supportEmail(): string {
        const { isProvider, provider } = this.theme;

        // eslint-disable-next-line max-len
        return `mailto:${isProvider && provider && provider.emailSupport ? provider.emailSupport : this.intl.t('contact.email')}`;
    }
}
