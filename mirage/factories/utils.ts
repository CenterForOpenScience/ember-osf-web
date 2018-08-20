export const guid = (id: number, type: string): string => { // eslint-disable-line import/prefer-default-export
    const numPart = String(id);
    const typPart = type.substr(0, 5 - numPart.length);
    return `${typPart}${numPart}`;
};
