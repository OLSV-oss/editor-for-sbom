import {
	Position,
	Logger,
    Hover,
    MarkupContent,
    MarkupKind
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { SpdxAnalyzer } from "../parser/spdxAnalyzer";

export class HoverProvider {
    async getHover(document: TextDocument, position: Position, analyzer: SpdxAnalyzer, _logger: Logger): Promise<Hover | undefined> {
        const token = analyzer.identifyToken(document.uri, position);
        const instances = analyzer.getInstances();
        if(token !== undefined && instances[token.text] !== undefined){
            const instance = instances[token.text];
            let markdown: MarkupContent = {
                kind: MarkupKind.Markdown,
                value: [
                   `## ${instance.name}`,
                   `ID: **${instance.id}**`,
                   `License: **${instance.license}**`,
                   `meta: ${instance.meta}`
                    ].join(`\n\n`)
                };
            const hover: Hover= {
                contents: markdown
            };
            return hover;
        }
        return undefined;
    }
}
