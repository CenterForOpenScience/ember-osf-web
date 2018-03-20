import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
    features: service(),
    currentUser: service(),
    beforeModel(...args) {
        return this.get('currentUser._setWaflle').perform().then(() => this._super(...args));
    },
    actions: {
        didTransition(...args) {
            const routeFlag: string = this.get('waffleRouteFlag');
            if (this.get('features').isEnabled(routeFlag)) {
                return this._super(...args);
            }
            window.location.reload();
        },
    },
});
