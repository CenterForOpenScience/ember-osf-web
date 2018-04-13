import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';

enum Tabs {
    Title = 'title',
    Files = 'files',
    Wiki = 'wiki',
    Analytics = 'analytics',
    Registrations = 'registrations',
    Contributors = 'contributors',
    Addons = 'addons',
    Settings = 'settings',
}

export default class NodeNavbar extends Component {
    node: Node;
    activeTab?: Tabs;
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
