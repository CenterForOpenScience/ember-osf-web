import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { PreprintPreregLinkInfoEnum, PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';
import { RadioButtonOption } from 'osf-components/components/form-controls/radio-button-group/component';


/**
 * The Public Preregistration Args
 */
interface PublicPreregistrationArgs {
    changeSet: BufferedChangeset;
    preprintWord: string;
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

    publicPreregLinkInfoOptions = [
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_EMPTY,
            value: this.intl.t('preprints.submit.step-three.public-preregistration-link-info-placeholder'),
        } as PreregistationLinkInfoOption,
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_DESIGNS,
            value: this.intl.t('preprints.submit.step-three.public-preregistration-link-info-designs'),
        } as PreregistationLinkInfoOption,
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_ANALYSIS,
            value: this.intl.t('preprints.submit.step-three.public-preregistration-link-info-analysis'),
        } as PreregistationLinkInfoOption,
        {
            key:  PreprintPreregLinkInfoEnum.PREREG_BOTH,
            value: this.intl.t('preprints.submit.step-three.public-preregistration-link-info-both'),
        } as PreregistationLinkInfoOption,
    ];


    publicPreregistrationOptions = [
        {
            inputValue: PreprintPreregLinksEnum.YES,
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
        return this.args.changeSet.get('hasPreregLinks') === undefined ?
            false :
            !this.displayPublicPreregistrationLinks;
    }

    public get displayPublicPreregistrationLinks(): boolean {
        return this.args.changeSet.get('hasPreregLinks') === undefined ?
            false :
            this.args.changeSet.get('hasPreregLinks')  === PreprintPreregLinksEnum.YES;
    }

    @action
    public updatePublicPreregistrationLinks(links: string[]): void {
        this.args.changeSet.set('preregLinks', links);
        this.args.validate();
    }

    @action
    public updatePublicPreregistrationOptions(): void {
        if (this.args.changeSet.get('hasPreregLinks') === PreprintPreregLinksEnum.YES) {
            this.args.changeSet.set('whyNoPrereg', '');
            this.isPublicPreregistrationWhyNoStatementDisabled = false;
        } else if (this.args.changeSet.get('hasPreregLinks') === PreprintPreregLinksEnum.NO) {
            this.args.changeSet.set('whyNoPrereg', '');
            this.isPublicPreregistrationWhyNoStatementDisabled = false;
            this.placeholder = this.intl.t('preprints.submit.step-three.public-preregistration-no-placeholder');
        } else {
            this.isPublicPreregistrationWhyNoStatementDisabled = true;
            this.args.changeSet.set('whyNoPrereg',
                this.intl.t('preprints.submit.step-three.public-preregistration-na-placeholder',
                    { singularPreprintWord: this.args.preprintWord}));
            this.placeholder = this.intl.t('preprints.submit.step-three.public-preregistration-na-placeholder',
                { singularPreprintWord: this.args.preprintWord});
        }

        this.args.validate();
    }

    @action
    public updatePreregistrationLinkInfo(linkInfo: string): void {
        this.args.changeSet.set('preregLinkInfo', linkInfo);
        this.args.validate();
    }
}
