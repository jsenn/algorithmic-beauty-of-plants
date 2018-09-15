class LSystem {
	constructor(axiom, rules) {
		this.axiom = axiom;
		this.rules = rules;
	}

	* charsAtLevel(level) {
		let stack = []
		stack.push([this.axiom, 0]);
		while (stack.length > 0) {
			const [str, depth] = stack.pop();
			if (depth === level) {
				yield str;
				continue;
			}
			const children = this.rules[str];
			for (let i = children.length - 1; i >= 0; --i)
				stack.push([children[i], depth + 1]);
		}
	}
}

