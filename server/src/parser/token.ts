// token
export class Token {
    kind:string;
    text:string;
    location: Location;
}

class Location{
    uri: string;
    range: {
        start: {
            line: number,
            startCharacter: number
        },
        end: {
            line: number,
            endCharacter: number
        }
    };
}
