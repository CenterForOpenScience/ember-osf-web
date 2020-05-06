import { className, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import { NodeLike } from '../component';
import template from './template';

@layout(template)
@tagName('li')
export default class NodeNavbarLink extends Component {
    // Required arguments
    node!: NodeLike;

    // Optional arguments
    useLinkTo: boolean = defaultTo(this.useLinkTo, true);
    setActive: boolean = defaultTo(this.setActive, true);
    destination?: string;
    extraClasses?: string;

    // Private properties
    @service router!: RouterService;

    @alias('node.id') nodeId!: string;

    @computed('destination')
    get routeName(): string {
        const base = this.node && this.node.isRegistration ? 'guid-registration' : 'guid-node';
        return this.destination ? `${base}.${this.destination}` : base;
    }

    @computed('destination')
    get translatingKey(): string {
        return `node_navbar.${this.destination}`;
    }

    @className
    @computed('setActive', 'routeName', 'router.currentRouteName', 'node')
    get active(): boolean {
        return this.setActive && this.router.isActive(this.routeName, this.node.id);
    }
}
