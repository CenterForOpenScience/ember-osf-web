import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class extends Route {
    model() {
        return RSVP.hash({
            parent: this.store.findRecord('node', 'ezcuj'),
            child: this.store.findRecord('node', 'ezcuj1'),
            grandChild: this.store.findRecord('node', 'ezcuj2'),
            greatGrandChild: this.store.findRecord('node', 'ezcuj3'),
        });
    }
}
