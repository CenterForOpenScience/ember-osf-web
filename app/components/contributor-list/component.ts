import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';

interface Contributor {
    title: string;
    id: string | undefined;
}

@tagName('span')
export default class ContributorList extends Component {
    @service i18n;
    max = 3;
    nodeId?: string;
    useLink?: boolean;
    contributors = this.contributors || A([]);

    @computed('contributors.[]')
    get contributorList(this: ContributorList): Contributor[] {
        const contributors = this.get('contributors').toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const names: Contributor[] = contributors
            .slice(0, this.get('max'))
            .map(c => ({
                title: c.get('users.familyName') || c.get('users.givenName') || c.get('users.fullName'),
                id: c.get('users.id'),
            }));

        return names;
    }

    @computed('contributorList')
    get first(this: ContributorList): Contributor | undefined {
        return this.get('contributorList').slice(0, 1)[0];
    }

    @computed('contributorList', 'contributors.[]')
    get last(this: ContributorList): Contributor | void {
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
    get rest(this: ContributorList): Contributor[] {
        const contributors = this.get('contributorList');
        const len = this.get('contributors').toArray().length;

        if (len <= this.get('max')) {
            return contributors.slice(1, contributors.length - 1);
        }
        return contributors.slice(1, this.get('max'));
    }
}
