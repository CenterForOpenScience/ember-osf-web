import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import layout from './template';

export default class NodeNavbar extends Component {
    layout = layout;
    styles = styles;

    // Optional parameters
    node?: Node;
    allowComments?: boolean;

    // Private properties
    secondaryNavbarId = config.secondaryNavbarId;
    collapsedNav = true;

    @computed('node')
    get fakeParent(): Pick<Node, 'id' | 'isRegistration'> | undefined {
        if (!this.node) {
            return undefined;
        }
        const id = this.node.belongsTo('parent').id();
        if (!id) {
            return undefined;
        }
        return {
            id,
            isRegistration: this.node.isRegistration,
        };
    }

    @action
    toggleNav() {
        this.toggleProperty('collapsedNav');
    }
}
