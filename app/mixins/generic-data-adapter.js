import Mixin from '@ember/object/mixin';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'ember-get-config';
import $ from 'jquery';

/**
 * Extend the Ember-Simple-Auth adapter to provide cookie support (when necessary).
 * This allows the same addon to define an adapter that works with two authentication types.
 *
 * This particularly applies to local development, as without it cookies are not sent
 * from the ember app to the api domain
 *
 * @class GenericDataADapter
 */
export default Mixin.create(DataAdapterMixin, {
    ajaxOptions() {
        const hash = this._super(...arguments);

        // TODO: This mechanism is quite ugly, and will require manual ajax requests (such
        // as the file manager) to set fields separately; getting requests to send cookies
        // without triggering cross-origin rules would be strongly preferable
        if (config.authorizationType === 'cookie') {
            $.extend(hash, {
                xhrFields: {
                    withCredentials: true,
                },
            });
        }
        return hash;
    },
});
