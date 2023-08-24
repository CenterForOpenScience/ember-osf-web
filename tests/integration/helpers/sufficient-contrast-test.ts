/* eslint-disable max-len */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | sufficient-contrast', function(hooks) {
    setupRenderingTest(hooks);

    test('it calculates normal text for AA', async function(assert) {
        // 21:1 ratio
        await render(hbs`{{if (sufficient-contrast '#000' '#fff') 'good contrast' 'poor contrast'}}`);
        assert.equal(this.element.textContent!.trim(), 'good contrast', '21:1 passes AA using three digit hex colors');
        // 4.6:1 ratio
        await render(hbs`{{if (sufficient-contrast '#757575' '#fff') 'good contrast' 'poor contrast'}}`);
        assert.equal(this.element.textContent!.trim(), 'good contrast', '4.6:1 passes AA');
        // 4.47:1 ratio
        await render(hbs`{{if (sufficient-contrast '#fff' '#777') 'good contrast' 'poor contrast'}}`);
        assert.equal(this.element.textContent!.trim(), 'poor contrast', '4.47:1 fails AA');
    });

    test('it calculates large text AA', async function(assert) {
        // 3.26:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#0090FF' '#fff' largeText=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'good contrast', '3.26:1 passes AA Large Text');
        // 2.81:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#fff' '#00A0FF' largeText=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'poor contrast', '2.81:1 fails AA Large Text');
    });

    test('it calculates normal text AAA', async function(assert) {
        // 7.2:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#50AA50' '#000' useAAA=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'good contrast', '7.2:1 passes AAA');
        // 6.48:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#000' '#50A050' useAAA=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'poor contrast', '6.48:1 fails AAA');
    });

    test('it calculates large text AAA', async function(assert) {
        // 6.48:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#000' '#50AA50'  largeText=true useAAA=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'good contrast', '6.48:1 passes AAA Large Text');
        // 4.49:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#333' '#00A0FF' largeText=true useAAA=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'poor contrast', '4.49:1 fails AAA Large Text');
        // 4.53:1 ratio
        await render(
            hbs`{{if (sufficient-contrast '#00A0FF' '#303333' largeText=true useAAA=true) 'good contrast' 'poor contrast'}}`,
        );
        assert.equal(this.element.textContent!.trim(), 'good contrast', '4.53:1 passes AAA Large Text');
    });

});
