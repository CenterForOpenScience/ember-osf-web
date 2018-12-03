import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

export interface Contrib {
    title: string;
    id: string | null;
}

@layout(template)
@tagName('span')
export default class ContributorList extends Component {
    @service i18n!: I18N;
    max = 3;
    truncated: boolean = defaultTo(this.truncated, true);
    nodeId?: string;
    useLink?: boolean;
    contributors!: DS.PromiseManyArray<Contributor> & { meta: { total: number } };

    @computed('contributors.[]')
    get contributorList(this: ContributorList): Contrib[] {
        if (!this.contributors) {
            return [];
        }
        const contributors = this.contributors.toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const contribs: Contrib[] = contributors
            .map(c => ({
                title: c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'),
                id: c.get('unregisteredContributor') ? null : c.users.get('id'),
            }));

        return contribs;
    }

    @alias('contributorList.firstObject') first!: Contrib;
    @alias('contributors.meta.total') numContributors!: number;

    @computed('contributors.meta.total', 'max')
    get rest(this: ContributorList): number {
        return this.contributors.meta.total - this.max;
    }
}
