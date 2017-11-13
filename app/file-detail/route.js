import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
    model(params) {
        return hash({
            file: this.store.findRecord('file', params.file_id),
            user: this.store.findRecord('file', params.file_id).then(file => file.get('user')).then(user => user.reload()),
        });
    },
});
