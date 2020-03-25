import Component from '@glimmer/component';

type Layout = 'small' | 'medium' | 'large' | 'fake-link';
type Type = 'primary' | 'secondary' | 'create' | 'destroy';

interface Args {
    layout?: Layout;
    type?: Type;
}

export default class Button extends Component<Args> {
    get classList(): string {
        const classes = [];
        const { layout, type } = this.args;

        if (layout) {
            classes.push(layout);
        } else {
            classes.push('medium');
        }

        if (type) {
            classes.push(type);
        } else {
            classes.push('secondary');
        }

        return classes.join(' ');
    }
}
