import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import Theme from 'ember-osf-web/services/theme';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

const layoutClasses = {
    small: 'SmallButton',
    medium: 'MediumButton',
    large: 'LargeButton',
    'fake-link': 'FakeLink',
};

const typeClasses = {
    primary: 'PrimaryButton',
    secondary: 'SecondaryButton',
    create: 'CreateButton',
    destroy: 'DestroyButton',
    default: 'DefaultButton',
};

type Layout = keyof typeof layoutClasses;
type Type = keyof typeof typeClasses;

interface Args {
    layout?: Layout;
    type?: Type;
}

export default class Button extends Component<Args> {
    @service theme!: Theme;

    get classList(): string {
        const classes = [];
        const { layout, type } = this.args;

        if (layout) {
            classes.push(layoutClasses[layout]);
        } else {
            classes.push(layoutClasses.medium);
        }

        if (type) {
            classes.push(typeClasses[type]);
        } else if (layout !== 'fake-link') {
            classes.push(typeClasses.secondary);
        }

        return classes.join(' ');
    }

    get primaryColor(): string {
        if (!this.theme.provider) {
            return '#337ab7'; // $color-osf-primary;
        }
        // Only preprint-providers will have brands that need to be checked for color contrast
        const brand = (this.theme.provider as PreprintProviderModel).brand;
        return brand ? brand.get('primaryColor') : '#337ab7';
    }
}
