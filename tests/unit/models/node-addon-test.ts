import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | node-addon', hooks => {
    setupTest(hooks);

    test('it exists and has proxy properties', function(assert) {
        const externalAccount = run(() => this.owner.lookup('service:store').createRecord('external-account', {
            displayName: 'test account',
            user: this.owner.lookup('service:store').createRecord('user', {id: 'account-user-id'}),
        }));
        const model = run(() => this.owner.lookup('service:store').createRecord('node-addon', {
            node: this.owner.lookup('service:store').createRecord('node'),
            externalAccount,
            folderId: 'folder-id',
        }));
        assert.ok(!!model, 'model exists');
        assert.equal(model.get('externalUserId'), 'account-user-id',
            'externalUserId is a proxy of externalAccount.user.id');
        assert.equal(model.get('externalUserDisplayName'), 'test account',
            'externalUserDisplayName is a proxy of externalAccount.displayName');
        assert.equal(model.get('rootFolder'), 'folder-id', 'rootFolder is a proxy of folderId if it exists');
        model.set('folderId', undefined);
        model.set('folderPath', 'folder-path');
        assert.equal(model.get('rootFolder'), 'folder-path',
            'rootFolder is a proxy of folderPath if folderId is undefined');
    });
});
