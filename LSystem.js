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
	constructor(axiom, rules) {
		if (!TurtleLSystem.validateInput(axiom, rules))
			throw new Exception("Turtle L-systems can only operate on the characters 'F', 'f', '+', and '-'.");
		super(axiom, rules);
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
}

TurtleLSystem.QuadraticKoch = new TurtleLSystem('F-F-F-F', {'F': 'F-F+F+FF-F-F+F'});

