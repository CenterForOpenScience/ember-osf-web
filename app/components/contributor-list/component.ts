import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import I18N from 'ember-i18n/services/i18n';
import Contributor from 'ember-osf-web/models/contributor';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('span')
export default class ContributorList extends Component {
    @service i18n!: I18N;

    contributors: Contributor[] = defaultTo(this.contributors, A([]));

    @computed('contributors.[]')
    get contributorList(): string {
        const contributors = this.contributors.toArray();

        if (!(contributors && contributors.length)) {
            return '';
        }

        const len = contributors.length;
        const max = 3;

        const names: string[] = contributors
            .slice(0, max)
            .map(c => c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'));

        const and = this.i18n.t('general.and');
        const more = this.i18n.t('general.more');

        if (len < 3) {
            return names.join(` ${and} `);
        }

        const last = len <= max ? names.splice(-1) : `${len - max} ${more}`;
        return [...names, `${and} ${last}`].join(', ');
    }
}
