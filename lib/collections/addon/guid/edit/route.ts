import Route from '@ember/routing/route';
import requireAuth from 'ember-osf-web/decorators/require-auth';

@requireAuth()
export default class GuidEdit extends Route {
    model(this: GuidEdit) {
        return this.modelFor(this.routeName.replace(/\.\w*$/, ''));
    }
}
