import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { buildValidations, validator } from 'ember-cp-validations';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const Validations = buildValidations({
    name: [
        validator('presence', {
            presence: true,
        }),
        validator('length', {
            min: 3,
            isWarning: true,
        }),
    ],
});

const TestModel = EmberObject.extend(Validations);

function createModel(testContext: any, attrs: {}) {
    return TestModel.create(testContext.owner.ownerInjection(), attrs);
}

module('Integration | Component | validated-input', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        this.set('model', createModel(this, {}));
        await render(hbs` {{validated-input/text
            model=this.model
            valuePath='name'
            shouldShowMessages=false
        }}`);

        assert.dom('input[type="text"]', this.element).hasNoValue();
        assert.dom('.has-success', this.element).doesNotExist();
        assert.dom('.has-error', this.element).doesNotExist();
        assert.dom('.has-warning', this.element).doesNotExist();
    });

    test('render invalid', async function(assert) {
        this.set('model', createModel(this, {}));
        await render(hbs` {{validated-input/text
            model=this.model
            valuePath='name'
        }}`);

        assert.dom('input[type="text"]', this.element).hasNoValue();
        assert.dom('.has-success', this.element).doesNotExist();
        assert.dom('.has-error', this.element).exists();
        assert.dom('.has-warning', this.element).doesNotExist();
    });

    test('render valid', async function(assert) {
        const model = this.set('model', createModel(this, { name: 'foo' }));
        await render(hbs` {{validated-input/text
            model=this.model
            valuePath='name'
        }}`);

        assert.dom('input[type="text"]', this.element).hasValue(model.name);
        assert.dom('.has-success', this.element).exists();
        assert.dom('.has-error', this.element).doesNotExist();
        assert.dom('.has-warning', this.element).doesNotExist();
    });

    test('render warning message', async function(assert) {
        const model = this.set('model', createModel(this, { name: 'fo' }));
        await render(hbs` {{validated-input/text
            model=this.model
            valuePath='name'
        }}`);

        assert.dom('input[type="text"]', this.element).hasValue(model.name);
        assert.dom('.has-success', this.element).doesNotExist();
        assert.dom('.has-error', this.element).doesNotExist();
        assert.dom('.has-warning', this.element).exists();
    });
});
