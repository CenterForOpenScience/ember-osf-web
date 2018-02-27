import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';
import { serviceLinks } from 'ember-osf-web/const/service-links';
import AnalyticsMixin from 'ember-osf-web/mixins/analytics';

/**
 * @module ember-osf-web
 * @submodule components
 */

/**
 * Display the login dropdown on the navbar
 *
 * Sample usage:
 * ```handlebars
 * {{new-navbar-auth-dropdown
 *   loginAction=loginAction
 *   redirectUrl=redirectUrl}}
 * ```
 *
 * @class new-navbar-auth-dropdown
 */
export default Ember.Component.extend(AnalyticsMixin, {
    layout,
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    i18n: Ember.inject.service(),
    tagName: 'li',
    classNames: ['dropdown'],
    classNameBindings: ['notAuthenticated:sign-in'],
    notAuthenticated: Ember.computed.not('session.isAuthenticated'),
    redirectUrl: null,

    /**
     * The URL to use for signup. May be overridden, eg for special campaign pages
     *
     * @property signupUrl
     * @type {String}
     */
    signupUrl: `${config.OSF.url}register`,

    serviceLinks,
    gravatarUrl: Ember.computed('user', function() {
        const imgLink = this.get('user.links.profile_image');

        return imgLink ? `${imgLink}&s=25` : '';
    }),
    host: config.OSF.url,
    user: null,
    _loadCurrentUser() {
        this.get('currentUser')
            .load()
            .then(user => this.set('user', user));
    },
    init() {
        this._super(...arguments);
        // TODO: React to changes in service/ event?
        if (this.get('session.isAuthenticated')) {
            this._loadCurrentUser();
        }
    },
    // TODO: These parameters are defined in osf settings.py; make sure ember config matches.
    allowLogin: true,
    enableInstitutions: true,
    actions: {
        logout() {
            const redirectUrl = this.get('redirectUrl');
            const query = redirectUrl ? `?${Ember.$.param({ next_url: redirectUrl })}` : '';
            // TODO: May not work well if logging out from page that requires login- check?
            this.get('session').invalidate()
                .then(() => { window.location.href = `${config.OSF.url}logout/${query}`; });
        },
    },
});
