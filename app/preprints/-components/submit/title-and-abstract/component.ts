import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence, validateLength, validateFormat } from 'ember-changeset-validations/validators';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { DOIRegex } from 'ember-osf-web/utils/doi';

/**
 * The TitleAndAbstract Args
 */
interface TitleAndAbstractArgs {
    manager: PreprintStateMachine;
}

interface TitleAndAbstractForm {
    title: string;
    description: string;
    manualDoi: string;
    manualGuid: string;
}

/**
 * The Title And Abstract Component
 */
export default class TitleAndAbstract extends Component<TitleAndAbstractArgs>{
    @service intl!: Intl;
    titleAndAbstractFormValidation: ValidationObject<TitleAndAbstractForm> = {
        title: validatePresence({
            presence: true,
            ignoreBlank: true,
            type: 'empty',
        }),
        description: [
            validatePresence({
                presence: true,
                ignoreBlank: true,
                type: 'empty',
            }),
            validateLength({
                min: 20,
                type: 'greaterThanOrEqualTo',
                translationArgs: {
                    description: this.intl.t('preprints.submit.step-title.abstract-input'),
                    gte: this.intl.t('preprints.submit.step-title.abstract-input-error'),
                },
            }),
        ],
        manualDoi: validateFormat({
            allowBlank: true,
            allowNone: true,
            ignoreBlank: true,
            regex: DOIRegex,
            type: 'invalid_doi',
        }),
        manualGuid: validateLength({
            allowBlank: true,
            min:5,
            type: 'greaterThanOrEqualTo',
            translationArgs: {
                description: this.intl.t('preprints.submit.step-title.guid'),
                gte: '5 characters',
            },
        }),
    };

    titleAndAbstractFormChangeset = buildChangeset(this.args.manager.preprint, this.titleAndAbstractFormValidation);

    @action
    public validate(): void {
        this.titleAndAbstractFormChangeset.validate();
        if (this.titleAndAbstractFormChangeset.isInvalid) {
            this.args.manager.validateTitleAndAbstract(false);
            return;
        }
        this.titleAndAbstractFormChangeset.execute();
        this.args.manager.validateTitleAndAbstract(true);
    }
}
