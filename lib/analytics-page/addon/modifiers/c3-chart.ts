import { modifier } from 'ember-modifier';
import c3 from 'c3';

export default modifier((element, _, named) => {
    const { c3Config } = named as any;
    const chart = c3.generate({
        ...c3Config,
        bindto: element,
    });
    return () => chart.destroy();
});
