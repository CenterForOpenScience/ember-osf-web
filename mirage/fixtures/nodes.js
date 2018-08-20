import config from 'ember-get-config';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

export default [
    { id: noteworthyNode, linkedNodeIds: ['1', '2', '3', '4', '5'], title: 'NNW' },
    { id: popularNode, linkedNodeIds: ['6', '7', '8', '9', '10'], title: 'Popular' },
];
