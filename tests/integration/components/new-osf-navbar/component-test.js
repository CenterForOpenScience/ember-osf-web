import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-osf-navbar', 'Integration | Component | new osf navbar', {
    integration: true,
});


test('it renders', function(assert) {
    this.set('loginAction', () => {});
    this.render(hbs`{{new-osf-navbar loginAction=loginAction}}`);
    assert.ok(this.$().text().replace(/\s+/g, ' ').includes('OSF'));
});
