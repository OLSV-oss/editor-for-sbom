import { TextDocument, Position } from "vscode-languageserver-textdocument";
import {
    Diagnostic
} from "vscode-languageserver";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { SemanticsAnalyzer } from "./semanticsAnalyzer";
import { Instance, Field } from "./spdx";
import { Token } from "./token";

// token
export class SpdxAnalyzer {
    lexer: Lexer;
    parser: Parser;
    semanticsAnalyzer: SemanticsAnalyzer;
    asts:{};
    instances:{};
    words: String[];
    public constructor(lexer: Lexer, parser: Parser, semanticsAnalyzer: SemanticsAnalyzer){
        this.lexer = lexer;
        this.parser = parser;
        this.semanticsAnalyzer = semanticsAnalyzer;
    }

    public nowAST(document: TextDocument){
        return this.asts[document.uri.toString()].ast;
    }

    public analyze(document: TextDocument, diagnostics: Diagnostic[]): Diagnostic[]{
        this.asts = new Object();
        this.instances = new Object();
        this.words = new Array();
        const uri = document.uri.toString();
        const tokens = this.lexer.getTokens(uri, document.getText(), 1);
		const st = this.parser.parse(tokens, diagnostics);
        if(st instanceof SyntaxError || st === undefined){
            this.asts[uri] = undefined;
            return diagnostics;
        }
        const ast = this.semanticsAnalyzer.analyze(st, diagnostics);
        this.asts[uri] = {tokens, ast};
        // Put the instance that can be identified by SPDXID in "instances"
        ast.instances.forEach(instance => {
            let description;
            switch (instance.kind) {
                case "DocumentCreation Information":
                    description = this.summarizeDocumentCreationInfo(instance);
                    break;
                case "Package Information":
                    description = this.summarizePackageInfo(instance);
                    break;
                case "File Information":
                    description = this.summarizeFileInfo(instance);
                    break;
                case "Snippet Information":
                    description = this.summarizeSnippetInfo(instance);
                    break;
                case "License Information":
                    description = this.summarizeLicenseInfo(instance);
                    break;
                case "Review Information":
                    description = this.summarizeReviewInfo(instance);
                    break;
            }
            if(description !== undefined){
                this.instances[description.id] = {...description};
                this.words.push(description.id);
            }
        });
    	return diagnostics;
    }

    public getIds(): String[]{
        if(this.words === undefined){
            return undefined;
        }
        return this.words;
    }

    public getInstances(){
        if(this.instances === undefined){
            return undefined;
        }
        return this.instances;
    }

    private summarizeDocumentCreationInfo(instance: Instance){
        const id = this.getFirstObj(instance.id.value.text).text;
        let name;
        let license;
        let meta = {};
        instance.fields.forEach(field => {
                switch (this.getFirstObj(field.tag.text).text) {
                    case "DocumentName":
                        name = this.concatTokenText(field.value.text);
                        break;
                    case "DataLicense":
                        license = this.concatTokenText(field.value.text);
                        break;
                    case "Creator":
                        break;
                    case "Created":
                        meta = this.concatTokenText(field.value.text);
                        break;
                }
        });
        return {
            id,
            name,
            license,
            meta,
            firstToken: instance.firstToken,
            lastToken: instance.lastToken
        };
    }

    private summarizePackageInfo(instance: Instance){
        const id = this.getFirstObj(instance.id.value.text).text;
        let name;
        let license;
        let meta = {};
        instance.fields.forEach(field => {
                switch (this.getFirstObj(field.tag.text).text) {
                    case "PackageName":
                        name = this.concatTokenText(field.value.text);
                        break;
                    case "PackageLicenseDeclared":
                        license = this.concatTokenText(field.value.text);
                        break;
                    case "PackageDownloadLocation":
                        meta = this.concatTokenText(field.value.text);
                        break;
                }
        });
        return {
            id,
            name,
            license,
            meta,
            firstToken: instance.firstToken,
            lastToken: instance.lastToken
        };
    }

    private summarizeFileInfo(instance: Instance){
        const id = this.getFirstObj(instance.id.value.text).text;
        let name;
        let license;
        let meta = {};
        instance.fields.forEach(field => {
                switch (this.getFirstObj(field.tag.text).text) {
                    case "FileName":
                        name = this.concatTokenText(field.value.text);
                        break;
                    case "LicenseConcluded":
                        license = this.concatTokenText(field.value.text);
                        break;
                    case "FileCopyrightText":
                        meta = this.concatTokenText(field.value.text);
                        break;
                }
        });

        return {
            id,
            name,
            license,
            meta,
            firstToken: instance.firstToken,
            lastToken: instance.lastToken
        };
    }

    private summarizeSnippetInfo(instance: Instance){
        const id = this.getFirstObj(instance.id.value.text).text;
        let name;
        let license;
        let meta = {};
        instance.fields.forEach(field => {
                switch (this.getFirstObj(field.tag.text).text) {
                    case "SnippetName":
                        name = this.concatTokenText(field.value.text);
                        break;
                    case "SnippetLicenseConcluded":
                        license = this.concatTokenText(field.value.text);
                        break;
                    case "SnippetByteRange":
                        meta = this.concatTokenText(field.value.text);
                        break;
                }
        });
        return {
            id,
            name,
            license,
            meta,
            firstToken: instance.firstToken,
            lastToken: instance.lastToken
        };
    }

    private summarizeLicenseInfo(instance: Instance){
        const id = this.getFirstObj(instance.id.value.text).text;
        let name: String;
        const license = "-";
        let meta = {};
        instance.fields.forEach(field => {
            switch (this.getFirstObj(field.tag.text).text) {
                case "LicenseName":
                    name = this.concatTokenText(field.value.text);
                    break;
                case "ExtractedText":
                    meta = this.getFirstObj(field.value.text).text;
                    break;
            }
        });
        if(name === undefined){
            name = `"No License Name"`;
        }
        return {
            id,
            name,
            license,
            meta,
            firstToken: instance.firstToken,
            lastToken: instance.lastToken
        };
    }

    private summarizeReviewInfo(instance: Instance){
        const id = this.getFirstObj(instance.id.value.text).text;
        let name;
        const license = "-";
        let meta = {};
        instance.fields.forEach(field => {
            switch (this.getFirstObj(field.tag.text).text) {
                case "Reviewer":
                    name = `Reviewed by ${this.concatTokenText(field.value.text)}`;
                    break;
                case "ReviewDate":
                    meta = "Reviewed " + this.concatTokenText(field.value.text);
                    break;
            }
        });
        return {
            id,
            name,
            license,
            meta,
            firstToken: instance.firstToken,
            lastToken: instance.lastToken
        };
    }

    private getFirstObj<T>(obj: T | Array<T>): T{
        if(Array.isArray(obj)){
            return obj[0];
        }
        return obj;
    }

    private concatTokenText(tokens: Token | Token[]): String{
        let text;
        if(Array.isArray(tokens)){
            tokens.forEach((token)=>{
                if(text === undefined){
                    text = token.text;
                }else{
                    text = text + " " + token.text;
                }
            });
            return text;
        }
        return tokens.text;
    }

    public identifyToken(uri, position: Position): Token | undefined{
        if(this.asts[uri] === undefined){
            return undefined;
        }
        for(let instance of this.asts[uri].ast.instances) {
            if(this.inLine(instance.firstToken, instance.lastToken, position)){
                if(this.inLine(instance.id.firstToken, instance.id.lastToken, position)){
                    return this.findToken(instance.id, position);
                }
                for(let field of instance.fields) {
                    if(this.inLine(field.firstToken, field.lastToken, position)){
                        return this.findToken(field, position);
                    }
                }
                for(let annotation of instance.annotations) {
                    if(this.inLine(annotation.firstToken, annotation.lastToken, position)){
                        return this.findToken(annotation, position);
                    }
                }
                for(let relation of instance.relations) {
                    if(this.inLine(relation.firstToken, relation.lastToken, position)){
                        return this.findToken(relation, position);
                    }
                }
                for(let externalRef of instance.externalRefs) {
                    if(this.inLine(externalRef.firstToken, externalRef.lastToken, position)){
                        return this.findToken(externalRef, position);
                    }
                }
            }
        }
        return undefined;
    }

    private inLine(firstToken: Token, lastToken: Token, position: Position): boolean{
        if(firstToken.location.range.start.line <= position.line && firstToken.location.range.end.line >= position.line){
            return true;
        }
        if(firstToken.location.range.end.line <= position.line && lastToken.location.range.start.line >= position.line ){
            // Eol has tokenized, so process shouldn't in this scope
            return true;
        }
        if(lastToken.location.range.start.line <= position.line && lastToken.location.range.end.line >= position.line ){
            return true;
        }
        return false;
    }

    private inRange(token: Token, position: Position): boolean{
        if(token.location.range.start.startCharacter <= position.character
            && token.location.range.end.endCharacter >= position.character){
            return true;
        }
        return false;
    }

    private findToken(field: Field, position: Position): Token | undefined{
        if(this.inRange(field.tag.firstToken, position)){
            return this.getFirstObj(field.tag.text);
        }
        if(this.inRange(field.colon.firstToken, position)){
            return this.getFirstObj(field.colon.text);
        }
        if(Array.isArray(field.value.text)){
            for(let token of field.value.text) {
                if(this.inLine(token, token, position) && this.inRange(token, position)){
                    return token;
                }
            }
        }else{
            if(this.inRange(field.value.firstToken, position)){
                return this.getFirstObj(field.value.text);
            }
        }
        return undefined;
    }
}
