import { Prompter } from './Prompter';
import { Toolbar } from './Toolbar';

export const fontSizes = ["32px", "48px", "64px", "80px", "96px", "128px", "144px", "192px"];
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var speech = new SpeechRecognition();
speech.continuous = true;
speech.lang = 'en-US';
speech.interimResults = true;
speech.maxAlternatives = 1;

var toolbar = new Toolbar(document.querySelector("#toolbar")!);
var prompter = new Prompter(document.querySelector("#prompter")!, toolbar, speech);
prompter.init();

var test = "i have detective he zed disturbances in the wash the wash said arthur the space tie wash said ford arthur nodded and zen cleared his throat are we talking a bout he asked cautiously some sort of vogue on laundromat or what are we talking about eddies said ford in the space time continuum ah nodded arthur is he is he he pushed his hands into the pocket of his dressing gown and looked knowledgeably into the distance what said ford er who said arthur is eddy then exactly ford looked angrily at him will you listen he snapped i have been listening said arthur but i'm not sure it's helped";
var i = 0;
// var ticker = window.setInterval(() => {
// 	if (i > test.length) window.clearInterval(ticker);
// 	prompter.updateSpeech(test.substring(0, i += (Math.random() * 3)));
// }, 50 + Math.random() * 50);
window.setInterval(prompter.updateScroll.bind(prompter), 1000/50);