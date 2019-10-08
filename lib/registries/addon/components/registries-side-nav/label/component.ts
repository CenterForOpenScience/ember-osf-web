import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('')
export default class Label extends Component {
    label!: string;
    count?: number;
    isCollapsed: boolean = defaultTo(this.isCollapsed, false);

    @computed('count')
    get hasCount() {
        return (typeof this.count) === 'number';
    }

    didReceiveAttrs() {
        assert('@label is required for this component to render', Boolean(this.label));
    }
}
