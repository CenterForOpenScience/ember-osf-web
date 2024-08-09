import Component from '@glimmer/component';
import InstitutionsManagerComponent from '../institution-manager/component';


/**
 * The Institution Select List Args
 */
interface InstitutionSelectListArgs {
    manager: InstitutionsManagerComponent;
}

export default class InstitutionSelectList extends Component<InstitutionSelectListArgs> {
    // Required
    manager = this.args.manager;

    public get displayComponent(): boolean {
        return this.args.manager.institutions.length > 0;
    }
}
