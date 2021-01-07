import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ContributorsCardReadonly extends Component {
    // required
    contributor!: ContributorModel;

    // private properties
    employmentList!: string[];
    educationList!: string[];

    @tracked showDropdown = false;

    didReceiveAttrs() {
        const employment = this.contributor.users.get('employment') || [];
        const education = this.contributor.users.get('education') || [];
        this.employmentList = Array.from(
            employment, item => [item.institution, item.department].join(', ').replace(/,\s*$/, ''),
        );
        this.educationList = Array.from(
            education, item => [item.institution, item.department].join(', ').replace(/,\s*$/, ''),
        );
    }

    @action
    toggleDropdown() {
        this.toggleProperty('showDropdown');
    }
}
