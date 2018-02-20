import Ember from 'ember';

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
export default Ember.Mixin.create({
    metrics: Ember.inject.service(),
    actions: {
        click(category, label, extra_) {
            let extra = extra_;
            if (extra && typeof extra !== 'string') {
                extra = null;
            }
            Ember.get(this, 'metrics')
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
            Ember.get(this, 'metrics')
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
