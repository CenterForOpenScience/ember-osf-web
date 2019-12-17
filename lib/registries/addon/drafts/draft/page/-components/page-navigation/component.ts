import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
// import { action, computed } from '@ember/object';
// import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

@tagName('')
export default class PageNavigation extends Component {
    // required
    currentPage!: number;
    lastPage!: number;
    currentPageManager!: PageManager;
    updateRoute!: (pageHeadingText: string) => void;
    onPageNotFound!: () => void;

    didReceiveAttrs() {
        // tslint:disable-next-line: no-console
        console.log(this);
        assert('currentPage is not a number', Number.isInteger(this.currentPage));
        assert('lastPage is not a number', Number.isInteger(this.lastPage));

        if (this.currentPage > this.lastPage) {
            this.onPageNotFound();
        } else {
            this.updateRoute(this.currentPageManager.pageHeadingText as string);
        }
    }
}
