import CurrentUser from 'ember-osf-web/services/current-user';

// CurrentUserStub works with acceptance tests that need to ensure that
// routes that @requireAuth() actually require auth. To use in a test,
// import the CurrentUserStub, then add something like the following:
//
// this.owner.register('service:current-user', CurrentUserStub);
// const currentUser = this.owner.lookup('service:current-user');
// await visit('settings/profile/name');
// assert.equal(currentUser.urlCalled, '/settings/profile/name');

export class CurrentUserStub extends CurrentUser.extend({
    urlCalled: '',
    async login(nextUrl?: string) {
        this.urlCalled = nextUrl !== undefined ? nextUrl : '';
    },
}) { }
