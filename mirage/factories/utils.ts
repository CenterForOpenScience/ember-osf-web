export const guid = (id: number, type: string): string => {
    const numPart = String(id);
    const typPart = type.substr(0, 5 - numPart.length);
    return `${typPart}${numPart}`;
};
