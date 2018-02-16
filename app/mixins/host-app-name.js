import config from 'ember-get-config';
import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * This mixin provides an attribute that holds the host app name, and is intended to be used with other ember-osf components.
 *
 * Sample usage:
 * ```
 * // components/componentA.js
 * import hostAppName from ‘ember-osf-web/mixins/host-app-name’;
 *
 * export default Component.extend(hostAppName);
 * ```
 *
 * ```
 * // components/ComponentB.js
 * import hostAppName from ‘ember-osf-web/mixins/host-app-name’;
 *
 * export default Component.extend(hostAppName);
 *
 * ```
 * The above example will result in both component A and component B sharing the same attribute hostAppName.
 * @class HostAppNameMixin
 */
export default Ember.Mixin.create({
    /**
     * The name of the hosting app is stored in the config/environment.js. Use the package ember-get-config to
     * gain access to the app's config file.
     * @property {String} hostAppName
     */
    hostAppName: config.appName,
});
