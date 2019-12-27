import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class LabelContent extends Component {
    // Private property
    shouldShowExample = false;

    @action
    toggleShouldShowExample() {
        this.toggleProperty('shouldShowExample');
    }
}
