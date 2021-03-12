import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { layout } from 'ember-osf-web/decorators/component';
import { Permission } from 'ember-osf-web/models/osf-model';
import ContributorsManager from 'osf-components/components/contributors/manager/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ContributorsCardEditable extends Component {
    // arguments
    manager!: ContributorsManager;

    // private properties
    permissionOptions = Object.values(Permission);
    @tracked showDropdown = false;

    @action
    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }
}
