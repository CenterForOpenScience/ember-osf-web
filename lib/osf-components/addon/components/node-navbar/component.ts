import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';
import { Permission } from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import styles from './styles';
import layout from './template';

export default class NodeNavbar extends Component {
    layout = layout;
    styles = styles;

    node?: Node;
    allowComments?: boolean;
    secondaryNavbarId = config.secondaryNavbarId;
    collapsedNav = true;

    @computed('node.currentUserPermissions')
    get currentUserCanEdit(): boolean {
        const permissions = this.node ? this.node.currentUserPermissions : [];
        return permissions ? permissions.includes(Permission.write) : false;
    }

    @action
    toggleNav() {
        this.toggleProperty('collapsedNav');
    }
}
