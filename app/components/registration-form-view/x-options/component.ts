import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';

import { Answerable } from '../component';
import template from './template';

@tagName('')
@layout(template)
export default class ViewOptions extends Component {
    answerable!: Answerable;

    @computed('answerable')
    get selectedOptions() {
        const { value } = this.answerable;
        if (!value) {
            return [];
        }
        return Array.isArray(value) ? value : [value];
    }
}
