import { computed } from '@ember/object';
import Component from '@glimmer/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import UserModel from 'ember-osf-web/models/user';

interface UserSearchCardComponentArguments {
    addedContributors: ContributorModel[];
    user: UserModel;
}

export default class UserSearchCardComponent extends Component<UserSearchCardComponentArguments> {
    @computed('args.{addedContributors.[],user.id}')
    get isAdded() {
        const addedContributorsId = this.args.addedContributors.map(item => item.users.get('id'));
        return addedContributorsId.includes(this.args.user.id);
    }
}
