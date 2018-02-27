import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import tHelper from 'ember-i18n/helper';

// Stub i18n service
const i18nStub = Ember.Service.extend({
    t(word) {
        const translated = {
            'navbar.my_projects': 'My Projects',
            'navbar.search': 'Search',
            'navbar.add_a_preprint': 'Add a preprint',
            'navbar.support': 'Support',
            'navbar.browse': 'Browse',
        };
        return translated[word];
    },
});

// Session Stub No Auth
const sessionStubUnauthenticated = Ember.Service.extend({
    isAuthenticated: false,
});

// Session Stub Auth
const sessionStubAuthenticated = Ember.Service.extend({
    isAuthenticated: true,
});

// currentUser Stub !canViewReviews
const currentUserStubNoReviews = Ember.Service.extend({
    user: new Ember.RSVP.Promise((resolve) => {
        const user = Ember.Object.create({
            canViewReviews: false,
        });
        resolve(user);
    }),
});

moduleForComponent('build-secondary-nav-links', 'build-secondary-nav-links', {
    integration: true,

    beforeEach() {
        // register the helper:
        this.registry.register('helper:t', tHelper);
        this.register('service:i18n', i18nStub);
        this.inject.service('i18n', { as: 'i18n' });
    },
});

test('returns preprints service links', function(assert) {
    this.set('currentService', 'PREPRINTS');
    this.render(hbs`
            {{#each (build-secondary-nav-links currentService session) as |navLink|}}
                {{t navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Add a preprint Search Support');
});


test('returns home service links, authenticated', function(assert) {
    this.register('service:session', sessionStubAuthenticated);
    this.inject.service('session', { as: 'sessionStub' });

    this.register('service:current-user', currentUserStubNoReviews);
    this.inject.service('current-user', { as: 'currentUserStub' });

    this.set('currentService', 'HOME');
    this.render(hbs`
            {{#each (build-secondary-nav-links currentService session) as |navLink|}}
                {{t navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'My Projects Search Support');
});


test('returns home service links, unauthenticated', function(assert) {
    this.register('service:session', sessionStubUnauthenticated);
    this.inject.service('session', { as: 'sessionStub' });
    this.set('currentService', 'HOME');
    this.render(hbs`
            {{#each (build-secondary-nav-links currentService session) as |navLink|}}
                {{t navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Search Support');
});

test('returns Registries service links', function(assert) {
    this.set('currentService', 'REGISTRIES');
    this.render(hbs`
            {{#each (build-secondary-nav-links currentService session) as |navLink|}}
                {{t navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Search Support');
});

test('returns meetings service links', function(assert) {
    this.set('currentService', 'MEETINGS');
    this.render(hbs`
            {{#each (build-secondary-nav-links currentService session) as |navLink|}}
                {{t navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Search');
});
