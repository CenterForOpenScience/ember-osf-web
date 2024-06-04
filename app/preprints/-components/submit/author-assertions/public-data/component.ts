import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { PreprintDataLinksEnum } from 'ember-osf-web/models/preprint';
import { RadioButtonOption } from 'osf-components/components/form-controls/radio-button-group/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';


/**
 * The Public Data Args
 */
interface PublicDataArgs {
    manager: PreprintStateMachine;
    changeSet: BufferedChangeset;
    preprintWord: string;
    validate: () => {};
}

/**
 * The Public Data Component
 */
export default class PublicData extends Component<PublicDataArgs>{
    @service intl!: Intl;
    @tracked isPublicDataWhyNoStatementDisabled = true;
    @tracked placeholder!: string;

    publicDataOptions = [
        {
            inputValue: PreprintDataLinksEnum.AVAILABLE,
            displayText: this.intl.t('general.available'),
        } as RadioButtonOption,
        {
            inputValue: PreprintDataLinksEnum.NO,
            displayText: this.intl.t('general.no'),
        } as RadioButtonOption,
        {
            inputValue: PreprintDataLinksEnum.NOT_APPLICABLE,
            displayText: this.intl.t('general.not-applicable'),
        } as RadioButtonOption,
    ];

    public get displayPublicDataWhyNoStatement(): boolean {
        return this.args.changeSet.get('hasDataLinks') === null ?
            false :
            !this.displayPublicDataLinks;
    }

    public get displayPublicDataLinks(): boolean {
        return this.args.changeSet.get('hasDataLinks') === null ?
            false :
            this.args.changeSet.get('hasDataLinks')  === PreprintDataLinksEnum.AVAILABLE;
    }

    @action
    public updatePublicDataLinks(links: string[]): void {
        this.args.changeSet.set('dataLinks', links);
        this.args.validate();
    }

    @action
    public updatePublicDataOptions(): void {
        if (this.args.changeSet.get('hasDataLinks') === PreprintDataLinksEnum.AVAILABLE) {
            this.args.changeSet.set('whyNoData', null);
            this.isPublicDataWhyNoStatementDisabled = false;
        } else if (this.args.changeSet.get('hasDataLinks') === PreprintDataLinksEnum.NO) {
            this.args.changeSet.set('whyNoData', null);
            this.isPublicDataWhyNoStatementDisabled = false;
            this.placeholder = this.intl.t('preprints.submit.step-assertions.public-data-no-placeholder');
        } else {
            this.isPublicDataWhyNoStatementDisabled = true;
            this.args.changeSet.set('whyNoData',
                this.intl.t('preprints.submit.step-assertions.public-data-na-placeholder',
                    { singularPreprintWord: this.args.preprintWord}));
            this.placeholder =  this.intl.t('preprints.submit.step-assertions.public-data-na-placeholder',
                { singularPreprintWord: this.args.preprintWord});
        }

        this.args.validate();
    }
}
