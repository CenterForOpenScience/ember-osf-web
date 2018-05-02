import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Contributor from 'ember-osf-web/models/contributor';

export interface Contrib {
    title: string;
    id: string | undefined;
}

@tagName('span')
export default class ContributorList extends Component {
    @service i18n!: I18N;
    max = 3;
    nodeId?: string;
    useLink?: boolean;
    contributors: DS.PromiseManyArray<Contributor> & { meta: { total: number } } = this.contributors;

    @computed('contributors.[]')
    get contributorList(this: ContributorList): Contrib[] {
        if (!this.contributors) {
            return [];
        }
        const contributors = this.contributors.toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const names: Contrib[] = contributors
            .slice(0, this.max)
            .map(c => ({
                title: c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'),
                id: c.users.get('id'),
            }));

        return names;
    }

    @alias('contributorList.firstObject') first!: Contrib;
    @alias('contributors.meta.total') numContributors!: number;

    @computed('contributorList', 'totalContributors')
    get last(this: ContributorList): Contrib | void {
        const contributors = this.contributorList;

        if (contributors.length < 2) {
            return;
        }

        const len = this.numContributors;

        if (len <= this.max) {
            return contributors.get('lastObject');
        }
        return {
            title: `${len - this.max} ${this.i18n.t('general.more')}`,
            id: this.get('nodeId'),
        };
    }

    @computed('contributorList', 'numContributors')
    get rest(this: ContributorList): Contrib[] {
        const contributors = this.contributorList;

        if (!(contributors && contributors.length)) {
            return [];
        }

        return this.numContributors <= this.max ? contributors.slice(1, -1) : contributors.slice(1);
    }
}
