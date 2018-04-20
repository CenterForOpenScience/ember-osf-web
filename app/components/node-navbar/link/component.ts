import { className, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('li')
export default class NodeNavbarLink extends Component {
    @service router;

    id: 'string';
    useLinkTo: boolean = defaultTo(this.useLinkTo, true);
    destination?: string;
    extraClasses?: string;

    @computed('destination')
    get routeName(): string {
        const dest = this.destination;
        return `guid-node${dest ? '.' : ''}${dest}`;
    }

    @computed('destination')
    get translatingKey(): string {
        return `node_navbar.${this.destination}`;
    }

    @className
    @computed('routeName', 'router.currentRouteName')
    get active(): boolean {
        return this.routeName === this.router.currentRouteName;
    }
}
