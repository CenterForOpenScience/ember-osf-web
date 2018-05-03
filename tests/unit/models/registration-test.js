import {
    moduleForModel,
    test,
} from 'ember-qunit';

moduleForModel('registration', 'Unit | Model | registration', {
    // Specify the other units that are required for this test.
    needs: [
        'model:citation',
        'model:institution',
        'model:draft-registration',
        'model:node',
        'model:preprint',
        'model:user',
        'model:contributor',
        'model:comment',
        'model:file-provider',
        'model:log',
        'model:node-link',
        'model:wiki',
        'transform:object',
    ],
});

test('it exists', function (assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
