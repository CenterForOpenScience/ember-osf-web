import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import { Education, Employment } from 'ember-osf-web/models/user';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ContributorsCardReadonly extends Component {
    // required
    contributor!: ContributorModel;

    // private properties
    employmentList!: Employment[];
    educationList!: Education[];

    @tracked showDropdown = false;

    didReceiveAttrs() {
        this.employmentList = this.contributor.users.get('employment') || [];
        this.educationList = this.contributor.users.get('education') || [];
    }

    @action
    toggleDropdown() {
        this.toggleProperty('showDropdown');
    }
}
