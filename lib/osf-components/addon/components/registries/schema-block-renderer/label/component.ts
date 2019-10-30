import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { action } from '@ember-decorators/object';
import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class Label extends Component {
    // Required param
    schemaBlock!: SchemaBlock;

    // Private property
    shouldShowExample = false;

    @action
    toggleShouldShowExample() {
        this.toggleProperty('shouldShowExample');
    }
}
