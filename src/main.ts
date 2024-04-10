import Matcher from './matcher';

class Toolbar {
    status: any;
    constructor(container: HTMLElement) {
        this.status = container.querySelector("label#status");
    }
    updateStatus(status: string) : void {
        this.status.innerHTML = status;
    }
}
class Prompter {
    editor: HTMLTextAreaElement;
    player: HTMLDivElement;
    matcher: Matcher;
    position: number = 0;
    guessSize: number = 0;
    toolbar: Toolbar;

    constructor(toolbar: Toolbar, container: HTMLElement) {
        this.player = container.querySelector("div#playback")!;
        this.editor = container.querySelector("textarea")!;
        this.matcher = new Matcher(this.editor.value);
        this.editor.addEventListener("change", this.updateScript.bind(this));
        this.toolbar = toolbar;
    }

    init() {
        this.updateScript();
        this.updateSpeech();
    }

    updateScript(): void {
        this.position = 0;
        this.guessSize = 0;
        this.matcher.updateScript(this.editor.value);
    }

    updateSpeech(speech: string = ''): void {
        var script = this.matcher.originalText;
        var index = this.matcher.match(speech, 10);
        this.toolbar.updateStatus(speech.slice(-20));
        if (index >= this.position) {
            this.position = index;
            this.guessSize = 0;
        } else {
            this.guessSize += 1;
        }
        var matched = script.substring(0, this.position);
        var guessed = script.substring(this.position, this.position + this.guessSize)
        var remainder = script.substring(this.position + this.guessSize);
        let html = `<span class="matched">${matched}</span><span class="guessed">${guessed}</span>${remainder}`;
        this.player.innerHTML = html.replace(/\n/g, '<br />\n');
    }
}
var toolbar = new Toolbar(document.querySelector("#toolbar")!);
var prompter = new Prompter(toolbar, document.querySelector("#prompter")!);
prompter.init();

var test = "i have detective he zed disturbances in the wash the wash said arthur the space tie wash said ford arthur nodded and zen cleared his throat are we talking a bout he asked cautiously some sort of vogue on laundromat or what are we talking about eddies said ford in the space time continuum ah nodded arthur is he is he he pushed his hands into the pocket of his dressing gown and looked knowledgeably into the distance what said ford er who said arthur is eddy then exactly ford looked angrily at him will you listen he snapped i have been listening said arthur but i'm not sure it's helped";
var i = 0;
var ticker = window.setInterval(() => {
    if (i > test.length) window.clearInterval(ticker);
    prompter.updateSpeech(test.substring(0, i += (Math.random() * 3)));
}, 50 + Math.random() * 100);
