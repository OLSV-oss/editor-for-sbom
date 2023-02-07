import { Token } from "./token";

export class SpdxSt {
    kind: string;
    firstToken: Token;
    lastToken: Token;
    sections: Section[];
}

export class Section{
    kind: string;
    firstToken: Token;
    lastToken: Token;
    fields: Field[];
}

export class Instance{
    kind: string;
    id: Field;
    fields: Field[];
    annotations: Field[];
    relations: Field[];
    externalRefs: Field[];
    firstToken: Token;
    lastToken: Token;
}

export class Field{
    kind: string;
    firstToken: Token;
    lastToken: Token;
    data: Token[];
}
