/**
 * This contain all the functions related
 * to the Operational transformation algorithm
 */
import * as ot from 'ot';

const typesOperations = {
	'+input': 'insert',
	'+delete': 'delete'
};

export class Operation {
	type: String;
	text: String;
	position: number;
	doc: string;

	constructor(cmOperation: any, doc: string) {
		this.type = typesOperations[cmOperation.origin];
		this.text =

				this.type === 'insert' ? this.isJumpLine(cmOperation.text) :
				this.isJumpLine(cmOperation.removed);
		// This is for inserting a character
		this.position = this.countCharsBeforeChange(doc, cmOperation.from.line) + cmOperation.from.ch;
		this.doc = doc;
	}

	// This method is going to apply the operation to the
	// editor that is shown to the user.
	static applyOperation(operation, cm) {
		// const op = ot.TextOperation.fromJSON(operation);
		// console.log(op);
		let cursor = 0;
		cm.operation(() => {
			operation.ops.forEach((op) => {
				if (ot.TextOperation.isRetain(op)) {
					cursor += op;
				} else if (ot.TextOperation.isInsert(op)) {
					cm.replaceRange(op, cm.posFromIndex(cursor));
					cursor += op.length;
				} else if (ot.TextOperation.isDelete(op)) {
					let from = cm.posFromIndex(cursor);
					let to = cm.posFromIndex(cursor - op);
					cm.replaceRange('', from, to);
				}
			});
		});
		// console.log(operation, cm);
	}

	createOperation() {
		let op: any;
		const operation = this;
		const doc = this.doc;
		// console.log(operation, doc);
		if (operation.type == 'insert')
			op = new ot.TextOperation()
				.retain(operation.position)
				.insert(operation.text)
				.retain(doc.length - operation.text.length - operation.position);
		else
			op = new ot.TextOperation()
				.retain(operation.position)
				.delete(operation.text)
				.retain(doc.length + operation.text.length - operation.position - operation.text.length);
		return op;
	}

	static fromJSON(json) {
		return ot.TextOperation.fromJSON(json);
	}

	private countCharsBeforeChange(doc: string, lines: number): Number {
		const splittedDoc = doc.split('\n').slice(0, lines);
		const count = splittedDoc.reduce((acc, currentLine) => acc + currentLine.length, 0) + lines;
		return count;
	}

	private isJumpLine(modification: any) {
		let str = '';
		// if (modification[0] === '    ') {
		// 	console.log('Hi i am entering here');
		// 	str = str + '    ';
		// }
		// if (modification.length == 1 && )
		for (let i = 0; i < modification.length - 1; i++) {
			str = str + modification[i] + '\n';
		}
		str = str + modification[modification.length - 1];
		return str;
	}
}
