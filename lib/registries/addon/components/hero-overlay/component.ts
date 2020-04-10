import Component from '@glimmer/component';

type Alignment = 'left' | 'center';

interface Args {
    align?: Alignment;
}

const classMap = {
    left: 'AlignLeft',
    center: 'AlignCenter',
};

export default class HeroOverlay extends Component<Args> {
    get classList(): string {
        const classes = [];
        const { align } = this.args;

        if (align) {
            classes.push(classMap[align]);
        } else {
            classes.push(classMap.center);
        }

        return classes.join(' ');
    }
}
