import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';

@tagName('span')
export default class ContributorList extends Component {
    @service i18n;

    contributors = this.contributors || A([]);

    @computed('contributors.[]')
    get contributorList(this: ContributorList): string {
        const contributors = this.get('contributors').toArray();

        if (!(contributors && contributors.length)) {
            return '';
        }

        const len = contributors.length;
        const max = 3;

        const names: string[] = contributors
            .slice(0, max)
            .map(c => c.get('users.familyName') || c.get('users.givenName') || c.get('users.fullName'));

        const i18n = this.get('i18n');
        const and = i18n.t('general.and');
        const more = i18n.t('general.more');

        if (len < 3) {
            return names.join(` ${and} `);
        }

        const last = len <= max ? names.splice(-1) : `${len - max} ${more}`;
        return [...names, `${and} ${last}`].join(', ');
    }
}
