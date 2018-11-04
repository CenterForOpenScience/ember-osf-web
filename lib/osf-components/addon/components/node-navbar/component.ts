import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';

import styles from './styles';
import template from './template';

export type NodeLike = Pick<Node, 'id' | 'isRegistration'>;

@layout(template, styles)
export default class NodeNavbar extends Component {
    // Optional parameters
    node?: Node;
    allowComments?: boolean;
    renderInPlace?: boolean;

    // Private properties
    secondaryNavbarId = config.secondaryNavbarId;
    collapsedNav = true;

    @computed('node')
    get fakeParent(): NodeLike | null {
        if (this.node) {
            const id = this.node.belongsTo('parent').id();
            if (id) {
                return {
                    id,
                    // The parent of a registration is always a registration. When a component
                    // is registered without its parent, the registration is its own root.
                    isRegistration: this.node.isRegistration,
                };
            }
        }
        return null;
    }

    @action
    toggleNav() {
        this.toggleProperty('collapsedNav');
    }
}
