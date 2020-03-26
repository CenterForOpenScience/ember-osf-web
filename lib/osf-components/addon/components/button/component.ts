import Component from '@glimmer/component';

import styles from './styles';

type Layout = 'small' | 'medium' | 'large' | 'fake-link';
type Type = 'primary' | 'secondary' | 'create' | 'destroy';

interface Args {
    layout?: Layout;
    type?: Type;
}

const classMap = {
    small: styles.SmallButton,
    medium: styles.MediumButton,
    large: styles.LargeButton,
    'fake-link': styles.FakeLink,
    primary: styles.PrimaryButton,
    secondary: styles.SecondaryButton,
    create: styles.CreateButton,
    destroy: styles.DestroyButton,
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
