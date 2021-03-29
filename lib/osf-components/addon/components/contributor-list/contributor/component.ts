import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

import { bool } from '@ember/object/computed';
import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import template from './template';

@layout(template)
@tagName('')
export default class ContributorListContributor extends Component {
    contributor!: Contributor;
    shouldLinkUser: boolean = false;
    shouldShortenName: boolean = false;

    contributorName?: string;
    contributorLink?: string;

    @bool('contributor.unregisteredContributor') isUnregistered?: boolean;

    @task({ withTestWaiter: true, restartable: true, on: 'didReceiveAttrs' })
    loadUser = task(function *(this: ContributorListContributor) {
        const user = yield this.contributor.users;

        this.set(
            'contributorName',
            this.shouldShortenName
                ? user.familyName || user.givenName || user.fullName
                : user.fullName,
        );

        const shouldLink = this.shouldLinkUser && !this.contributor.unregisteredContributor;
        this.set('contributorLink', shouldLink ? `/${user.id}` : undefined);
    });
}
