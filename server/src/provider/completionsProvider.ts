import {
	Position,
	Logger,
    CompletionItem,
    CompletionItemKind,
    CompletionList,
    MarkupContent,
    MarkupKind
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

export class CompletionsProvider {
    async getCompletion(keywords: String[], document: TextDocument, position: Position, _logger: Logger): Promise<CompletionItem[] | undefined> {
        const completionItems: CompletionItem[] = [];
        let completionList: CompletionList;
            for (let i = 0; i < keywords.length; i++) {
                completionItems.push(
                    {
                        label: keywords[i].toString(),
                        kind: CompletionItemKind.Keyword,
                        documentation: 'SPDX TagValue - ID'
                    }
                );
            }
            completionList = CompletionList.create(completionItems, false);
        return completionItems;
    }
}
