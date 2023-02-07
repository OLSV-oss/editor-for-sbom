import { Token } from "./token";

export class Spdx {
    kind: string;
    firstToken: Token;
    lastToken: Token;
    instances: Instance[];
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
    tag: Value;
    colon: Value;
    value: Value;
}

class Value{
    kind: string;
    firstToken: Token;
    lastToken: Token;
    text: Token | Token[];
}
