import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@tagName('')
export default class ContributorListContributor extends Component.extend({
    loadUser: task(function *(this: ContributorListContributor) {
        const user = yield this.contributor.users;

        const contributorName = this.shouldShortenName ?
            user.familyName || user.givenName || user.fullName :
            user.fullName;

        const contributorLink = this.shouldLinkUser && !this.contributor.unregisteredContributor ?
            `/${user.id}` :
            undefined;

        this.setProperties({
            contributorName,
            contributorLink,
        });
    }).restartable(),
}) {
    contributor!: Contributor;
    shouldLinkUser: boolean = defaultTo(this.shouldLinkUser, false);
    shouldShortenName: boolean = defaultTo(this.shouldShortenName, false);

    contributorName?: string;
    contributorLink?: string;

    didReceiveAttrs() {
        this.loadUser.perform();
    }
}
