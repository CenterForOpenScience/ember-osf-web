import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';
import { module, test } from 'qunit';

module('Unit | Utility | strip-html-tags', () => {
    test('removes html tags from string', assert => {
        const strs = [
            ['', ''],
            ['OSF', 'OSF'],
            ['<a href="osf.io"><strong>OSF</strong></a>', 'OSF'],
            ['Open <b>Science</b> Framework', 'Open Science Framework'],
        ];
        for (const [actual, expected] of strs) {
            assert.equal(stripHtmlTags(actual), expected);
        }
    });
});
