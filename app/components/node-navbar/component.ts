import Component from '@ember/component';

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
    active?: Tabs;
    allowComments?: boolean;
    renderInPlace?: boolean = this.renderInPlace || false;
}
