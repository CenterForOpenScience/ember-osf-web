import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@layout(template)
@tagName('')
export default class InlineList extends Component {
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

    @computed('items.[]', 'truncate')
    get shouldTruncate() {
        return (this.truncate && (this.items.length > this.truncate));
    }
}
