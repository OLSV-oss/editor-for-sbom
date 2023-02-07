import {
	Position,
	Logger,
    Range,
    Location
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SpdxAnalyzer } from "../parser/spdxAnalyzer";

export class DeclarationsProvider {
    async getDeclaration(document: TextDocument, position: Position, analyzer: SpdxAnalyzer, _logger: Logger): Promise<Location | undefined> {
        const token = analyzer.identifyToken(document.uri, position);
        const instances = analyzer.getInstances();
        if(token !== undefined && instances[token.text] !== undefined){
            const instance = instances[token.text];
            const start = {
                line: instance.firstToken.location.range.start.line,
                character: instance.firstToken.location.range.start.startCharacter,
            };
            const end = {
                line: instance.lastToken.location.range.end.line,
                character: instance.lastToken.location.range.end.endCharacter,
            };
            const range = Range.create(start, end);
            const location = Location.create(document.uri, range);
            return location;
        }
    }
}
