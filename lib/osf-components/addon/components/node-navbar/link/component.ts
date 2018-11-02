import { className, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

@tagName('li')
export default class NodeNavbarLink extends Component {
    layout = layout;

    @service router!: any;
    @alias('node.id') nodeId!: string;

    node!: Node;
    useLinkTo: boolean = defaultTo(this.useLinkTo, true);
    destination?: string;
    extraClasses?: string;

    @computed('destination')
    get routeName(): string {
        const dest = this.destination;
        return `guid-${this.node.modelName}${dest ? '.' : ''}${dest}`;
    }

    @computed('destination')
    get translatingKey(): string {
        return `node_navbar.${this.destination}`;
    }

    @className
    @computed('routeName', 'router.currentRouteName')
    get active(): boolean {
        const currentRoute = this.router.currentRouteName || '';
        return this.routeName === currentRoute.replace(/\.index$/, '');
    }
}
