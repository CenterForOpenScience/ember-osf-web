import Component from '@glimmer/component';

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
};

type Layout = keyof typeof layoutClasses;
type Type = keyof typeof typeClasses;

interface Args {
    layout?: Layout;
    type?: Type;
}

export default class Button extends Component<Args> {
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
}
