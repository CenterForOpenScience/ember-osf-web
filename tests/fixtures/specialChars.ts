// Test cases shared by the family of "special character" fixer functions.
export default [
    [
        'a regular string',
        'a regular string',
    ],
    [
        'multiple &amp; sequences all become &amp;',
        'multiple & sequences all become &',
    ],
    [
        'also the brackets &lt; and &gt; are changed',
        'also the brackets < and > are changed',
    ],
    [
        '',
        '',
    ],
    [
        'for now, intentionally limit which characters are fixed &amp; &lt; &gt;',
        'for now, intentionally limit which characters are fixed & < >',
    ],
    [
        '&Amp; ingore casing because usability &gT; correctness',
        '& ingore casing because usability > correctness',
    ],
] as Array<[string, string]>;
