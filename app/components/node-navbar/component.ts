import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class NodeNavbar extends Component {
    node: Node;
    allowComments?: boolean;
    renderInPlace: boolean = defaultTo(this.renderInPlace, false);
    secondaryNavbarId = config.secondaryNavbarId;
    collapsedNav = true;

    @computed('node.currentUserPermissions')
    get currentUserCanEdit(): boolean {
        const permissions = this.node.currentUserPermissions;
        return permissions ? permissions.includes('write') : false;
    }

    @action
    toggleNav() {
        this.toggleProperty('collapsedNav');
    }
}
