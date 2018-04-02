import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osf-navbar', 'Integration | Component | osf navbar', {
    integration: true,
});


test('it renders', function(assert) {
    this.set('loginAction', () => {});
    this.render(hbs`{{osf-navbar loginAction=loginAction}}`);
    assert.ok(this.$().text().replace(/\s+/g, ' ').includes('OSF'));
});
