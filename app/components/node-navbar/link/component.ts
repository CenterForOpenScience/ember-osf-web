import { className, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import Component from '@ember/component';

@tagName('li')
export default class NodeNavbarLink extends Component {
    @service router;

    id: 'string';
    useLinkTo?: boolean;
    destination?: string;
    extraClasses?: string;

    @computed('destination')
    get routeName(this: NodeNavbarLink): string {
        const dest = this.get('destination');
        return `guid-node${dest ? '.' : ''}${dest}`;
    }

    @computed('destination')
    get translatingKey(this: NodeNavbarLink): string {
        return `node_navbar.${this.get('destination')}`;
    }

    @className('active', 'not-active')
    @computed('routeName', 'router.currentRouteName')
    get active(this: NodeNavbarLink): boolean {
        return this.get('routeName') === this.get('router.currentRouteName');
    }
}
