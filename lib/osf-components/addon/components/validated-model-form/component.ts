import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { Validations } from 'ember-cp-validations';
import DS, { ModelRegistry } from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';

import layout from './template';

type ValidatedModelName = {
    [K in keyof ModelRegistry]: ModelRegistry[K] extends (Validations & DS.Model) ? K : never
}[keyof ModelRegistry];

export default class ValidatedModelForm<M extends ValidatedModelName> extends Component {
    // Required arguments
    @requiredAction onSave!: (model: ModelRegistry[M]) => void;

    // Optional arguments
    model?: ModelRegistry[M];
    modelName?: M; // If provided, new model instance created in constructor
    disabled: boolean = defaultTo(this.disabled, false);
    analyticsScope?: string;

    // Private properties
    @service store!: DS.Store;
    @service analytics!: Analytics;
    @service toast!: Toast;
    layout = layout;

    messagesShown: boolean = false;
    saved: boolean = false;

    @or('disabled', 'saveModelTask.isRunning')
    inputsDisabled!: boolean;

    saveModelTask = task(function *(this: ValidatedModelForm<M>) {
        if (!this.model) {
            return;
        }
        if (this.analyticsScope) {
            this.analytics.click('button', `${this.analyticsScope} - Save developer app`);
        }

        const { validations } = yield this.model.validate();
        this.set('messagesShown', true);

        if (validations.get('isValid')) {
            try {
                yield this.model.save();
                this.set('saved', true);
                this.onSave(this.model);
            } catch (e) {
                this.toast.error(e);
                throw e;
            }
        }
    });

    constructor(...args: any[]) {
        super(...args);

        if (!this.model && this.modelName) {
            this.model = this.store.createRecord(this.modelName, {});
        }
    }

    willDestroy() {
        if (this.model && !this.saved) {
            this.model.unloadRecord();
        }
    }
}
