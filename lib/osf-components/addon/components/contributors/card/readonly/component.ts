import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import CurrentUser from 'ember-osf-web/services/current-user';
import ContributorsManager from 'osf-components/components/contributors/manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ContributorsCardReadonly extends Component {
    // required
    manager!: ContributorsManager;
    contributor!: ContributorModel;
    @service currentUser!: CurrentUser;

    @tracked showDropdown = false;

    get modelName() {
        return this.manager.modelName;
    }
    @action
    toggleDropdown() {
        this.toggleProperty('showDropdown');
    }
}
