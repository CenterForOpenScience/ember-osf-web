import { layout } from '@ember-decorators/component';
import { or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { set } from '@ember/object';
import { typeOf } from '@ember/utils';
import Changeset from 'ember-changeset';
import { ChangesetDef, ValidatorFunc } from 'ember-changeset/types';
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
    @requiredAction onSave!: (changeset: ChangesetDef) => void;

    // Optional arguments
    onError?: (e: object, changeset: ChangesetDef) => void;
    onWillDestroy?: (model: ModelRegistry[M]) => void;
    model?: ModelRegistry[M];
    modelName?: M; // If provided, new model instance created in constructor
    disabled: boolean = defaultTo(this.disabled, false);
    changeset?: ChangesetDef;

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
        if (!this.changeset) {
            return;
        }

        yield this.changeset.validate();
        const validations = this.changeset.get('validations');
        this.set('shouldShowMessages', true);

        if (validations.get('isValid')) {
            try {
                yield this.changeset.save({});
                this.set('saved', true);
                this.onSave(this.changeset);
                if (this.modelName) {
                    set(this, 'model', this.store.createRecord(this.modelName, this.modelProperties));
                    if (this.model !== undefined) {
                        set(this, 'changeset', this.buildChangeset(this.model));
                    }
                }
                this.set('shouldShowMessages', false);
            } catch (e) {
                if (this.onError) {
                    this.onError(e, this.changeset);
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
        if (!this.changeset && this.model) {
            set(this, 'changeset', this.buildChangeset(this.model));
        }
    }

    willDestroy() {
        if (this.model) {
            if (this.onWillDestroy !== undefined) {
                this.onWillDestroy(this.model);
            }
        }
    }

    // Lifted wholesale from https://github.com/offirgolan/ember-changeset-cp-validations/blob/master/addon/index.js
    buildChangeset(model: ModelRegistry[M]) {
        assert('Object does not contain any validations', typeOf(model.validations) === 'instance');
        const validationMap = model.validations.validatableAttributes.reduce((o: any, attr: string) => {
            o[attr] = true; // eslint-disable-line no-param-reassign
            return o;
        }, {});

        const validateFn: ValidatorFunc = async params => {
            return model.validateAttribute(params.key, params.newValue).then(({ validations }) => {
                return validations.isValid ? true : validations.message;
            });
        };

        return new Changeset(model, validateFn, validationMap) as ChangesetDef;
    }
}
