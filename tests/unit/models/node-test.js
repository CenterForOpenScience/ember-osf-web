import { moduleForModel, test } from 'ember-qunit';

moduleForModel('node', 'Unit | Model | node', {
    // Specify the other units that are required for this test.
    needs: [
        'model:user', 'model:citation', 'model:draft-registration', 'model:contributor',
        'model:comment', 'model:preprint', 'model:institution', 'model:registration', 'model:file-provider',
        'model:log', 'model:node-link', 'model:wiki', 'transform:object', 'transform:array',
    ],
});

test('it exists', function(assert) {
    const model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
