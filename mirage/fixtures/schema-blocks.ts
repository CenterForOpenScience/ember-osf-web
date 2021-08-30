/* eslint-disable camelcase,max-len */
import SchemaBlock from 'ember-osf-web/models/schema-block';

import open_ended_registration from
    '../fixture-data/schema-blocks/open-ended-registration';
import prereg_challenge from
    '../fixture-data/schema-blocks/prereg-challenge';
import replication_recipe_pre_registration from
    '../fixture-data/schema-blocks/replication-recipe-pre-registration';

const exampleSchema: Array<Partial<SchemaBlock>> = [
    {
        id: 'SB1',
        blockType: 'page-heading',
        displayText: 'First page of Test Schema',
        index: 0,
    },
    {
        id: 'SB2',
        blockType: 'section-heading',
        displayText: 'First section',
        index: 1,
    },
    {
        id: 'SB3',
        blockType: 'subsection-heading',
        displayText: 'Subsection',
        index: 2,
    },
    {
        id: 'SB4',
        blockType: 'question-label',
        displayText: 'What do cats like more?',
        schemaBlockGroupKey: 'q1',
        index: 3,
    },
    {
        id: 'SB5',
        blockType: 'single-select-input',
        registrationResponseKey: 'page-one_single-select',
        schemaBlockGroupKey: 'q1',
        index: 4,
    },
    {
        id: 'SB6',
        blockType: 'select-input-option',
        displayText: 'tuna fish sandwiches with lots of mayonaise but not too much because that\'s gross',
        helpText: 'Chicken of the sea!',
        schemaBlockGroupKey: 'q1',
        index: 5,
    },
    {
        id: 'SB7',
        blockType: 'select-input-option',
        displayText: 'chicken pot pie but be careful because they come out real hot and you could burn yourself if you don\'t wait for them to cool',
        helpText: 'The original white meat!',
        schemaBlockGroupKey: 'q1',
        index: 6,
    },
    {
        id: 'SB8',
        blockType: 'question-label',
        displayText: 'Which Pokemon is your favorite?',
        exampleText: 'Bulbasaur, Ivysaur, Venusaur, Charmander, Charmeleon, Charizard, Squirtle, Wartortle, Blastoise, Caterpie, Metapod, Butterfree, Weedle, Kakuna, Beedrill, Pidgey, Pidgeotto, Pidgeot, Rattata, Raticate, Spearow, Fearow, Ekans, Arbok, Pikachu, Raichu, Sandshrew, Sandslash, Nidoran♀, Nidorina, Nidoqueen, Nidoran♂, Nidorino, Nidoking, Clefairy, Clefable, Vulpix, Ninetales, Jigglypuff, Wigglytuff, Zubat, Golbat, Oddish, Gloom, Vileplume, Paras, Parasect, Venonat, Venomoth, Diglett, Dugtrio',
        schemaBlockGroupKey: 'q2',
        index: 7,
    },
    {
        id: 'SB9',
        blockType: 'short-text-input',
        registrationResponseKey: 'page-one_short-text',
        schemaBlockGroupKey: 'q2',
        required: true,
        index: 8,
    },
    {
        id: 'SB10',
        blockType: 'question-label',
        displayText: 'What is the difference between a swamp and a marsh?',
        schemaBlockGroupKey: 'q3',
        index: 9,
    },
    {
        id: 'SB11',
        blockType: 'long-text-input',
        registrationResponseKey: 'page-one_long-text',
        schemaBlockGroupKey: 'q3',
        index: 10,
    },
    {
        id: 'SB12',
        blockType: 'question-label',
        displayText: 'I never understood all the hate for:',
        schemaBlockGroupKey: 'q4',
        index: 11,
    },
    {
        id: 'SB13',
        blockType: 'multi-select-input',
        registrationResponseKey: 'page-one_multi-select',
        schemaBlockGroupKey: 'q4',
        index: 12,
    },
    {
        id: 'SB14',
        blockType: 'select-input-option',
        displayText: 'Nickelback (I mean they are really actually pretty great and I could listen to them all day or at least for a couple of minutes)',
        helpText: 'Chad Kroeger is my hero',
        schemaBlockGroupKey: 'q4',
        index: 13,
    },
    {
        id: 'SB15',
        blockType: 'select-input-option',
        displayText: 'Crocs',
        helpText: 'I mean, how can you not love waterproof clogs?',
        schemaBlockGroupKey: 'q4',
        index: 14,
    },
    {
        id: 'SB16',
        blockType: 'select-other-option',
        displayText: 'Other:',
        schemaBlockGroupKey: 'q4',
        index: 15,
    },
    {
        id: 'SB17',
        blockType: 'short-text-input',
        registrationResponseKey: 'page-one_multi-select-other',
        schemaBlockGroupKey: 'q5',
        index: 16,
    },
    {
        id: 'SB18',
        blockType: 'page-heading',
        displayText: 'This is the second page',
        index: 17,
    },
    {
        id: 'SB19',
        blockType: 'question-label',
        displayText: 'If I had a super power it would be:',
        schemaBlockGroupKey: 'q6',
        index: 18,
    },
    {
        id: 'SB20',
        blockType: 'single-select-input',
        registrationResponseKey: 'page-one_single-select-two',
        schemaBlockGroupKey: 'q6',
        index: 19,
    },
    {
        id: 'SB21',
        blockType: 'select-input-option',
        displayText: 'Always be on the proper beat while doing the macarena',
        schemaBlockGroupKey: 'q6',
        index: 20,
    },
    {
        id: 'SB22',
        blockType: 'select-input-option',
        displayText: 'Remember who was in NSync and who was in Backstreet Boys',
        schemaBlockGroupKey: 'q6',
        index: 21,
    },
    {
        id: 'SB23',
        blockType: 'select-other-option',
        displayText: 'Other',
        schemaBlockGroupKey: 'q6',
        index: 22,
    },
];

export const ids = exampleSchema.map(block => block.id);

export default [
    ...open_ended_registration,
    ...prereg_challenge,
    ...replication_recipe_pre_registration,
    ...exampleSchema,
] as SchemaBlock[];

/* eslint-enable camelcase,max-len */
