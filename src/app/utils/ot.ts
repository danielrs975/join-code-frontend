/**
 * This contain all the functions related
 * to the Operational transformation algorithm
 * @author Daniel Rodriguez
 */

const typesOperations = {
	'+input': 'insert',
	'+delete': 'delete'
};

export class Operation {
	type: String;
	text: String;
	position: Number;

	constructor(cmOperation: any, doc: string) {
		this.type = typesOperations[cmOperation.origin];
		this.text =

				this.type === 'insert' ? this.isJumpLine(cmOperation.text) :
				this.isJumpLine(cmOperation.removed);
		// This is for inserting a character
		this.position = this.countCharsBeforeChange(doc, cmOperation.from.line) + cmOperation.from.ch;
	}

	private countCharsBeforeChange(doc: string, lines: number): Number {
		const splittedDoc = doc.split('\n').slice(0, lines);
		const count = splittedDoc.reduce((acc, currentLine) => acc + currentLine.length, 0) + lines;
		return count;
	}

	private isJumpLine(modification: any) {
		const itIs = modification.every((str) => str === '') && modification.length === 2;
		if (itIs) {
			return '\n';
		} else {
			return modification[0];
		}
	}
}
