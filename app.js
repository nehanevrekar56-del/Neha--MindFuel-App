(() => {
"use strict";

const app = document.getElementById("app");
const KEY = "mindfuel-working-v4";
let store = {};
try { store = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e) {}

const state = {
  xp: Number(store.xp || 0),
  history: Array.isArray(store.history) ? store.history : [],
  bookmarks: Array.isArray(store.bookmarks) ? store.bookmarks : [],
  profile: store.profile || {name:"Neha"}
};
const save = () => localStorage.setItem(KEY, JSON.stringify(state));

function toast(text){
  document.querySelectorAll(".toast").forEach(x=>x.remove());
  const el=document.createElement("div");
  el.className="toast"; el.textContent=text; document.body.appendChild(el);
  setTimeout(()=>el.remove(),1500);
}
function page(html, cls=""){
  app.innerHTML=`<main class="page ${cls}">${html}</main>`;
  return app.querySelector(".page");
}
function nav(active){
  const p=app.querySelector(".page");
  const n=document.createElement("nav"); n.className="nav";
  [["⌂","Home","home"],["🧠","Quiz","quiz"],["Aa","Words","words"],["☰","Menu","drawer"]].forEach(([icon,label,key])=>{
    const b=document.createElement("button");
    b.innerHTML=`${icon}<br>${label}`;
    if(active===key)b.className="active";
    b.onclick=()=>go(key);
    n.appendChild(b);
  });
  p.appendChild(n);
}
function go(key){
  const routes={home,quiz,words,hr,india,world,progress,achievements,history,bookmarks,settings,about,drawer};
  (routes[key]||home)();
}

function splash(){
  const p=page(`
    <div class="brand"><h1>MindFuel</h1><p>Your daily mental workout<br>for a smarter, sharper you.</p></div>
    <div class="credit">Created with ❤️ by Neha Hemant Nevrekar</div>
    <button class="begin" id="begin">LET'S BEGIN</button>`,`splash`);
  p.querySelector("#begin").onclick=home;
}

function home(){
  const p=page(`
    <div class="home-bg"></div>
    <header class="header">
      <button class="icon" id="menu">☰</button><div class="title">MindFuel</div><button class="icon" id="profile">●</button>
    </header>
    <div class="hello">Hello, ${state.profile.name || "Neha"} 👋</div>
    <div class="quote">A little learning every day adds up to big dreams.<span class="heart">♥</span></div>
    <div class="grid">
      <button class="card wide" data-go="quiz"><span class="emoji">🧠</span><strong>Brain Challenge</strong><small>Fresh questions every time you play</small></button>
      <button class="card" data-go="words"><span class="emoji">📚</span><strong>New Word</strong><small>Daily vocabulary with meaning & example</small></button>
      <button class="card" data-go="hr"><span class="emoji">💼</span><strong>HR Radar</strong><small>Workplace insights</small></button>
      <button class="card" data-go="india"><span class="emoji">🇮🇳</span><strong>India Now</strong><small>Important updates</small></button>
      <button class="card" data-go="world"><span class="emoji">🌍</span><strong>World Now</strong><small>Global learning</small></button>
      <button class="card" data-go="progress"><span class="emoji">📈</span><strong>My Progress</strong><small>${state.xp} XP earned</small></button>
    </div>
    <div class="footer">Created with ❤️ by Neha Hemant Nevrekar</div>`);
  p.querySelector("#menu").onclick=drawer;
  p.querySelector("#profile").onclick=()=>toast(state.profile.name || "Neha");
  p.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  nav("home");
}

const questions=[
["Which skill is most useful for solving a new problem?",["Critical thinking","Guessing","Ignoring details","Avoiding questions"],0],
["What does HRBP stand for?",["Human Resources Business Partner","Human Retail Business Plan","Hiring Role Business Process","Human Relations Benefit Policy"],0],
["Which habit best improves vocabulary?",["Learning and using new words","Never reading","Repeating one word","Skipping examples"],0],
["Which approach helps you learn consistently?",["Small daily practice","Studying once a month","Avoiding revision","Waiting for motivation"],0],
["Which behaviour supports good teamwork?",["Active listening","Ignoring others","Avoiding feedback","Keeping information to yourself"],0],
["What helps you remember a new concept?",["Connect it to an example","Read it once only","Avoid practice","Ignore context"],0],
["Which is a useful workplace skill?",["Clear communication","Avoiding feedback","Guessing expectations","Ignoring priorities"],0],
["What is a good way to build a habit?",["Start small and repeat","Do everything once","Wait for motivation","Change the goal daily"],0]
];
let lastQuestion=-1;
function randomQuestion(){
  let i=Math.floor(Math.random()*questions.length);
  if(questions.length>1 && i===lastQuestion)i=(i+1)%questions.length;
  lastQuestion=i; return questions[i];
}
function quiz(){
  const p=page(`<div class="panel"><button class="back" id="back">‹ Back</button><div class="panelbox"><h1>🧠 Brain Challenge</h1><p class="muted">Fresh questions • ⚡ ${state.xp} XP</p><div id="q"></div></div></div>`);
  p.querySelector("#back").onclick=home;
  let q=randomQuestion(), answered=false;
  function render(){
    answered=false;
    p.querySelector("#q").innerHTML=`<span class="muted">New Question</span><h2>${q[0]}</h2>${q[1].map((x,i)=>`<button class="option" data-i="${i}">${x}</button>`).join("")}<button class="primary" id="next">Next Question</button>`;
    p.querySelectorAll(".option").forEach(b=>b.onclick=()=>{
      if(answered)return;
      answered=true;
      const correct=Number(b.dataset.i)===q[2];
      b.classList.add(correct?"correct":"wrong");
      state.history.push({question:q[0],correct,date:new Date().toISOString()});
      if(correct){state.xp+=10;toast("+10 XP")}else toast("Keep learning!");
      save();
    });
    p.querySelector("#next").onclick=()=>{q=randomQuestion();render()};
  }
  render(); nav("quiz");
}

const wordsData=[
["Insightful","showing a clear understanding","She gave an insightful answer.","perceptive · thoughtful · discerning"],
["Resilient","able to recover quickly from difficulty","She remained resilient through the change.","strong · adaptable · enduring"],
["Curious","eager to know or learn something","A curious mind keeps growing.","inquisitive · interested · eager"],
["Articulate","able to express ideas clearly","He was articulate during the presentation.","eloquent · expressive · clear"],
["Adaptable","able to adjust to new conditions","An adaptable learner welcomes change.","flexible · versatile · adjustable"],
["Meticulous","very careful and precise","She was meticulous while checking the report.","careful · thorough · precise"],
["Empathy","the ability to understand another person's feelings","Empathy helps create stronger connections.","understanding · compassion · sensitivity"],
["Proactive","taking action before a problem happens","She took a proactive approach to the project.","initiative-taking · prepared · forward-looking"],
["Concise","giving information clearly in few words","Her email was concise and professional.","brief · succinct · precise"],
["Collaborative","working effectively with others","The team used a collaborative approach.","cooperative · collective · team-based"]
];
let wordIndex=Math.floor(Date.now()/86400000)%wordsData.length;

function words(){
  const p=page(`<div class="panel"><button class="back" id="back">‹ Back</button><div class="panelbox" id="wordbox"></div></div>`);
  p.querySelector("#back").onclick=home;
  function renderWord(){
    const w=wordsData[wordIndex];
    const saved=state.bookmarks.includes(w[0]);
    p.querySelector("#wordbox").innerHTML=`
      <h1>📚 English Lab</h1>
      <p class="muted"><b>WORD OF THE DAY</b></p>
      <h2>${w[0]}</h2>
      <p><b>Meaning:</b> ${w[1]}.</p>
      <p><b>Example:</b> ${w[2]}</p>
      <p><b>Synonyms:</b> ${w[3]}</p>
      <div class="word-nav"><button id="prev">‹ Previous</button><button id="nextword">Next Word ›</button></div>
      <button class="primary" id="bookmark">${saved?"★ Remove Bookmark":"☆ Bookmark Word"}</button>`;
    p.querySelector("#prev").onclick=()=>{wordIndex=(wordIndex-1+wordsData.length)%wordsData.length;renderWord()};
    p.querySelector("#nextword").onclick=()=>{wordIndex=(wordIndex+1)%wordsData.length;renderWord();toast("New word loaded")};
    p.querySelector("#bookmark").onclick=()=>{
      if(state.bookmarks.includes(w[0]))state.bookmarks=state.bookmarks.filter(x=>x!==w[0]);
      else state.bookmarks.push(w[0]);
      save();renderWord();
    };
  }
  renderWord();nav("words");
}

function simple(title,emoji,text){
  const p=page(`<div class="panel"><button class="back" id="back">‹ Back</button><div class="panelbox"><h1>${emoji} ${title}</h1><p class="muted">${text}</p></div></div>`);
  p.querySelector("#back").onclick=home;nav("");
}
function hr(){simple("HR Radar","💼","Explore workplace, people and HR learning topics.");}
function india(){simple("India Now","🇮🇳","Explore India-focused learning and current topics.");}
function world(){simple("World Now","🌍","Explore global learning and developments.");}
function progress(){simple("My Progress","📈",`${state.xp} XP earned • ${state.history.length} quiz attempts • ${state.history.filter(x=>x.correct).length} correct answers.`);}
function achievements(){simple("Achievements","🏆",state.xp>=100?"🏆 100 XP milestone unlocked!":"Keep learning to reach 100 XP.");}
function history(){
  const p=page(`<div class="panel"><button class="back" id="back">‹ Back</button><div class="panelbox"><h1>🕘 Quiz History</h1><div>${state.history.length?state.history.slice().reverse().map(x=>`<p>${x.correct?"✅":"❌"} ${x.question}<br><small class="muted">${new Date(x.date).toLocaleDateString()}</small></p>`).join(""):"<p class='muted'>No quiz history yet.</p>"}</div></div></div>`);
  p.querySelector("#back").onclick=home;nav("");
}
function bookmarks(){simple("Bookmarks","🔖",state.bookmarks.length?state.bookmarks.join(" • "):"No bookmarked words yet.");}
function settings(){simple("Settings","⚙️","Your MindFuel profile and preferences.");}
function about(){simple("About MindFuel","💜","A little learning every day adds up to big dreams. Created with ❤️ by Neha Hemant Nevrekar.");}

function drawer(){
  const items=[["Home",home],["Brain Challenge",quiz],["New Word",words],["HR Radar",hr],["India Now",india],["World Now",world],["My Progress",progress],["Achievements",achievements],["Quiz History",history],["Bookmarks",bookmarks],["Settings",settings],["About MindFuel",about]];
  app.innerHTML=`<aside class="drawer"><button class="back" id="close">✕ Close</button><h1>MindFuel</h1><p>Learn a little. Grow a lot.</p>${items.map((x,i)=>`<button class="item" data-i="${i}">${x[0]}</button>`).join("")}</aside>`;
  app.querySelector("#close").onclick=home;
  app.querySelectorAll(".item").forEach((b,i)=>b.onclick=items[i][1]);
}

splash();
})();