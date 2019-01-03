import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import Analytics from 'ember-osf-web/services/analytics';
import { ShareRegistration } from 'registries/services/share-search';
import template from './template';

const OSF_GUID_REGEX = /^https?:\/\/.*osf\.io\/([^/]+)/;

@layout(template)
@localClassNames('RegistriesSearchResult')
export default class RegistriesSearchResult extends Component {
    @service analytics!: Analytics;

    result!: ShareRegistration;

    expanded = false;

    // For use later, when the registration overview page is implemented
    // @computed('result')
    // get osfID() {
    //     const res = OSF_GUID_REGEX.exec(this.result.mainLink || '');

    //     if (res) {
    //         return res[1];
    //     }

    //     return false;
    // }

    @computed('result')
    get contributors() {
        return this.result.contributors.filter(
            contrib => contrib.bibliographic,
        ).map(contrib => ({
            name: contrib.name,
            link: contrib.identifiers.filter(ident => OSF_GUID_REGEX.test(ident))[0],
        }));
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
}
