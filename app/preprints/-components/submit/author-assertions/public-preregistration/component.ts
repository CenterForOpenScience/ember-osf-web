import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { PreprintPreregLinkInfoEnum, PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';
import { RadioButtonOption } from 'osf-components/components/form-controls/radio-button-group/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';


/**
 * The Public Preregistration Args
 */
interface PublicPreregistrationArgs {
    manager: PreprintStateMachine;
    changeSet: BufferedChangeset;
    preprintWord: string;
    disabled: boolean;
    validate: () => {};
}

interface PreregistationLinkInfoOption {
    key: string;
    value: string;
}

/**
 * The Public Preregistration Component
 */
export default class PublicPreregistration extends Component<PublicPreregistrationArgs>{
    @service intl!: Intl;
    @tracked isPublicPreregistrationWhyNoStatementDisabled = true;
    @tracked placeholder!: string;
    @tracked selectedValue!: string;

    constructor(owner: unknown, args: PublicPreregistrationArgs) {
        super(owner, args);

        this.selectedValue = this.args.manager.preprint.preregLinkInfo;
    }

    publicPreregLinkInfoOptions = [
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_EMPTY,
            value: this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-placeholder'),
        } as PreregistationLinkInfoOption,
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_DESIGNS,
            value: this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-designs'),
        } as PreregistationLinkInfoOption,
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_ANALYSIS,
            value: this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-analysis'),
        } as PreregistationLinkInfoOption,
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_BOTH,
            value: this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-both'),
        } as PreregistationLinkInfoOption,
    ];


    publicPreregistrationOptions = [
        {
            inputValue: PreprintPreregLinksEnum.AVAILABLE,
            displayText: this.intl.t('general.available'),
        } as RadioButtonOption,
        {
            inputValue: PreprintPreregLinksEnum.NO,
            displayText: this.intl.t('general.no'),
        } as RadioButtonOption,
        {
            inputValue: PreprintPreregLinksEnum.NOT_APPLICABLE,
            displayText: this.intl.t('general.not-applicable'),
        } as RadioButtonOption,
    ];

    public get displayPublicPreregistrationWhyNoStatement(): boolean {
        return this.args.changeSet.get('hasPreregLinks') === null ?
            false :
            !this.displayPublicPreregistrationLinks;
    }

    public get displayPublicPreregistrationLinks(): boolean {
        return this.args.changeSet.get('hasPreregLinks') === null ?
            false :
            this.args.changeSet.get('hasPreregLinks')  === PreprintPreregLinksEnum.AVAILABLE;
    }

    @action
    public updatePublicPreregistrationLinks(links: string[]): void {
        this.args.changeSet.set('preregLinks', links);
        this.args.validate();
    }

    @action
    public updatePublicPreregistrationOptions(): void {
        if (this.args.changeSet.get('hasPreregLinks') === PreprintPreregLinksEnum.AVAILABLE) {
            this.args.changeSet.set('whyNoPrereg', null);
            this.isPublicPreregistrationWhyNoStatementDisabled = false || !this.args.manager.isAdmin();
        } else if (this.args.changeSet.get('hasPreregLinks') === PreprintPreregLinksEnum.NO) {
            this.args.changeSet.set('preregLinks', []);
            this.args.changeSet.set('whyNoPrereg', null);
            this.isPublicPreregistrationWhyNoStatementDisabled = false || !this.args.manager.isAdmin();
            this.placeholder = this.intl.t('preprints.submit.step-assertions.public-preregistration-no-placeholder');
        } else {
            this.isPublicPreregistrationWhyNoStatementDisabled = true;
            this.args.changeSet.set('preregLinks', []);
            this.args.changeSet.set('whyNoPrereg',
                this.intl.t('preprints.submit.step-assertions.public-preregistration-na-placeholder',
                    { singularPreprintWord: this.args.preprintWord}));
            this.placeholder = this.intl.t('preprints.submit.step-assertions.public-preregistration-na-placeholder',
                { singularPreprintWord: this.args.preprintWord});
        }

        this.args.validate();
    }

    @action
    public updatePreregistrationLinkInfo(linkInfo: string): void {
        this.selectedValue = linkInfo;
        this.args.changeSet.set('preregLinkInfo', linkInfo);
        this.args.validate();
    }
}
