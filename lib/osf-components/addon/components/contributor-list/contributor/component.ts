import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { bool } from '@ember/object/computed';
import { waitFor } from '@ember/test-waiters';
import { restartableTask } from 'ember-concurrency';
import { ResourceIdentifierObject } from 'jsonapi-typescript';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import { RelationshipWithData } from 'osf-api';
import template from './template';

@layout(template)
@tagName('')
export default class ContributorListContributor extends Component {
    contributor!: Contributor;
    shouldLinkUser = false;
    shouldShortenName = false;

    contributorName?: string;
    contributorLink?: string;

    @bool('contributor.unregisteredContributor') isUnregistered?: boolean;

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async loadUser() {
        const user = await this.contributor.users;

        let names: any = user;
        if (!user) {
            const userRel = (this.contributor.relationshipLinks.users as RelationshipWithData);
            const data = userRel.data as ResourceIdentifierObject;
            names = data.meta;
        }
        this.set(
            'contributorName',
            this.shouldShortenName
                ? names.familyName || names.givenName || names.fullName
                : names.fullName,
        );

        const shouldLink = user && this.shouldLinkUser && !this.contributor.unregisteredContributor;
        this.set('contributorLink', shouldLink ? `/${user.id}` : undefined);
    }
}
