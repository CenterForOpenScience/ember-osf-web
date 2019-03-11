import { layout } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { ChangesetDef } from 'ember-changeset/types';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import { requiredAction } from 'ember-osf-web/decorators/component';
import { ValidatedModelName } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

@layout(template)
export default class ValidatedChangesetForm<M extends ValidatedModelName> extends Component {
    // Required arguments
    @requiredAction onSave!: (changeset: ChangesetDef) => void;

    // Optional arguments
    onError?: (e: object, changeset: ChangesetDef) => void;
    onWillDestroy?: (changeset?: ChangesetDef) => void;
    disabled: boolean = defaultTo(this.disabled, false);
    changeset!: ChangesetDef;
    recreateModel: boolean = defaultTo(this.recreateModel, false);

    // Private properties
    @service store!: DS.Store;
    @service analytics!: Analytics;
    @service toast!: Toast;

    shouldShowMessages: boolean = false;
    onDirtChange?: (dirt: boolean) => boolean;

    @or('disabled', 'saveTask.isRunning')
    inputsDisabled!: boolean;

    @alias('changeset.isDirty')
    isDirty!: boolean;

    saveTask = task(function *(this: ValidatedChangesetForm<M>) {
        yield this.changeset.validate();

        if (this.changeset.get('isValid')) {
            try {
                this.onSave(this.changeset);
                this.set('shouldShowMessages', false);
            } catch (e) {
                if (this.onError) {
                    this.onError(e, this.changeset);
                } else {
                    this.toast.error(e);
                }
                throw e;
            }
        } else {
            this.set('shouldShowMessages', true);
        }
    });

    constructor(...args: any[]) {
        super(...args);
        const { changeset } = this;
        this._onDirtChange();
        changeset.on('afterValidation', () => {
            this._onDirtChange();
        });
    }

    _onDirtChange() {
        if (typeof (this.onDirtChange) !== 'undefined') {
            this.onDirtChange(this.isDirty);
        }
    }

    willDestroy() {
        if (this.onWillDestroy !== undefined) {
            this.onWillDestroy(this.changeset);
        }
    }

    @action
    rollback() {
        this.changeset.rollback();
    }
}
