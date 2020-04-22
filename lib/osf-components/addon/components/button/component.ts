import Component from '@glimmer/component';

type Layout = 'small' | 'medium' | 'large' | 'fake-link';
type Type = 'primary' | 'secondary' | 'create' | 'destroy';

interface Args {
    layout?: Layout;
    type?: Type;
}

const classMap = {
    small: 'SmallButton',
    medium: 'MediumButton',
    large: 'LargeButton',
    'fake-link': 'FakeLink',
    primary: 'PrimaryButton',
    secondary: 'SecondaryButton',
    create: 'CreateButton',
    destroy: 'DestroyButton',
};

export default class Button extends Component<Args> {
    get classList(): string {
        const classes = [];
        const { layout, type } = this.args;

        if (layout) {
            classes.push(classMap[layout]);
        } else {
            classes.push(classMap.medium);
        }

        if (type) {
            classes.push(classMap[type]);
        } else {
            classes.push(classMap.secondary);
        }

        return classes.join(' ');
    }
}
