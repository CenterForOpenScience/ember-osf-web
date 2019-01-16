import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@tagName('span')
export default class ContributorListContributor extends Component {
    contributor!: Contributor;
    shouldLinkUser: boolean = defaultTo(this.shouldLinkUser, false);

    @computed('contributor')
    get contributorName() {
        const user = this.contributor.users;
        return user.familyName || user.givenName || user.fullName;
    }

    @computed('shouldLinkUser', 'contributor')
    get contributorLink() {
        if (!this.shouldLinkUser || this.contributor.unregisteredContributor) {
            return undefined;
        } else {
            return `/${this.contributor.users.id}`;
        }
    }
}
