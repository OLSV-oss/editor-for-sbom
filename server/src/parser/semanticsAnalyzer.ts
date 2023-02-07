import { SpdxSt, Section} from "./spdxSt";
import { Spdx, Instance} from "./spdx";
import { Diagnostic } from 'vscode-languageserver';
import { SpdxConstants } from "./spdxConstants";

export class SemanticsAnalyzer {
    public constructor(){
    }

    public analyze(st: SpdxSt, diagnostics: Diagnostic[]): Spdx{
        const instances = this.analyzeSections(st.sections);
        return{
            kind: st.kind,
            firstToken: st.firstToken,
            lastToken: st.lastToken,
            instances
        };
    }

    public analyzeSections(sections: Section[]): Instance[] {
        const analyzedSections: Instance[] = [];
        sections.forEach(section =>{
            switch (section.kind) {
                case "DocumentCreation Information":
                    analyzedSections.push(this.analyzeDocumentCreationSection(section));
                    break;
                case "Package Information":
                    analyzedSections.push(this.analyzePackageSection(section));
                    break;
                case "File Information":
                    analyzedSections.push(this.analyzeFileSection(section));
                    break;
                case "Snippet Information":
                    analyzedSections.push(this.analyzeSnippetSection(section));
                    break;
                case "License Information":
                    analyzedSections.push(this.analyzeLicenseSection(section));
                    break;
                case "Review Information":
                    analyzedSections.push(this.analyzeReviewSection(section));
                    break;
                case "error":
                    // return error in parser
                    break;
            }
        });
        return analyzedSections;
        // check LicenseID in this scope?
    }

    public analyzeDocumentCreationSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
            const typed = this.typing(field);
            switch (typed.firstToken.text){
                case "SPDXVersion":
                    fields.push(typed);
                    break;
                case "SPDXID":
                    id = typed;
                    break;
                case "DataLicense":
                    fields.push(typed);
                    break;
                case "DocumentName":
                    fields.push(typed);
                    break;
                case "DocumentNamespace":
                    fields.push(typed);
                    break;
                case "DocumentComment":
                    fields.push(typed);
                    break;
                case "Creator":
                    fields.push(typed);
                    break;
                case "Created":
                    fields.push(typed);
                    break;
                case "CreatorComment":
                    fields.push(typed);
                    break;
                case "LicenseListVersion":
                    fields.push(typed);
                    break;
                default:
                    if(SpdxConstants.relationship.includes(typed.firstToken.text)){
                        relations.push(this.analyzeRelationship(typed));
                    }else if(SpdxConstants.annotation.includes(typed.firstToken.text)){
                        annotations.push(this.analyzeAnnotation(typed));
                    }else if(SpdxConstants.externalRefField.includes(typed.firstToken.text)){
                        externalRefs.push(this.analyzeExternalRef(typed));
                    }
            }
        });
        // Required Check
        // "SPDXVersion"
        // "SPDXID"
        if(id === undefined){
            // push diagnostics 「must write SPDXID in DocumentCreationInfo Section」
        }
        // "DataLicense"
        // "DocumentName"
        // "DocumentNamespace"
        // "Creator"
        // "Created"
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }
    
    public analyzePackageSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
            const typed = this.typing(field);
            switch (typed.firstToken.text){
                case "PackageName":
                    fields.push(typed);
                    break;
                case "SPDXID":
                    id = typed;
                    break;
                case "PackageVersion":
                    fields.push(typed);
                    break;
                case "PackageFileName":
                    fields.push(typed);
                    break;
                case "PackageSupplier":
                    fields.push(typed);
                    break;
                case "PackageOriginator":
                    fields.push(typed);
                    break;
                case "PackageDownloadLocation":
                    fields.push(typed);
                    break;
                case "FilesAnalyzed":
                    fields.push(typed);
                    break;
                case "PackageChecksum":
                    fields.push(typed);
                    break;
                case "PackageHomePage":
                    fields.push(typed);
                    break;
                case "PackageVerificationCode":
                    fields.push(typed);
                    break;
                case "PackageLicenseConcluded":
                    fields.push(typed);
                    break;
                case "PackageLicenseDeclared":
                    fields.push(typed);
                    break;
                case "PackageLicenseInfoFromFiles":
                    fields.push(typed);
                    break;
                case "PackageSourceInfo":
                    fields.push(typed);
                    break;
                case "PackageLicenseComments":
                    fields.push(typed);
                    break;
                case "PackageCopyrightText":
                    fields.push(typed);
                    break;
                case "PackageSummary":
                    fields.push(typed);
                    break;
                case "PackageDescription":
                    fields.push(typed);
                    break;
                case "PackageComment":
                    fields.push(typed);
                    break;
                case "PackageAttributionText":
                    fields.push(typed);
                    break;
                default:
                    if(SpdxConstants.relationship.includes(typed.firstToken.text)){
                        relations.push(this.analyzeRelationship(typed));
                    }else if(SpdxConstants.annotation.includes(typed.firstToken.text)){
                        annotations.push(this.analyzeAnnotation(typed));
                    }else if(SpdxConstants.externalRefField.includes(typed.firstToken.text)){
                        externalRefs.push(this.analyzeExternalRef(typed));
                    }
            }
        });
        // Required Check
        // "PackageName"
        // "SPDXID"
        // "PackageVersion"
        // "PackageFileName"
        // "PackageDownloadLocation"
        // "FilesAnalyzed"
        // "PackageHomePage"
        // "PackageLicenseConcluded"
        // "PackageLicenseDeclared"
        // "PackageLicenseComments"
        // "PackageCopyrightText"
        // "PackageComment"
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }

    public analyzeFileSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
            const typed = this.typing(field);
            switch (typed.firstToken.text){
                case "FileName":
                    fields.push(typed);
                    break;
                case "SPDXID":
                    id = typed;
                    break;
                case "FileType":
                    fields.push(typed);
                    break;
                case "FileChecksum":
                    fields.push(typed);
                    break;
                case "LicenseConcluded":
                    fields.push(typed);
                    break;
                case "LicenseComments":
                    fields.push(typed);
                    break;
                case "LicenseInfoInFile":
                    fields.push(typed);
                    break;
                case "FileCopyrightText":
                    fields.push(typed);
                    break;
                case "FileComment":
                    fields.push(typed);
                    break;
                case "FileNotice":
                    fields.push(typed);
                    break;
                case "FileAttributionText":
                    fields.push(typed);
                    break;
                case "FileDependency":
                    fields.push(typed);
                    break;
                case "FileContributor":
                    fields.push(typed);
                    break;
                case "ArtifactOfProjectHomePage":
                    fields.push(typed);
                    break;
                case "ArtifactOfProjectURI":
                    fields.push(typed);
                    break;
                case "ArtifactOfProjectName":
                    fields.push(typed);
                    break;
                default:
                    if(SpdxConstants.relationship.includes(typed.firstToken.text)){
                        relations.push(this.analyzeRelationship(typed));
                    }else if(SpdxConstants.annotation.includes(typed.firstToken.text)){
                        annotations.push(this.analyzeAnnotation(typed));
                    }else if(SpdxConstants.externalRefField.includes(typed.firstToken.text)){
                        externalRefs.push(this.analyzeExternalRef(typed));
                    }
            }
        });
        // Required Check
        // "FileName"
        // "SPDXID"
        // "FileChecksum"
        // "LicenseConcluded"
        // "LicenseInfoInFile"
        // "FileCopyrightText"
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }

    public analyzeSnippetSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
            const typed = this.typing(field);
            switch (typed.firstToken.text){
                case "SnippetName":
                    fields.push(typed);
                    break;
                case "SnippetSPDXID":
                    id = typed;
                    break;
                case "SnippetFromFileSPDXID":
                    fields.push(typed);
                    break;
                case "SnippetByteRange":
                    fields.push(typed);
                    break;
                case "SnippetLineRange":
                    fields.push(typed);
                    break;
                case "SnippetLicenseConcluded":
                    fields.push(typed);
                    break;
                case "SnippetLicenseComments":
                    fields.push(typed);
                    break;
                case "SnippetCopyrightText":
                    fields.push(typed);
                    break;
                case "SnippetAttributionText":
                    fields.push(typed);
                    break;
                case "SnippetComment":
                    fields.push(typed);
                    break;
                case "LicenseInfoInSnippet":
                    fields.push(typed);
                    break;
                default:
                    if(SpdxConstants.relationship.includes(typed.firstToken.text)){
                        relations.push(this.analyzeRelationship(typed));
                    }else if(SpdxConstants.annotation.includes(typed.firstToken.text)){
                        annotations.push(this.analyzeAnnotation(typed));
                    }else if(SpdxConstants.externalRefField.includes(typed.firstToken.text)){
                        externalRefs.push(this.analyzeExternalRef(typed));
                    }
            }
        });
        // Required Check
        // "SnippetSPDXID"
        // "SnippetFromFileSPDXID"
        // "SnippetByteRange"
        // "SnippetLicenseConcluded"
        // "SnippetCopyrightText"
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }

    public analyzeLicenseSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
            const typed = this.typing(field);
            switch (typed.firstToken.text){
                case "LicenseName":
                    fields.push(typed);
                    break;
                case "LicenseID":
                    id = typed;
                    break;
                case "ExtractedText":
                    fields.push(typed);
                    break;
                case "LicenseComment":
                    fields.push(typed);
                    break;
                default:
                    if(SpdxConstants.relationship.includes(typed.firstToken.text)){
                        relations.push(this.analyzeRelationship(typed));
                    }else if(SpdxConstants.annotation.includes(typed.firstToken.text)){
                        annotations.push(this.analyzeAnnotation(typed));
                    }else if(SpdxConstants.externalRefField.includes(typed.firstToken.text)){
                        externalRefs.push(this.analyzeExternalRef(typed));
                    }
            }
        });
        // Required Check
        // "LicenseID"
        // "ExtractedText"
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }

    public analyzeReviewSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
            const typed = this.typing(field);
            switch (typed.firstToken.text){
                case "Reviewer":
                    fields.push(typed);
                    id = typed;
                    break;
                case "ReviewComment":
                    fields.push(typed);
                    break;
                case "ReviewDate":
                    fields.push(typed);
                    break;
                default:
                    if(SpdxConstants.relationship.includes(typed.firstToken.text)){
                        relations.push(this.analyzeRelationship(typed));
                    }else if(SpdxConstants.annotation.includes(typed.firstToken.text)){
                        annotations.push(this.analyzeAnnotation(typed));
                    }else if(SpdxConstants.externalRefField.includes(typed.firstToken.text)){
                        externalRefs.push(this.analyzeExternalRef(typed));
                    }
            }
        });
        // Required Check
        // "Reviewer"
        // temporarily put id in "Reviewer"
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }

    public analyzeIllegalSection(section){
        let id; // "SPDXID"
        let fields = [];
        let annotations = [];
        let relations = [];
        let externalRefs = [];
        section.fields.forEach(field => {
        });
        // In this case, what to do "id"...
        return{
            kind: section.kind,
            firstToken: section.firstToken,
            lastToken: section.lastToken,
            id,
            fields,
            annotations,
            relations,
            externalRefs
        };
    }

    public typing(field){
        if(SpdxConstants.spdxIDField.includes(field.firstToken.text)){
            // SPDXID
            return this.analyzeSPDXIDField(field);
        }else if(SpdxConstants.licenseField.includes(field.firstToken.text)){
            return this.analyzeLicenseField(field);
        }else if(field.firstToken.text === "LicenseID"){
            return this.analyzeLicenseIDField(field);
        }else{
            return this.analyzeField(field);
        }
    }

    public analyzeField(field){
        const [tagToken, colonToken, ...valueTokens] = field.data;
        const tag = {
            kind: "tag",
            firstToken: tagToken,
            lastToken: tagToken,
            text: tagToken
        };
        const colon = {
            kind: "colon",
            firstToken: colonToken,
            lastToken: colonToken,
            text: colonToken
        };
        const value = this.analyzeValue(valueTokens);
        return{
            kind: "field",
            firstToken: field.firstToken,
            lastToken: field.lastToken,
            tag,
            colon,
            value
        };
    }

    public analyzeSPDXIDField(field){
        const tag = {
            kind: "tag",
            firstToken: field.data[0],
            lastToken: field.data[0],
            text: field.data[0]
        };
        const colon = {
            kind: "colon",
            firstToken: field.data[1],
            lastToken: field.data[1],
            text: field.data[1]
        };
        const value = {
            kind: "value",
            type: "spdxId",
            firstToken: field.data[2],
            lastToken: field.data[2],
            text: field.data[2]
        };
        // Diagnostics if there is after field[3] (and lastToken is eol)
        if(field.data.length >= 4){
        }
        return{
            kind: "field",
            firstToken: field.firstToken,
            lastToken: field.lastToken,
            tag,
            colon,
            value
        };
    }

    public analyzeLicenseField(field){
        // this.licenseIdentifiers.push
        const tag = {
            kind: "tag",
            firstToken: field.data[0],
            lastToken: field.data[0],
            text: field.data[0]
        };
        const colon = {
            kind: "colon",
            firstToken: field.data[1],
            lastToken: field.data[1],
            text: field.data[1]
        };
        // Need to confirm SPDX License Expression
        const valueFields = field.data.slice(2, (field.data.length -1));
        const value = this.analyzeValue(valueFields);
        return{
            kind: "field",
            firstToken: field.firstToken,
            lastToken: field.lastToken,
            tag,
            colon,
            value
        };
    }

    public analyzeLicenseIDField(field){
        // this.licenseIdentifiers.push
        const tag = {
            kind: "tag",
            firstToken: field.data[0],
            lastToken: field.data[0],
            text: field.data[0]
        };
        const colon = {
            kind: "colon",
            firstToken: field.data[1],
            lastToken: field.data[1],
            text: field.data[1]
        };
        const value = {
            kind: "value",
            type: "licenseId",
            firstToken: field.data[2],
            lastToken: field.data[2],
            text: field.data[2]
        };
        // Diagnostics if there is after field[3] (and lastToken is eol)
        return{
            kind: "field",
            firstToken: field.firstToken,
            lastToken: field.lastToken,
            tag,
            colon,
            value
        };
    }

    public analyzeValue(values){
        return{
            kind: "value",
            type: "value",
            firstToken: values[0],
            lastToken: values[values.length-1],
            text: values
        };
    }

    public analyzeAnnotation(field){
        return field;
    }

    public analyzeRelationship(field){
        // const value = {
        //     subject: field.data[2], // Need reference
        //     relationship: field.data[3], // Need branch because of next field may be commentField
        //     object: field.data[4], // Need reference
        // };
        return field;
    }
    public analyzeExternalRef(field){
        return field;
    }
}

