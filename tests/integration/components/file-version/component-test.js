import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { manualSetup } from 'ember-data-factory-guy';

moduleForComponent('file-version', 'Integration | Component | file version', {
    integration: true,

    beforeEach: () => {
        // Set up factory guy, per docs
        this.service = this.container.lookup('service:moment');
        manualSetup(this.container);
    },
});

test('it renders', function(assert) {
    // Tests that the file-version table renders when given the right data

    const version = {
        id: 1,
        attributes: {
            modified_utc: '2017-10-06T18:23:50+00:00',
            extra: {
                downloads: 10,
            },
        },
    };

    this.set('version', version);

    this.service.setTimeZone('UTC');

    this.render(hbs`{{file-version version=version}}`);

    const child1text = this.$('.file-version').children().eq(0).text();
    assert.equal(child1text.trim(), '1', 'The first element should be the id, which is 1');

    assert.equal(this.$('.file-version').children().eq(1).text(), '2017-10-06 6:23 PM UTC', 'Second list element should be a label with the file date');

    assert.equal(this.$('.file-version').children().eq(2).text(), 10, 'Third list element should be a label with the download count - which is 10');
});
