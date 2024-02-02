import { $ } from "bun";

const text = await $`cd stream-saver && python3 -m http.server 3000`.text();

console.log(text);
