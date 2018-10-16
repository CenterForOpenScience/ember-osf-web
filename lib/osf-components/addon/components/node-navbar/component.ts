import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import layout from './template';

export type NodeLike = Pick<Node, 'id' | 'isRegistration'>;

export default class NodeNavbar extends Component {
    layout = layout;
    styles = styles;

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
