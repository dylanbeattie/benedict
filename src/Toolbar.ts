import { Prompter } from './Prompter';

export class Toolbar {
	status: any;
	prompter: Prompter;
	constructor(container: HTMLElement) {
		this.status = container.querySelector("label#status");
		container.querySelector("#bigger-text-button")!.addEventListener("click", () => {
			this.prompter.updateTextSize.bind(this.prompter)(1);
		});
		container.querySelector("#smaller-text-button")!.addEventListener("click", () => {
			this.prompter.updateTextSize.bind(this.prompter)(-1);
		});
		container.querySelector("#reset-button")!.addEventListener("click", () => {
			this.prompter.reset.bind(this.prompter)();
		});
		container.querySelector("#start-button")!.addEventListener("click", () => {
			this.prompter.start.bind(this.prompter)();
		});
		container.querySelector("#h-flip-button")!.addEventListener("click", () => {
			this.prompter.flip.bind(this.prompter)("hflip");
		});
		container.querySelector("#v-flip-button")!.addEventListener("click", () => {
			this.prompter.flip.bind(this.prompter)("vflip");
		});
		container.querySelector("#wider-button")!.addEventListener("click", () => {
			this.prompter.pad.bind(this.prompter)(-1);
		});
		container.querySelector("#narrower-button")!.addEventListener("click", () => {
			this.prompter.pad.bind(this.prompter)(+1);
		});
	}
	updateStatus(status: string): void {
		this.status.innerHTML = status;
	}
}
