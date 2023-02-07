export class Lexer {
    text: string;
    index: number;
    currentChar: string;
    nextChar: string | undefined;
    uri: string;
    startCharacter: number;

    public constructor(){
    }

    private readNextChar(): void
    {
        this.index++;
        if(this.index === this.text.length - 1){
            this.currentChar = this.text[this.index];
            this.nextChar = "EOF";
        }
        else if(this.index === this.text.length){
            this.currentChar = "EOF";
            this.nextChar = "END";
        }
        else{
            this.currentChar = this.text[this.index];
            this.nextChar = this.text[this.index + 1];
        }
    }

    public getTokens(uri: string, text: string, eol: number): any[]{
        this.text = text;
        this.index = -1;
        this.uri = uri;
        if(eol !== 1 && eol !== 2){
            return undefined;
        };
        this.readNextChar();
        
        let tokens = [];
        let line: number = 0;
        this.startCharacter = 0;// start position(head of line)
        while(true){
            if (this.nextChar === "END") {break;}
            this.startCharacter = this.startCharacter + this.skipSpace();
            const token = this.scanNextToken(eol);
            let kind: string;
            switch(token.text){
                case "\n":
                    kind = "eol";
                    break;
                case "\r\n":
                    kind = "eol";
                    break;
                case ":":
                    kind = ":";
                    break;
                case "<text>":
                    kind = "textStart";
                    break;
                case "</text>":
                    kind = "textEnd";
                    break;
                case "SPDXVersion":
                    kind = "EntityField";
                    break;
                case "PackageName":
                    kind = "EntityField";
                    break;
                case "FileName":
                    kind = "EntityField";
                    break;
                case "SnippetSPDXID":
                    kind = "EntityField";
                    break;
                case "LicenseID":
                    kind = "EntityField";
                    break;
                case "Reviewer":
                    kind = "EntityField";
                    break;
                default:
                    if(token.text.startsWith("#")){
                        // comment
                        kind = "comment";
                    }else if(token.text.startsWith("<") && !token.text.endsWith(">")){
                        // lack of angle bracket pair 
                        kind = "half angle bracket";
                    }else if(!token.text.startsWith("<") && token.text.endsWith(">")){
                        // lack of angle bracket pair 
                        kind = "half angle bracket";
                    }else{
                        kind = "value";
                    }
                    break;
            }
            const text = token.text;
            // Advance the count by the number of characters
            const endCharacter = this.startCharacter + token.strCount - 1;
            const uri = this.uri;
            const startCharacter = this.startCharacter;
            const start = { line, startCharacter};
            const end = { line, endCharacter };
            const location = { uri, range: { start, end } };
            const lspToken = { kind, text, location };
            tokens.push(lspToken);
            if (this.currentChar === "EOF") {break;}
            this.readNextChar();
            // update the count
            this.startCharacter = endCharacter;
            if(lspToken.text.includes("\n")){
                ++line;
                this.startCharacter = -1;
            }
            ++this.startCharacter;
        }
        return tokens;
    }

    public scanNextToken(eol: number): {text: string, strCount:number }{
        let token: {text: string, strCount:number };
        if(eol === 1){token = this.scanNextTokenLF();}
        if(eol === 2){token = this.scanNextTokenCRLF();}
        return token;
    }

    public scanNextTokenLF(): {text: string, strCount:number }{
        let text: string; // token
        let strCount: number = 0;
        if(this.currentChar.match("#") && this.startCharacter === 0){
            text = this.currentChar;
            ++strCount;
            while(this.currentChar !=="\n"){
                this.readNextChar();
                if (this.currentChar === "EOF"){
                    break;
                }
                ++strCount;
                text = text + this.currentChar;
            }
        }else if(this.currentChar.match(":")){
            text = ":";
            ++strCount;
        }else if(this.currentChar.match("<")){
            text = this.currentChar;
            ++strCount;
            if(this.nextChar !== "EOF"){
                while(!text.includes(">")){
                    this.readNextChar();
                    ++strCount;
                    text = text + this.currentChar;
                    if(this.nextChar === "EOF" || this.nextChar.match(/\s/) ){
                        break;
                    }
                } // Can't it be 「this.currentChar = ">"」?
            }
        }else if(this.currentChar.match("\n")){
            // /n
            text = this.currentChar;
            ++strCount;
        }else{
            text = this.currentChar;
            ++strCount;
            while(this.notSplitterLF(this.nextChar)){
                this.readNextChar();
                ++strCount;
                text = text + this.currentChar;
            }
        }
        return {text, strCount};
    }

    public scanNextTokenCRLF(): {text: string, strCount:number }{
        let text: string; // token
        let strCount: number = 0;
        if(this.currentChar.match("#") && this.startCharacter === 0){
            text = this.currentChar;
            ++strCount;
            while(this.nextChar !== "\r"){
                this.readNextChar();
                if (this.currentChar === "\n" && this.nextChar === "EOF"){
                    ++strCount;
                    text = text + this.currentChar;
                    break;
                }
                if (this.currentChar === "EOF"){
                    break;
                }
                ++strCount;
                text = text + this.currentChar;
            }
        }else if(this.currentChar.match(":")){
            text = ":";
            ++strCount;
        }else if(this.currentChar.match("<")){
            text = this.currentChar;
            ++strCount;
            if(this.nextChar !== "EOF"){
                while(!text.includes(">")){
                    this.readNextChar();
                    ++strCount;
                    text = text + this.currentChar;
                    if(this.nextChar === "EOF" || this.nextChar.match(/\s/) ){
                        break;
                    }
                }
            }
        }else if(this.currentChar.match("\r") && this.nextChar.match("\n")){
            // \r\n
            text = this.currentChar + this.nextChar;
            ++strCount;
            this.readNextChar();
            ++strCount;
        }else{
            text = this.currentChar;
            ++strCount;
            while(this.notSplitterCRLF(this.nextChar)){
                this.readNextChar();
                ++strCount;
                text = text + this.currentChar;
            }
        }
        return {text, strCount};
    }

    private skipSpace(): number{
        let skipCount:number = 0;
        while(/\p{Zs}/u.test(this.currentChar)){
            this.readNextChar();
            ++skipCount;
        }
        return skipCount;
    }

    public notSplitterLF(string: string): boolean{
        if (string.match("\n") || string.match("[:<>]") || string.match("[\u{20}\u{3000}]") || string.match("EOF") || string.match("END")) {
            // splitter
            return false;
        }
        return true;
    }

    public notSplitterCRLF(string: string): boolean{
        if (string.match("\r") || string.match("[:<>]") || string.match("[\u{20}\u{3000}]") || string.match("EOF") || string.match("END")) {
            // splitter
            return false;
        }
        if(string.match("\r")){
            // eol = "/r/n"
            if(this.nextChar.match("\n")){
                return false;
            }
        }
        return true;
    }
}
