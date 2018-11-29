import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import DS from 'ember-data';

import Node from 'ember-osf-web/models/node';

export default class DemoEditComponent extends Component {
    @service store!: DS.Store;

    node!: Node;

    constructor(...args: any[]) {
        super(...args);
        this.node = this.store.createRecord('node', {
            title: 'Existing node!',
            description: 'Passing in `model=this.node` tells the form to make changes to this model instance directly.',
        });
    }
}
