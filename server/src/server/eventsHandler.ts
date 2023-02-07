import {
	CompletionItem,
	CompletionParams,
	Connection,
	DeclarationParams,
	Diagnostic,
	Hover,
	HoverParams,
	Logger,
	TextDocumentChangeEvent,
	TextDocuments
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

import { DeclarationsProvider } from "../provider/declarationsProvider";
import { HoverProvider } from "../provider/hoverProvider";
import { CompletionsProvider } from "../provider/completionsProvider";
import { SpdxSt } from "../parser/spdxSt";
import { Lexer } from '../parser/lexer';
import { Parser } from '../parser/parser';
import { SpdxAnalyzer } from "../parser/spdxAnalyzer";


export type HandlersOptions = {
	hasDiagnosticRelatedInformationCapability: boolean
};

export class EventsHandler {
	st: SpdxSt;
	lexer: Lexer;
	parser: Parser;
	constructor(
    	private readonly connection: Connection,
    	private readonly documents: TextDocuments<TextDocument>,
    	private readonly declarationsProvider: DeclarationsProvider,
    	private readonly hoverProvider: HoverProvider,
    	private readonly CompletionsProvider: CompletionsProvider,
    	//private readonly commaneExecuter: CommandExecuter,
    	private readonly analyzer: SpdxAnalyzer,
    	private readonly logger: Logger,
		){
    	this.documents.onDidChangeContent((event) => this.onDidChangeContent(event));
    	this.documents.onDidClose((event) => this.onDidClose(event));
    	this.documents.onDidOpen((event) => this.onDidOpen(event));
    	this.documents.onDidSave((event) => this.onDidSave(event));
    	this.connection.onCompletion((params) => this.onCompletion(params));
		this.connection.onDeclaration((params) => this.onDeclaration(params));
    	//this.connection.onExecuteCommand((params) => this.onExecuteCommand(params));
    	this.connection.onHover((params) => this.onHover(params));
		this.lexer = new Lexer();
		this.parser = new Parser();
	}

	async onDidChangeContent(event: TextDocumentChangeEvent<TextDocument>): Promise<void> {
		this.logger.log("analyzed requested");
		let diagnostics: Diagnostic[] = [];
		try {
			await this.analyze(event.document, diagnostics);
	  	}catch (error) {
			console.log(error);
			if(error instanceof SyntaxError){
				await this.connection.sendDiagnostics({
					uri: event.document.uri,
					version: null,
					diagnostics,
		  		});
			}else{
				this.connection.window.showErrorMessage(error.message);
			}
	    }
	}

	async onDidClose(event: TextDocumentChangeEvent<TextDocument>): Promise<void> {
    	this.connection.sendDiagnostics({
      		uri: event.document.uri,
      		diagnostics: [],
    	});
  	}

	async onDidOpen(event: TextDocumentChangeEvent<TextDocument>,): Promise<void> {}

	async onDidSave(event: TextDocumentChangeEvent<TextDocument>,): Promise<void> {
		this.logger.log("analyzed requested");
		let diagnostics: Diagnostic[] = [];
    	await this.analyze(event.document, diagnostics);
  	}

  	async onCompletion(params: CompletionParams): Promise<CompletionItem[] | undefined> {
		this.logger.log("completion requested");
    	const document = this.documents.get(params.textDocument.uri);
    	if (document === undefined) {
      		return undefined;
		}
		const list = await this.CompletionsProvider.getCompletion(this.analyzer.getIds(), document, params.position, this.logger);
		return list;
  	}

  	async onDeclaration(params: DeclarationParams){
		this.logger.log("declaration requested");
    	const document = this.documents.get(params.textDocument.uri);
		if (document === undefined) {
			return undefined;
	  	}
		try {
			return await this.declarationsProvider.getDeclaration(this.documents.get(params.textDocument.uri), params.position, this.analyzer ,this.logger);
		}catch (error) {
			this.logger.error(error);
		}
  	}

  	// async onExecuteCommand(params: ExecuteCommandParams): Promise<void> {
	// 	console.log("command requested");
   	// 	try {
    //   		await this.commanedExecuter.execute(params);
    // 	}catch (error) {
	// 		console.log(error);
    // 	}
  	// }

  	async onHover(params: HoverParams): Promise<Hover | undefined> {
		this.logger.log("hover requested");
		try {
		   return await this.hoverProvider.getHover(this.documents.get(params.textDocument.uri), params.position, this.analyzer ,this.logger);
		}catch (error) {
			this.logger.error(error);
		}
  	}

  	async analyze(document: TextDocument, diagnostics: Diagnostic[]): Promise<void> {
    	this.analyzer.analyze(document, diagnostics);
		this.connection.sendDiagnostics(
			{
				uri: document.uri,
				diagnostics,
			}
		);
  	}
}
