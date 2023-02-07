import { Token } from "./token";
import { SpdxConstants } from "./spdxConstants";
import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";
import { SpdxSt } from "./spdxSt";

export class Parser {
    tokens: Token[];
    index: number;
    length: number;
    previousToken: Token;
    currentToken: Token;
    nextToken: Token | undefined;
    diagnostics: Diagnostic[];
    onDebug: Boolean = false;
    public constructor(onDebug?: Boolean){
        this.previousToken = { kind:"SOF", text:undefined, location: undefined};
        if(onDebug){
            this.onDebug = onDebug;
            console.log("Debug mode");
        }
    }

    public readNextToken(){
        this.index++;
        if(this.index === this.length - 1){
            this.previousToken = this.currentToken;
            this.currentToken = this.tokens[this.index];
            this.nextToken = { kind:"EOF", text:undefined, location: undefined};
        }else if(this.index === this.length){
            this.previousToken = this.tokens[this.index];
            this.currentToken = { kind:"EOF", text:undefined, location: undefined};
            this.nextToken = { kind:"END", text:undefined, location: undefined};
        }else if(this.index === this.length + 1){
            this.previousToken = { kind:"EOF", text:undefined, location: undefined};
            this.currentToken = { kind:"END", text:undefined, location: undefined};
            this.nextToken = { kind:"Out of Range", text:undefined, location: undefined};
        }
        else{
            if(this.currentToken !== undefined){
                this.previousToken = this.currentToken;
            }
            this.currentToken = this.tokens[this.index];
            this.nextToken = this.tokens[this.index + 1];
        }
    }

    public parse(tokenizedInput: Token[], diagnostics: Diagnostic[]): SpdxSt | SyntaxError{
        this.tokens = tokenizedInput;
        this.index = -1;
        this.length = tokenizedInput.length;
        this.diagnostics = diagnostics;
        this.readNextToken();

        const firstToken = this.currentToken;
        let sections = [];
        // Not start with "SPDXVersion"
        if(firstToken.text !== "SPDXVersion"){
            diagnostics.push(createDiagnostic(firstToken, 1, 'You must start with "SPDXVersion" Tag in spdx file.'));
            return;
        }
        while (true){
            let section = null;
            this.skipNeedlessLine();
            switch(this.currentToken.text){
                case "SPDXVersion":
                    section = this.parseSection("DocumentCreation Information");
                    break;
                case "PackageName":
                    section = this.parseSection("Package Information");
                    break;
                case "FileName":
                    section = this.parseSection("File Information");
                    break;
                case "SnippetSPDXID":
                    section = this.parseSection("Snippet Information");
                    break;
                case "LicenseID":
                    section = this.parseSection("License Information");
                    break;
                case "Relationship":
                    // weak section
                case "Annotator":
                    // weak section
                case "Reviewer":
                    section = this.parseSection("Review Information");
                    break;
                // default:
                //     diagnoseNotEntityStart(this.currentToken, diagnostics);
                //     return;
            }
            if (section !== undefined){
                sections.push(section);
            }
            if(this.currentToken.kind === "EOF" || this.nextToken.kind === "EOF"){
                break;
            }
        }
        this.readNextToken();
        const lastToken = this.currentToken.kind === "EOF" ? this.currentToken: this.previousToken;
        return {
            kind: "SPDXDocument",
            firstToken,
            lastToken,
            sections
        };
    }

    public parseSection(sectionName: string): {}{
        const firstToken = this.currentToken;
        let fields = [];
        while(true){
            const field = SpdxConstants.multipleField.includes(this.currentToken.text) ? this.parseCommentField() : this.parseField() ;
            if(field === undefined){
                break;
            }
            fields.push(field);
            if (this.nextToken.kind === "EOF"){
                break;
            }
            this.readNextToken();
            this.skipNeedlessLine();
            // fields of the section until entityStartField or EOF
            if (this.currentToken.kind === "EntityField" || this.currentToken.kind === "EOF"){
                break;
            }
        }
        const lastToken = this.nextToken.kind === "EOF" ? this.currentToken : this.previousToken;
        // if optional.unknowns exists, parse error
        return { 
            kind: sectionName,
            firstToken,
            lastToken,
            fields
        };
    }
    public parseField(): {}{
        const firstToken = this.currentToken;
        let data = [];
        while(true){
            data.push(this.currentToken);
            this.readNextToken();
            if(this.currentToken.kind === "eol"){
                break;
            }
            if(this.nextToken.kind === "EOF"){break;}
        }
        data.push(this.currentToken);
        const lastToken = this.currentToken;
        if(!this.onDebug){
            diagnoseField(data, this.diagnostics);
        }
        return {
            kind: "field", 
            firstToken,
            data,
            lastToken
        };
    }

    public parseCommentField(): {}{
        const firstToken = this.currentToken;
        let data = [];
        while(true){
            data.push(this.currentToken);
            this.readNextToken();
            if(this.currentToken.kind === "textEnd"){break;}
            // need check nextToken is head of line?
            if(this.nextToken.kind === "EOF"){break;}
            if(SpdxConstants.lineField.includes(this.nextToken.text) || SpdxConstants.multipleField.includes(this.nextToken.text)){break;}
        }
        data.push(this.currentToken);
        if(this.nextToken.kind === "eol"){
            this.readNextToken();
            data.push(this.currentToken);
        }
        const lastToken = this.currentToken;
        if(!this.onDebug){
            diagnoseCommentField(data, this.diagnostics);
        }
        return {
            kind: "commentField", 
            firstToken,
            data,
            lastToken
        };
    }

    public skipNeedlessLine(){
        if(this.currentToken.kind === "eol" || this.currentToken.kind === "comment"){
            while(true){
                this.readNextToken();
                if(this.currentToken.kind !== "eol" && this.currentToken.kind !== "comment"){
                    break;
                }
           }
        }
    }
}

function createDiagnostic(token: Token, severity: DiagnosticSeverity, message: string){
    return {
        range:{
            start: {
                line: token.location.range.start.line,
                character: token.location.range.start.startCharacter
            },
            end: {
                line: token.location.range.end.line,
                character: token.location.range.end.endCharacter
            }
        },
        severity,
        source: ".spdx",
        message
    };
}
export function diagnoseField(data: Token[], diagnostics: Diagnostic[]){
    if(!SpdxConstants.lineField.includes(data[0].text)){
        diagnostics.push(createDiagnostic(data[0], 1, "You must start with SPDX field Tag in line."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[1].text !== ":"){
        diagnostics.push(createDiagnostic(data[1], 1, "Type ':' immediately after the SPDXfield."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data.length === 3){
        diagnostics.push(createDiagnostic(data[2], 1, "This line need value."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    return;
}

export function diagnoseCommentField(data: Token[], diagnostics: Diagnostic[]){
    if(!SpdxConstants.multipleField.includes(data[0].text)){
        diagnostics.push(createDiagnostic(data[0], 1, "You must start with SPDX field Tag in line."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[1].text !== ":"){
        diagnostics.push(createDiagnostic(data[1], 1, "Type ':' immediately after the SPDXfield."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[2].text !== "<text>"){
        diagnostics.push(createDiagnostic(data[2], 1, "A value in Multiple lines must start with <text>."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[data.length -2].text !== "</text>" && data[data.length -1].text === "\n"){
        diagnostics.push(createDiagnostic(data[data.length -2], 1, "A value in Multiple lines must end with </text>."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[data.length -1].text !== "\n" && data[data.length -1].text !== "</text>"){
        diagnostics.push(createDiagnostic(data[data.length -1], 1, "A value in Multiple lines must end with </text>."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    return;
}

export function diagnoseNotEntityStart(data: Token[], diagnostics: Diagnostic[]){
    if(!SpdxConstants.multipleField.includes(data[0].text)){
        diagnostics.push(createDiagnostic(data[0], 1, "You must start with SPDX field Tag in line."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[1].text !== ":"){
        diagnostics.push(createDiagnostic(data[1], 1, "Type ':' immediately after the SPDXfield."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[2].text !== "<text>"){
        diagnostics.push(createDiagnostic(data[2], 1, "A value in Multiple lines must start with <text>."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[data.length -2].text !== "</text>" && data[data.length -1].text === "\n"){
        diagnostics.push(createDiagnostic(data[data.length -2], 1, "A value in Multiple lines must end with </text>."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    if(data[data.length -1].text !== "\n" && data[data.length -1].text !== "</text>"){
        diagnostics.push(createDiagnostic(data[data.length -1], 1, "A value in Multiple lines must end with </text>."));
        throw new SyntaxError("SPDXField Format Violation");
    }
    return;
}
