import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import { ShareRegistration } from 'registries/services/share-search';

import template from './template';

const OSF_GUID_REGEX = /^https?:\/\/.*osf\.io\/([^/]+)/;

@layout(template)
@localClassNames('RegistriesSearchResult')
export default class RegistriesSearchResult extends Component {
    // Required
    result!: ShareRegistration;

    // Private
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
    get footerIcon() {
        return this.expanded ? 'caret-up' : 'caret-down';
    }

    @action
    toggleExpanded() {
        this.set('expanded', !this.expanded);
    }
}
