import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import EmberObject, { action, computed } from '@ember/object';
import { alias, and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { buildValidations, Validations, validator } from 'ember-cp-validations';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import { DOIRegex, extractDoi } from 'ember-osf-web/utils/doi';
import template from './template';

export interface PublicationDoiManager {
    save: () => void;
    publicationDoi: string;
    inEditMode: boolean;
    validationNode: Registration & Validations;
    didValidate: boolean;
}

const DoiValidations = buildValidations({
    articleDoi: [
        validator('format', {
            allowBlank: true,
            regex: DOIRegex,
            messageKey: 'validationErrors.invalid_doi',
        }),
    ],
});

const ValidatedModel = EmberObject.extend(DoiValidations);

@tagName('')
@layout(template)
export default class PublicationDoiManagerComponent extends Component.extend({
    save: task(function *(this: PublicationDoiManagerComponent) {
        const { validations } = yield this.validationNode.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        const doi = extractDoi(this.validationNode.articleDoi as string) || null;

        this.node.set('articleDoi', doi);
        try {
            yield this.node.save();
        } catch (e) {
            this.node.rollbackAttributes();
            this.toast.error(this.i18n.t('registries.registration_metadata.edit_pub_doi.error'));
            throw e;
        }
        this.set('requestedEditMode', false);
        this.toast.success(this.i18n.t('registries.registration_metadata.edit_pub_doi.success'));
    }).restartable(),
}) {
    // required
    node!: Registration;

    // private
    @service i18n!: I18N;
    @service toast!: Toast;

    requestedEditMode: boolean = false;
    validationNode!: Registration & Validations;
    didValidate = false;

    @not('didValidate') didNotValidate!: boolean;
    @alias('node.userHasAdminPermission') userCanEdit!: boolean;
    @and('userCanEdit', 'requestedEditMode') inEditMode!: boolean;
    @alias('node.category') category!: boolean;

    didReceiveAttrs() {
        if (this.node) {
            this.setProperties({
                validationNode: ValidatedModel.create({ ...this.node }),
            });
        }
    }

    @computed('node.articleDoi')
    get fieldIsEmpty() {
        return !this.node.articleDoi;
    }

    @computed('fieldIsEmpty', 'userCanEdit')
    get shouldShowField() {
        return this.userCanEdit || !this.fieldIsEmpty;
    }

    @action
    startEditing() {
        this.set('requestedEditMode', true);
    }

    @action
    cancel() {
        this.setProperties({
            requestedEditMode: false,
            didValidate: false,
        });
        this.validationNode.set('articleDoi', this.node.articleDoi || '');
    }
}
