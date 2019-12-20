import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager from 'registries/drafts/draft/navigation-manager';

@tagName('')
export default class PageNavigation extends Component {
    // required
    updateRoute!: (pageHeadingText: string) => void;
    onPageNotFound!: () => void;
    draftManager!: DraftRegistrationManager;
    navManager!: NavigationManager;

    didReceiveAttrs() {
        assert('@draftManager is required.', Boolean(this.draftManager));
        assert('@navManager is required.', Boolean(this.navManager));

        const { currentPage, currentPageManager, lastPage } = this.navManager;

        if (currentPage! > lastPage) {
            this.onPageNotFound();
        } else {
            this.updateRoute(currentPageManager!.pageHeadingText as string);
        }
    }
}
