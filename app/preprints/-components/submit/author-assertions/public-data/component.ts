import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import { PreprintDataLinksEnum } from 'ember-osf-web/models/preprint';


/**
 * The Public Data Args
 */
interface PublicDataArgs {
    manager: PreprintStateMachine;
    changeSet: BufferedChangeset;
    validate: () => {};
}

/**
 * The Public Data Component
 */
export default class PublicData extends Component<PublicDataArgs>{
    @service intl!: Intl;
    @tracked isPublicDataWhyNoStatementDisabled = true;
    @tracked placeholder!: string;

    publicDataOptionBlockValues = [
        {
            registrationResponseKey: 'hasDataLinks',
            inputValue: PreprintDataLinksEnum.YES,
            displayText: this.intl.t('general.available'),
        } as SchemaBlock,
        {
            registrationResponseKey: 'hasDataLinks',
            inputValue: PreprintDataLinksEnum.NO,
            displayText: this.intl.t('general.no'),
        } as SchemaBlock,
        {
            registrationResponseKey: 'hasDataLinks',
            inputValue: PreprintDataLinksEnum.NOT_APPLICABLE,
            displayText: this.intl.t('general.not-applicable'),
        } as SchemaBlock,
    ];

    public get displayPublicDataWhyNoStatement(): boolean {
        return this.args.changeSet.get('hasDataLinks') === undefined ?
            false :
            !this.displayPublicDataLinks;
    }

    public get displayPublicDataLinks(): boolean {
        return this.args.changeSet.get('hasDataLinks') === undefined ?
            false :
            this.args.changeSet.get('hasDataLinks')  === PreprintDataLinksEnum.YES;
    }

    @action
    public async updatePublicDataLinks(links: string[]): Promise<void> {
        await this.args.changeSet.set('dataLinks', links);
        this.args.validate();
    }

    @action
    public async updatePublicDataOptions(): Promise<void> {
        if (this.args.changeSet.get('hasDataLinks') === PreprintDataLinksEnum.YES) {
            await this.args.changeSet.set('whyNoData', '');
            this.isPublicDataWhyNoStatementDisabled = false;
        } else if (this.args.changeSet.get('hasDataLinks') === PreprintDataLinksEnum.NO) {
            await this.args.changeSet.set('whyNoData', '');
            this.isPublicDataWhyNoStatementDisabled = false;
            this.placeholder = this.intl.t('preprints.submit.step-three.public-data-no-placeholder');
        } else {
            this.isPublicDataWhyNoStatementDisabled = true;
            await this.args.changeSet.set('whyNoData',
                this.intl.t('preprints.submit.step-three.public-data-na-placeholder'));
            this.placeholder = this.intl.t('preprints.submit.step-three.public-data-na-placeholder');
        }

        this.args.validate();
    }
}
