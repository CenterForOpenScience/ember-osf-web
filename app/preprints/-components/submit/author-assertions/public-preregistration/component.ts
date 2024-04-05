import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';


/**
 * The Public Preregistration Args
 */
interface PublicPreregistrationArgs {
    changeSet: BufferedChangeset;
    validate: () => {};
}

/**
 * The Public Preregistration Component
 */
export default class PublicPreregistration extends Component<PublicPreregistrationArgs>{
    @service intl!: Intl;
    @tracked isPublicPreregistrationWhyNoStatementDisabled = true;
    @tracked placeholder!: string;

    publicPreregistrationOptionBlockValues = [
        {
            registrationResponseKey: 'hasPreregLinks',
            inputValue: PreprintPreregLinksEnum.YES,
            displayText: this.intl.t('general.available'),
        } as SchemaBlock,
        {
            registrationResponseKey: 'hasPreregLinks',
            inputValue: PreprintPreregLinksEnum.NO,
            displayText: this.intl.t('general.no'),
        } as SchemaBlock,
        {
            registrationResponseKey: 'hasPreregLinks',
            inputValue: PreprintPreregLinksEnum.NOT_APPLICABLE,
            displayText: this.intl.t('general.not-applicable'),
        } as SchemaBlock,
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
    public async updatePublicPreregistrationLinks(links: string[]): Promise<void> {
        await this.args.changeSet.set('preregLinks', links);
        this.args.validate();
    }

    @action
    public async updatePublicPreregistrationOptions(): Promise<void> {
        if (this.args.changeSet.get('hasPreregLinks') === PreprintPreregLinksEnum.YES) {
            await this.args.changeSet.set('whyNoPrereg', '');
            this.isPublicPreregistrationWhyNoStatementDisabled = false;
        } else if (this.args.changeSet.get('hasPreregLinks') === PreprintPreregLinksEnum.NO) {
            await this.args.changeSet.set('whyNoPrereg', '');
            this.isPublicPreregistrationWhyNoStatementDisabled = false;
            this.placeholder = this.intl.t('preprints.submit.step-three.public-preregistration-no-placeholder');
        } else {
            this.isPublicPreregistrationWhyNoStatementDisabled = true;
            await this.args.changeSet.set('whyNoPrereg',
                this.intl.t('preprints.submit.step-three.public-preregistration-na-placeholder'));
            this.placeholder = this.intl.t('preprints.submit.step-three.public-preregistration-na-placeholder');
        }

        this.args.validate();
    }
}
