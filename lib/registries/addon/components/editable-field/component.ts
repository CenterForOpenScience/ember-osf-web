import { action } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class EditableField extends Component {
    // Optional
    shouldShowEditable: boolean = false;

    @action
    hideEditable() {
        this.set('shouldShowEditable', false);
    }
}
