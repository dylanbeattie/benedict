import { Prompter } from './prompter';

export class Toolbar {
	status: any;
	prompter: Prompter;
	constructor(container: HTMLElement) {
		this.status = container.querySelector("label#status");

		container.querySelector("#smaller-text-button")!.addEventListener("click", () => {
			this.prompter.updateTextSize.bind(this.prompter)(-1);
		});
		container.querySelector("#bigger-text-button")!.addEventListener("click", () => {
			this.prompter.updateTextSize.bind(this.prompter)(1);
		});
		container.querySelector("#start-button")!.addEventListener("click", (event: Event) : void => {
			this.startPause.bind(this)(event);
		});

		container.querySelector("#reset-button")!.addEventListener("click", () : void => {
			this.prompter.reset.bind(this.prompter)();
		});

		container.querySelector("#h-flip-button")!.addEventListener("click", () => {
			this.prompter.flip.bind(this.prompter)("hflip");
		});

		container.querySelector("#move-line-up-button")!.addEventListener("click", () => {
			this.prompter.moveLine.bind(this.prompter)(-1);
		});

		container.querySelector("#move-line-down-button")!.addEventListener("click", () => {
			this.prompter.moveLine.bind(this.prompter)(+1);
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

	startPause(event: Event) : void {
		let button = event.target as HTMLButtonElement;
		if (this.prompter.started) {
			button.classList.remove("fa-pause");
			button.classList.add("fa-play");
			this.prompter.edit();
		} else {
			button.classList.remove("fa-play");
			button.classList.add("fa-pause");
			this.prompter.play();
		}
	}

	updateStatus(status: string): void {
		this.status.innerHTML = status;
	}
}
