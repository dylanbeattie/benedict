import { Toolbar } from './Toolbar';
import Matcher from './matcher';
import { fontSizes } from './main';

export class Prompter {
	editor: HTMLTextAreaElement;
	player: HTMLDivElement;
	matcher: Matcher;
	position: number = 0;
	guessSize: number = 0;
	toolbar: Toolbar;
	marker: HTMLHRElement | null;
	container: HTMLElement;
	vflip: boolean = false;
	speech: any;

	constructor(container: HTMLElement, toolbar: Toolbar, speech: any) {
		this.container = container;
		this.player = container.querySelector("div#playback")!;
		this.editor = container.querySelector("textarea")!;
		this.marker = container.querySelector("hr")!;
		this.matcher = new Matcher(this.editor.value);
		this.editor.addEventListener("change", this.updateScript.bind(this));
		this.toolbar = toolbar;
		this.toolbar.prompter = this;
		this.speech = speech;
		speech.onspeechstart = this.onspeechstart.bind(this);
		speech.onnomatch = console.log;
		speech.onerror = (error: any) => {
			console.log(error);
			speech.abort();
			window.setTimeout(() => speech.start(), 100);
		}
		speech.onresult = this.onresult.bind(this);
		speech.start();
	}

	onspeechstart() {
		console.log('speech started!');
	}

	onresult(event: { results: SpeechRecognitionResultList } ) {
		const result = Array.from(event.results).map(r => r[0].transcript).join(' ');
		this.updateSpeech(result);
	}

	init() {
		this.updateScript();
		this.updateSpeech();
	}
	reset() {
		this.updateScript();
	}

	start() {
	}

	flip = (className: string) => {
		console.log(this.container.classList);
		this.vflip = this.container.classList.toggle(className);
	};


	pad(direction = 0) {
		const SCROLLBAR_WIDTH = 16;
		var padding = parseInt(window.getComputedStyle(this.player).paddingLeft)
			||
			parseInt(window.getComputedStyle(this.editor).paddingLeft);

		var elementWidth = (this.player.getBoundingClientRect().width
			||
			this.player.getBoundingClientRect().width);
		var upperLimit = (elementWidth / 2) - 200;
		var lowerLimit = 0;
		padding += (direction * 100);
		padding = Math.min(upperLimit, Math.max(lowerLimit, padding));
		this.editor.style.paddingLeft = padding + SCROLLBAR_WIDTH + "px";
		this.editor.style.paddingRight = padding + "px";
		this.player.style.paddingLeft = padding + "px";
		this.player.style.paddingRight = padding + "px";
		this.marker.style.left = padding + "px";
		this.marker.style.right = padding + "px";
	}

	updateScript(): void {
		this.position = 0;
		this.guessSize = 0;
		this.matcher.updateScript(this.editor.value);
	}


	updateTextSize(offset = 0) {
		var fontSize = window.getComputedStyle(this.player).fontSize;
		var index = fontSizes.indexOf(fontSize);
		if (index < 0) index = 3;
		index += offset;
		if (index < 0) index = 0;
		if (index >= fontSizes.length) index = fontSizes.length - 1;
		var size = fontSizes[index];
		this.player.style.fontSize = size;
		this.editor.style.fontSize = size;
		this.updateScroll();
	}

	updateSpeech(speech: string = ''): void {
		var script = this.matcher.originalText;
		var index = this.matcher.match(speech, 20);
		this.toolbar.updateStatus(speech.slice(-50));
		if (index >= this.position) {
			this.position = index;
			this.guessSize = 0;
		} else {
			this.guessSize += 1;
		}
		var matched = script.substring(0, this.position);
		var guessed = script.substring(this.position, this.position + this.guessSize);
		var remainder = script.substring(this.position + this.guessSize);
		let html = `<span class="matched">${matched}</span><span class="guessed">${guessed}</span>${remainder}`;
		this.player.innerHTML = (html + '\n\n\n\n\n\n\n\n\n\n').replace(/\n/g, '<br />\n');
	}

	get #scrollDistance() {
		let markerRect = this.marker!.getBoundingClientRect();
		let guessRect = this.player.querySelector("span.guessed")!.getBoundingClientRect();
		let distance = (this.vflip ? guessRect.bottom - guessRect.height - markerRect.bottom : guessRect.top + guessRect.height - markerRect.top);
		return (distance);
	}

	updateScroll() {
		if (Math.abs(this.#scrollDistance) > 3) {
			console.log("DIST: ", this.#scrollDistance);
			let log = Math.log(Math.abs(this.#scrollDistance));
			let scroll = Math.pow(log, 1.8);
			let sign = Math.sign(this.#scrollDistance);
			sign = (this.vflip ? -sign : sign);
			this.player.scrollTop += sign * scroll;
		}
	}
}
