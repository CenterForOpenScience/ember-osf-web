import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import Media from 'ember-responsive';

import Analytics from 'ember-osf-web/services/analytics';
import { tracked } from '@glimmer/tracking';
import { requiredAction } from 'ember-osf-web/decorators/component';

interface InputArgs {
    onSearch: (value: string) => void;
    translationParent?: string;
    showHelp: false;
    searchPlaceholder?: string;
}

export default class BrandedHeader extends Component<InputArgs> {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service media!: Media;
    @requiredAction onSearch!: (value: string) => void;
    @tracked showingHelp = false;

    notBranded = true;
    localClassNameBindings = ['notBranded:Header'];
    today = new Date();
    value = '';
    searchable = 0;

    get showHelp(): boolean {
        return this.args.showHelp;
    }

    get isMobile(): boolean {
        return this.media.isMobile;
    }

    get searchPlaceholder() {
        return this.args.searchPlaceholder ? this.args.searchPlaceholder
            : this.intl.t(`${this.args.translationParent}.header.search_placeholder`);
    }

    @computed('args.translationParent')
    get headerAriaLabel() {
        return  this.intl.t(`${this.args.translationParent}.header.osf_registrations`);
    }

    @action
    onSubmit() {
        this.analytics.click('link', 'Discover - Search', this.value);
        this.args.onSearch(this.value);
    }

    @action
    toggleHelp() {
        this.showingHelp = !this.showingHelp;
    }
}
