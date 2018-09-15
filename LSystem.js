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

