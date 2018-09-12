import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import Analytics from 'ember-osf-web/services/analytics';
import config from 'registries/config/environment';
import { ShareRegistration } from 'registries/services/share-search';
import layout from './template';

@localClassNames('RegistriesSearchResult')
export default class RegistriesSearchResult extends Component {
    layout = layout;
    @service analytics!: Analytics;

    result!: ShareRegistration;

    expanded = false;

    @computed('result')
    get osfID() {
        const OSF = config.sourcesWhitelist.find(source => source.name === 'OSF')!;
        const osfRegex = new RegExp(OSF.urlRegex);

        for (const link of this.result.hyperLinks) {
            if (!osfRegex.test(link)) {
                continue;
            }

            const res = /^https?:\/\/.*osf\.io\/([^/]+)/.exec(link);
            if (res) {
                return res[1];
            }
        }

        return false;
    }

    @computed('expanded')
    get footerIcon(this: RegistriesSearchResult) {
        return this.expanded ? 'caret-up' : 'caret-down';
    }

    @action
    toggleExpanded(this: RegistriesSearchResult) {
        this.set('expanded', !this.expanded);
        this.analytics.track(
            'result',
            this.expanded ? 'expand' : 'contract',
            `Discover - ${this.result.title}`,
            this.result.id,
        );
    }

    contribFilter(contrib: any) {
        return contrib.users.bibliographic;
    }
}
