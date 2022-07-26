
import { ResourceTypes } from 'ember-osf-web/models/resource';
import { getBadgeIcon, getBadgeIconDisabled } from 'ember-osf-web/helpers/open-badges-icon-map';
import { module, test } from 'qunit';

module('Unit | Helper | open-badges-icon-map', () => {
    test('it maps icons', assert => {
        assert.equal(
            getBadgeIcon(ResourceTypes.Data),
            '/assets/images/badges/data_small_color.png',
            'Data icon matches',
        );
        assert.equal(
            getBadgeIcon(ResourceTypes.Materials),
            '/assets/images/badges/materials_small_color.png',
            'Materials icon matches',
        );
    });

    test('it maps disabled icons', assert => {
        assert.equal(
            getBadgeIconDisabled(ResourceTypes.Data),
            '/assets/images/badges/data_small_gray.png',
            'Data icon matches',
        );
        assert.equal(
            getBadgeIconDisabled(ResourceTypes.Materials),
            '/assets/images/badges/materials_small_gray.png',
            'Materials icon matches',
        );
    });
});
