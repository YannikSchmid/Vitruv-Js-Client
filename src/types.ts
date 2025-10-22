export type EObject = {
    eClass: string;
    _id: string;
    [key: string]: any;
};

export type EResource = {
    uri: string;
    content: EObject;
};
