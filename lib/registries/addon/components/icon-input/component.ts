import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

@tagName('')
@layout(template)
export default class Content extends Component {
    icon!: string;

    dark: boolean = defaultTo(this.dark, false);

    value: string = '';

    enter?: (value: string) => void;

    @action
    _enter(value: string) {
        if (this.enter) {
            this.enter(value);
        }
    }
}
