import { service } from '@ember-decorators/service';
import Component from '@ember/component';

export default class NoParents extends Component {
    @service store!: any;

    node = this.store.createRecord('node', { title: 'This is Node.' });
}
