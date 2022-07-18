import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerTextEditorCommand(
		'vscode-sort-selection-by-date.sort', 
		(editor, edit) => {
			vscode.window.showInformationMessage('Hello World from vscode-sort-by-date!');
			sortSelectionByDate(editor, edit);
		}
	);

	context.subscriptions.push(disposable);
}

function sortSelectionByDate(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	var selections = editor.selections.map(selection => getSelectionData(editor.document, selection));
	var texts = sortTexts(selections);
	for (var i = selections.length - 1; i >= 0; --i) {
		edit.replace(selections[i].line, texts[i]);
	}
}

function getSelectionData(this: void, document: vscode.TextDocument, selection: vscode.Selection): ISelectionData {
	let line = lineFromSelection(document, selection);
	let dateString = document.getText(selection);
	let date = new Date(dateString); // TODO: custom patterns & error handing

	return {
		selection: selection,
		date: date,
		line: line,
		lineText: document.getText(line),
	};
}

function sortTexts(this: void, selections: ISelectionData[]) {
	return selections
		.slice() // clone
		.sort((a, b) => compare(a.date, b.date))
		.map(selection => selection.lineText);
}

function compare(this: void, a: any, b: any) {
	return a < b ? -1 : a > b ? 1 : 0;
}

function lineFromSelection(this: void, document: vscode.TextDocument, selection: vscode.Selection) {
	var pos = selection.start;
	var lineStart = pos.with({ character: 0 });
	var lineEnd = document.lineAt(pos).range.end;
	return new vscode.Range(lineStart, lineEnd);
}

export function deactivate() {}


interface ISelectionData {
	selection: vscode.Selection,
	date: Date,
	line: vscode.Range,
	lineText: string,
}