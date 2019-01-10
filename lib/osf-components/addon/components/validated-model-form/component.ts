import { layout } from '@ember-decorators/component';
import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { set } from '@ember/object';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import Toast from 'ember-toastr/services/toast';

import { requiredAction } from 'ember-osf-web/decorators/component';
import { ValidatedModelName } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

@layout(template)
export default class ValidatedModelForm<M extends ValidatedModelName> extends Component {
    // Required arguments
    @requiredAction onSave!: (model: ModelRegistry[M]) => void;

    // Optional arguments
    onError?: (e: object, model: ModelRegistry[M]) => void;
    onWillDestroy?: (model: ModelRegistry[M]) => void;
    model?: ModelRegistry[M];
    modelName?: M; // If provided, new model instance created in constructor
    disabled: boolean = defaultTo(this.disabled, false);

    // Private properties
    @service store!: DS.Store;
    @service analytics!: Analytics;
    @service toast!: Toast;

    shouldShowMessages: boolean = false;
    saved: boolean = false;
    modelProperties: object = defaultTo(this.modelProperties, {});

    @or('disabled', 'saveModelTask.isRunning')
    inputsDisabled!: boolean;

    saveModelTask = task(function *(this: ValidatedModelForm<M>) {
        if (!this.model) {
            return;
        }
        this.analytics.click('button', 'Save');

        const { validations } = yield this.model.validate();
        this.set('shouldShowMessages', true);

        if (validations.get('isValid')) {
            try {
                yield this.model.save();
                this.set('saved', true);
                this.onSave(this.model);
                if (this.modelName) {
                    set(this, 'model', this.store.createRecord(this.modelName, this.modelProperties));
                }
                this.set('shouldShowMessages', false);
            } catch (e) {
                if (this.onError) {
                    this.onError(e, this.model);
                } else {
                    this.toast.error(e);
                }
                throw e;
            }
        }
    });

    constructor(...args: any[]) {
        super(...args);

        assert('Can only pass either a model or a modelName', !(Boolean(this.model) && Boolean(this.modelName)));

        if (!this.model && this.modelName) {
            this.model = this.store.createRecord(this.modelName, this.modelProperties);
        }
    }

    willDestroy() {
        if (this.model) {
            if (this.onWillDestroy !== undefined) {
                this.onWillDestroy(this.model);
            } else if (!this.saved) {
                this.model.unloadRecord();
            }
        }
    }
}
