import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContributorList extends Component.extend({
    tagName: 'span',

    contributors: A([]),
}) {
    i18n = service('i18n');

    contributorList = computed('contributors.[]', function(): string {
        const contributors = this.get('contributors').toArray();

        if (!(contributors && contributors.length)) {
            return '';
        }

        const len = contributors.length;
        const max = 3;

        const names: string[] = contributors
            .slice(0, max)
            .map(c => c.get('users.familyName') || c.get('users.givenName'));

        const i18n = this.get('i18n');
        const and = i18n.t('general.and');
        const more = i18n.t('general.more');

        if (len < 3) {
            return names.join(` ${and} `);
        }

        const last = len <= max ? names.splice(-1) : `${len - max} ${more}`;
        return [...names, `${and} ${last}`].join(', ');
    });
}
