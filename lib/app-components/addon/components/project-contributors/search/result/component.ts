import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('tr')
export default class extends Component {
    @service currentUser!: CurrentUser;

    contributors: ArrayProxy<Contributor> = this.contributors;
    user: User = this.user;

    @computed('currentUser.currentUserId', 'user.id')
    get isSelf() {
        return this.currentUser.currentUserId === this.user.id;
    }

    @computed('contributors.[]', 'user')
    get isContributor(): boolean {
        if (!this.contributors) {
            return false;
        }

        const { id } = this.user;

        return this.contributors.toArray().some(({ users }) => users.get('id') === id);
    }

    @requiredAction addContributor!: (user: User) => void;
}
