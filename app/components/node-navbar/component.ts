import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class NodeNavbar extends Component {
    node: Node;
    allowComments?: boolean;
    renderInPlace?: boolean = defaultTo(this.renderInPlace, false);

    collapsedNav = true;

    @computed('node.currentUserPermissions')
    get currentUserCanEdit(this: NodeNavbar): boolean {
        const permissions = this.get('node.currentUserPermissions');
        return permissions ? permissions.includes('write') : false;
    }

    @action
    toggleNav() {
        this.toggleProperty('collapsedNav');
    }
}
