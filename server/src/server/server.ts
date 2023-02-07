import {
	Connection,
	InitializedParams,
	InitializeParams,
	InitializeResult,
	Logger,
	TextDocuments,
	TextDocumentSyncKind
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DeclarationsProvider } from "../provider/declarationsProvider";
import { CompletionsProvider } from "../provider/completionsProvider";
import { HoverProvider } from "../provider/hoverProvider";
import { EventsHandler } from "./eventsHandler";
import { Lexer } from "../parser/lexer";
import { Parser } from "../parser/parser";
import { SemanticsAnalyzer } from "../parser/semanticsAnalyzer";
import { SpdxAnalyzer } from "../parser/spdxAnalyzer";

export class Server {
	handlers?: EventsHandler;
	documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
	declarationsManager: DeclarationsProvider = new DeclarationsProvider();
	completionsManager: CompletionsProvider = new CompletionsProvider();
	hoverManager: HoverProvider = new HoverProvider();
	analyzer: SpdxAnalyzer = new SpdxAnalyzer(new Lexer(), new Parser(), new SemanticsAnalyzer());

	constructor(
		private connection: Connection,
    	public logger: Logger,
	){
    	this.documents.listen(this.connection);
    	this.connection.onInitialize(params => this.onInitialize(params));
    	this.connection.onInitialized(params => this.onInitialized(params));
	}

	// Manual initialization for testing only.
	initialize(params: InitializeParams): void {
		this.onInitialize(params);
	}

	start(): void {
		this.connection.listen();
	}

  	private onInitialize(params: InitializeParams): InitializeResult {
		this.connection.sendRequest;
		this.handlers = new EventsHandler(
			this.connection,
			this.documents,
			this.declarationsManager,
			this.hoverManager,
			this.completionsManager,
			this.analyzer,
			this.logger
		);

    	return {
    	  	capabilities: {
    	    	textDocumentSync: TextDocumentSyncKind.Incremental,
    	    	completionProvider: { resolveProvider: false },
    	    	hoverProvider: true,
				declarationProvider: true,
    	  	},
    	};
  	}

  	private async onInitialized(_params: InitializedParams): Promise<void> {
		this.logger.log('server is active.');
  	}
}
