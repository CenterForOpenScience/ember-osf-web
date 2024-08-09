import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import InstitutionsManagerComponent from '../institution-manager/component';


/**
 * The Institution Select List Args
 */
interface InstitutionSelectListArgs {
    manager: InstitutionsManagerComponent;
}

export default class InstitutionSelectList extends Component<InstitutionSelectListArgs> {
    @service intl!: Intl;

    // Required
    manager = this.args.manager;

    public get displayComponent(): boolean {
        return this.args.manager.institutions.length > 0;
    }

    public get descriptionDisplay(): string {
        return this.intl.t('preprints.submit.step-metadata.institutions.description',
            { singularPreprintWord: this.manager.preprintWord, htmlSafe: true}) as string;
    }
}
