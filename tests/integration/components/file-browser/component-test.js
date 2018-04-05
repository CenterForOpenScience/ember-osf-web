import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

moduleForComponent('file-browser', 'Integration | Component | file browser', {
    integration: true,

    beforeEach() {
        manualSetup(this.container);
    },
});

// Async issues need to be solved before this can be properly tested
skip('test name\'s column width', function(assert) {
    this.set('user', FactoryGuy.make('user'));
    this.set('display', ['header']);
    this.render(hbs`{{file-browser  user=user display=display}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '12');

    this.set('display', ['header', 'share-link-column']);
    this.render(hbs`{{file-browser  user=user display=display}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '11');

    // Test default behavior
    this.render(hbs`{{file-browser user=user}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '6');
});
