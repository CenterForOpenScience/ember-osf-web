import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('')
export default class Label extends Component {
    // Required parameters
    label!: string;

    // Optional parameters
    count?: number;

    // Private properties
    isCollapsed: boolean = defaultTo(this.isCollapsed, false);

    @computed('count')
    get hasCount() {
        return (typeof this.count) === 'number';
    }

    @computed('count', 'isCollapsed')
    get showCount() {
        return this.hasCount && !this.isCollapsed;
    }

    didReceiveAttrs() {
        assert('@label is required for this component to render', Boolean(this.label));
    }
}
