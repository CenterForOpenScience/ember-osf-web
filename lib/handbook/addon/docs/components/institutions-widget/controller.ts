import Controller from '@ember/controller';
import Node from 'ember-osf-web/models/node';

export default class InstitutionsWidget extends Controller {
    manyNode: Node = this.store.findRecord('node', 'manys');
}
