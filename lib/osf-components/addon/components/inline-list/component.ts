import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

export default class InlineList extends Component {
    layout = layout;

    items: any[] = defaultTo(this.items, []);
    truncate?: number;

    @alias('items.firstObject') first!: any;
    @alias('items.lastObject') last!: any;

    @computed('items', 'truncate')
    get rest(this: InlineList) {
        if (this.truncate && (this.truncate < this.items.length)) {
            return this.items.slice(1, this.truncate);
        }
        return this.items.slice(1, -1);
    }
}
