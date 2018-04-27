import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import Contributor from 'ember-osf-web/models/contributor';
import defaultTo from 'ember-osf-web/utils/default-to';

interface Contrib {
    title: string;
    id: string | undefined;
}

@tagName('span')
export default class ContributorList extends Component {
    @service i18n!: I18N;
    max = 3;
    nodeId?: string;
    useLink?: boolean;
    contributors: Contributor[] = defaultTo(this.contributors, A([]));

    @computed('contributors.[]')
    get contributorList(this: ContributorList): Contrib[] {
        if (!this.get('contributors')) {
            return [];
        }
        const contributors = this.get('contributors').toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const names: Contrib[] = contributors
            .slice(0, this.get('max'))
            .map(c => ({
                title: c.users.familyName || c.users.givenName || c.users.fullName,
                id: c.users.id,
            }));

        return names;
    }

    @computed('contributorList')
    get first(this: ContributorList): Contrib | undefined {
        return this.get('contributorList').slice(0, 1)[0];
    }

    @computed('contributorList', 'contributors.[]')
    get last(this: ContributorList): Contrib | void {
        const contributors = this.get('contributorList');

        if (contributors.length < 2) {
            return;
        }

        const len = this.get('contributors').toArray().length;

        if (len <= this.get('max')) {
            return contributors.splice(-1)[0];
        }
        return {
            title: `${len - this.get('max')} ${this.get('i18n').t('general.more')}`,
            id: this.get('nodeId'),
        };
    }

    @computed('contributorList', 'contributors.[]')
    get rest(this: ContributorList): Contrib[] {
        const contributors = this.get('contributorList');

        if (!(contributors && contributors.length)) {
            return [];
        }

        const len = this.get('contributors').toArray().length;

        if (len <= this.get('max')) {
            return contributors.slice(1, contributors.length - 1);
        }
        return contributors.slice(1, this.get('max'));
    }
}
