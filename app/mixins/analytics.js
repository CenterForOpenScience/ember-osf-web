import { get } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

/**
 * @module ember-osf-web
 * @submodule mixins
 */

/**
 *  Analytics mixin. Provides actions that can be used in templates to track events (can send to multiple
 *  analytics services)
 *
 * @class Analytics
 */
export default Mixin.create({
    metrics: service(),
    actions: {
        click(category, label, extra_) {
            let extra = extra_;
            if (extra && typeof extra !== 'string') {
                extra = null;
            }
            get(this, 'metrics')
                .trackEvent({
                    category,
                    action: 'click',
                    label,
                    extra,
                });

            return true;
        },
        track(category, action, label, extra_) {
            let extra = extra_;
            if (extra && typeof extra !== 'string') {
                extra = null;
            }
            get(this, 'metrics')
                .trackEvent({
                    category,
                    action,
                    label,
                    extra,
                });
            return true;
        },
    },
});
