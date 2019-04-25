import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

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
