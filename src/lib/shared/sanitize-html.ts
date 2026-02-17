const BLOCKED_TAGS = ["script", "style", "iframe", "object", "embed", "link", "meta"];

export function sanitizeHtml(value: string): string {
	let output = value;

	for (const tag of BLOCKED_TAGS) {
		const pair = new RegExp(`<${tag}[\\s\\S]*?>[\\s\\S]*?<\\/${tag}>`, "gi");
		const selfClosing = new RegExp(`<${tag}[^>]*\\/?>`, "gi");
		output = output.replace(pair, "");
		output = output.replace(selfClosing, "");
	}

	output = output.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "");
	output = output.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
	output = output.replace(/(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, `$1="#"`);

	return output;
}
