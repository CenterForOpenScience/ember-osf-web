import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | registration-provider', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const model = run(() => this.owner.lookup('service:store').createRecord('registration-provider'));
        assert.ok(!!model);
    });

    test('it can have an associated brand-asset', function(assert) {
        const store = this.owner.lookup('service:store');
        const brandAsset = run(() => store.createRecord('brand-asset', {
            primaryColor: 'blue',
            secondaryColor: 'green',
            navbarLogoImage: 'http://logoimage',
            heroLogoImage: 'http://heroimg',
            heroBackgroundImage: 'http://herobg',
        }));

        const model = run(() => store.createRecord('registration-provider', {
            brandAsset,
        }));

        assert.ok(!!model);
        assert.strictEqual(model.brandAsset.get('primaryColor'), 'blue');
    });
});
