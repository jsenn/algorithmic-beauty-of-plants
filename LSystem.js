class LSystem {
	constructor(axiom, rules) {
		this.axiom = axiom;
		this.rules = rules;
	}

	expand(character) {
		if (character in this.rules)
			return this.rules[character];
		return character;
	}

	* charsAtLevel(level) {
		let stack = []
		for (let c of this.axiom)
			stack.push([c, 0]);
		while (stack.length > 0) {
			const [str, depth] = stack.pop();
			if (depth === level) {
				yield str;
				continue;
			}
			const children = this.expand(str);
			for (let i = children.length - 1; i >= 0; --i)
				stack.push([children[i], depth + 1]);
		}
	}
}

class TurtleLSystem extends LSystem {
	constructor(axiom, rules, rotationAmt) {
		if (!TurtleLSystem.validateInput(axiom, rules))
			throw new Exception("Turtle L-systems can only operate on the characters 'F', 'f', '+', and '-'.");
		super(axiom, rules);
		this.rotationAmt = rotationAmt;
	}

	static validateInput(axiom, rules) {
		if (!TurtleLSystem.hasValidVocab(axiom))
			return false;
		for (let k of Object.keys(rules))
			if (!TurtleLSystem.hasValidVocab(k) || !TurtleLSystem.hasValidVocab(rules[k]))
				return false;

		return true;
	}

	static hasValidVocab(s) {
		const vocab = new Set(['F', 'f', '+', '-']);
		for (let c of s)
			if (!vocab.has(c))
				return false;

		return true;
	}

	draw(canvas, initialX, initialY, initialHeading, level, stepSize) {
		// TODO: automatically select initialX, intitialY, initialHeading and stepSize given level
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let currX = initialX;
		let currY = initialY;
		let currHeading = initialHeading;
		const advance = () => {
			currX += stepSize * Math.cos(currHeading);
			currY += stepSize * Math.sin(currHeading);
		};

		ctx.beginPath();
		ctx.moveTo(currX, currY);
		for (let instruction of this.charsAtLevel(level)) {
			if (instruction === 'F') {
				advance();
				ctx.lineTo(currX, currY);
			} else if (instruction === 'f') {
				advance();
				ctx.moveTo(currX, currY);
			} else if (instruction === '-') {
				currHeading -= this.rotationAmt;
			} else if (instruction === '+') {
				currHeading += this.rotationAmt;
			} else {
				throw new Exception('Unrecognized turtle command: ' + instruction);
			}
		}

		ctx.stroke();
	}
}

TurtleLSystem.QuadraticKoch = new TurtleLSystem('F-F-F-F', {'F': 'F-F+F+FF-F-F+F'}, Math.PI / 2);

