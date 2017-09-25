import Controller from '@ember/controller';
import OSFAgnosticAuthControllerMixin from 'ember-osf/mixins/osf-agnostic-auth-controller';

export default Controller.extend(OSFAgnosticAuthControllerMixin, {
    actions: {
        login() {
            return;
        }
    }
});
