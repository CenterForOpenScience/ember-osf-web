import Component from '@glimmer/component';

interface Args {
    filterState: string;
}

export default class RegistrationListManager extends Component<Args> {
    reloadSubmissionsList!: () => void;

    get filterParams() {
        const query: Record<string, string> = {};
        query['filter[machine_state]'] = this.args.filterState || 'pending';
        // TODO: Add sorting params
        return query;
    }
}
