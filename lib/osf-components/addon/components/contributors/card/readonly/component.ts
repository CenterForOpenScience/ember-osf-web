import Component from '@ember/component';

import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import styles from './styles';
import template from './template';

interface UserPermissions {
    id: string;
    displayTitle: string;
}

@layout(template, styles)
export default class ContributorsCardReadonly extends Component {
    @service intl!: Intl;

    // Required
    contributor!: ContributorModel;

    // Private
    userPermissions: UserPermissions[] = [
        { id: 'admin', displayTitle: this.intl.t('osf-components.contributors.permissions.administrator') },
        { id: 'write', displayTitle: this.intl.t('osf-components.contributors.permissions.readAndWrite') },
        { id: 'read', displayTitle: this.intl.t('osf-components.contributors.permissions.read') },
    ];

    @computed('contributor.permission')
    get permission() {
        const { permission } = this.contributor;
        return this.userPermissions.find(value => value.id === permission)!.displayTitle;
    }
}
