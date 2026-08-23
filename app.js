(() => {
  const ASSETS = {
    splash: "splash.jpg",
    home: "home.jpg",
    drawer: "drawer.jpg",
    quiz: "quiz.jpg",
    result: "result.jpg",
    english: "english.jpg",
    india: "india.jpg",
    world: "world.jpg",
    hr: "hr.jpg",
    progress: "progress.jpg",
    achievements: "achievements.jpg"
  };

  const app = document.getElementById("app");
  if (!app) return;

  let state = {};
  try {
    state = JSON.parse(localStorage.getItem("mindfuel") || "{}");
  } catch (e) {
    state = {};
  }

  state.xp = Number(state.xp || 0);
  state.history = Array.isArray(state.history) ? state.history : [];
  state.bookmarks = Array.isArray(state.bookmarks) ? state.bookmarks : [];
  state.profile = state.profile || { name: "Neha" };

  function save() {
    localStorage.setItem("mindfuel", JSON.stringify(state));
  }

  function show(asset, title, cls = "") {
    app.innerHTML = `
      <main class="mf-page ${cls}">
        <img class="mf-screen-image"
             src="${ASSETS[asset]}"
             alt="${title}">
      </main>
    `;
    return app.querySelector(".mf-page");
  }

  function toast(message) {
    const old = document.querySelector(".mf-toast");
    if (old) old.remove();

    const t = document.createElement("div");
    t.className = "mf-toast";
    t.textContent = message;
    document.body.appendChild(t);

    setTimeout(() => t.remove(), 1600);
  }

  function navigate(page) {
    const pages = {
      home,
      quiz,
      english,
      hr,
      india,
      world,
      progress,
      achievements,
      bookmarks,
      settings,
      about,
      drawer
    };

    if (pages[page]) pages[page]();
    else home();
  }

  function addButton(parent, cls, label, action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-label", label);
    b.onclick = action;
    parent.appendChild(b);
    return b;
  }

  function bottomNav(parent, active) {
    const nav = document.createElement("nav");
    nav.className = "mf-bottom-nav";

    [
      ["Home", "home"],
      ["Quiz", "quiz"],
      ["Words", "english"],
      ["Menu", "drawer"]
    ].forEach(([label, target]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;

      if (target === active) {
        b.className = "active";
      }

      b.onclick = () => navigate(target);
      nav.appendChild(b);
    });

    parent.appendChild(nav);
  }

  function splash() {
    const page = show(
      "splash",
      "MindFuel welcome",
      "mf-splash"
    );

    addButton(
      page,
      "mf-hotspot mf-begin",
      "Let's Begin",
      home
    );
  }

  function home() {
    const page = show(
      "home",
      "MindFuel Home",
      "mf-home"
    );

    addButton(
      page,
      "mf-hotspot mf-menu",
      "Open menu",
      drawer
    );

    addButton(
      page,
      "mf-hotspot mf-profile",
      "Profile",
      () => toast(state.profile.name || "Neha")
    );

    addButton(
      page,
      "mf-hotspot mf-quiz-hotspot",
      "Brain Challenge",
      quiz
    );

    addButton(
      page,
      "mf-hotspot mf-hr-hotspot",
      "HR Radar",
      hr
    );

    addButton(
      page,
      "mf-hotspot mf-word-hotspot",
      "English Lab",
      english
    );

    addButton(
      page,
      "mf-hotspot mf-india-hotspot",
      "India Now",
      india
    );

    addButton(
      page,
      "mf-hotspot mf-world-hotspot",
      "World Now",
      world
    );

    addButton(
      page,
      "mf-hotspot mf-progress-hotspot",
      "My Progress",
      progress
    );

    bottomNav(page, "home");
  }

  function drawer() {
    const page = show(
      "drawer",
      "MindFuel Menu",
      "mf-drawer"
    );

    const menu = document.createElement("div");
    menu.className = "mf-drawer-actions";

    [
      ["Home", home],
      ["Brain Challenge", quiz],
      ["HR Radar", hr],
      ["English Lab", english],
      ["India Now", india],
      ["World Now", world],
      ["My Progress", progress],
      ["Achievements", achievements],
      ["Bookmarks", bookmarks],
      ["Settings", settings],
      ["About MindFuel", about]
    ].forEach(([label, action]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick = action;
      menu.appendChild(b);
    });

    page.appendChild(menu);
  }

  const questions = [
    {
      question:
        "Which skill is most useful for solving a new problem?",
      options: [
        "Critical thinking",
        "Guessing",
        "Ignoring details",
        "Avoiding questions"
      ],
      answer: 0
    },
    {
      question: "What does HRBP stand for?",
      options: [
        "Human Resources Business Partner",
        "Human Retail Business Plan",
        "Hiring Role Business Process",
        "Human Relations Benefit Policy"
      ],
      answer: 0
    },
    {
      question:
        "Which habit best improves vocabulary?",
      options: [
        "Learning and using new words",
        "Never reading",
        "Repeating one word",
        "Skipping examples"
      ],
      answer: 0
    },
    {
      question:
        "Which approach helps you learn consistently?",
      options: [
        "Small daily practice",
        "Studying once a month",
        "Avoiding revision",
        "Waiting for motivation"
      ],
      answer: 0
    }
  ];

  function quiz() {
    const page = show(
      "quiz",
      "Brain Challenge",
      "mf-quiz"
    );

    const ui = document.createElement("div");
    ui.className = "mf-quiz-ui";

    ui.innerHTML = `
      <button class="mf-back" type="button">‹</button>

      <div class="mf-quiz-title">
        Brain Challenge
      </div>

      <div class="mf-xp">
        ⚡ ${state.xp} XP
      </div>

      <section class="mf-question-card">
        <span class="mf-pill">Daily Quiz</span>

        <h2 class="mf-question"></h2>

        <div class="mf-options"></div>

        <button
          class="mf-next"
          type="button">
          Next Question
        </button>
      </section>
    `;

    page.appendChild(ui);

    const questionText =
      ui.querySelector(".mf-question");

    const options =
      ui.querySelector(".mf-options");

    const next =
      ui.querySelector(".mf-next");

    let index =
      Math.floor(Math.random() * questions.length);

    let answered = false;

    function renderQuestion() {
      answered = false;

      const q = questions[index];

      questionText.textContent =
        q.question;

      options.innerHTML = "";

      q.options.forEach((text, i) => {
        const b =
          document.createElement("button");

        b.type = "button";
        b.className = "mf-option";
        b.textContent = text;

        b.onclick = () => {
          if (answered) return;

          answered = true;

          const correct =
            i === q.answer;

          b.classList.add(
            correct ? "correct" : "wrong"
          );

          state.history.push({
            question: q.question,
            correct,
            date: new Date().toISOString()
          });

          if (correct) {
            state.xp += 10;
            toast("+10 XP");
          } else {
            toast("Keep learning!");
          }

          save();

          ui.querySelector(".mf-xp")
            .textContent =
            `⚡ ${state.xp} XP`;
        };

        options.appendChild(b);
      });
    }

    ui.querySelector(".mf-back")
      .onclick = home;

    next.onclick = () => {
      index =
        (index + 1) %
        questions.length;

      renderQuestion();
    };

    renderQuestion();
  }

  function featurePage(
    asset,
    title,
    description,
    active
  ) {
    const page = show(
      asset,
      title,
      "mf-feature"
    );

    const card =
      document.createElement("section");

    card.className =
      "mf-feature-card";

    card.innerHTML = `
      <h1>${title}</h1>
      <p>${description}</p>
    `;

    const back =
      document.createElement("button");

    back.type = "button";
    back.className = "mf-primary";
    back.textContent = "Back to Home";
    back.onclick = home;

    card.appendChild(back);
    page.appendChild(card);

    bottomNav(page, active);
  }

  function hr() {
    featurePage(
      "hr",
      "HR Radar",
      "People, workplace and HR insights at a glance.",
      "hr"
    );
  }

  function english() {
    const page = show(
      "english",
      "English Lab",
      "mf-feature"
    );

    const card =
      document.createElement("section");

    card.className =
      "mf-feature-card";

    card.innerHTML = `
      <h1>Word of the Day</h1>

      <h2>Insightful</h2>

      <p>
        <strong>Meaning:</strong>
        showing a clear understanding
        of a situation or idea.
      </p>

      <p>
        <strong>Example:</strong>
        She gave an insightful answer
        during the discussion.
      </p>

      <p>
        <strong>Synonyms:</strong>
        perceptive · thoughtful · discerning
      </p>
    `;

    const bookmark =
      document.createElement("button");

    bookmark.type = "button";
    bookmark.className =
      "mf-primary";

    function updateBookmark() {
      bookmark.textContent =
        state.bookmarks.includes("Insightful")
          ? "★ Bookmarked"
          : "☆ Bookmark Word";
    }

    bookmark.onclick = () => {
      if (
        state.bookmarks.includes(
          "Insightful"
        )
      ) {
        state.bookmarks =
          state.bookmarks.filter(
            x => x !== "Insightful"
          );
      } else {
        state.bookmarks.push(
          "Insightful"
        );
      }

      save();
      updateBookmark();
    };

    updateBookmark();

    card.appendChild(bookmark);
    page.appendChild(card);

    bottomNav(page, "english");
  }

  function india() {
    featurePage(
      "india",
      "India Now",
      "Stay informed with important India updates.",
      "india"
    );
  }

  function world() {
    featurePage(
      "world",
      "World Now",
      "Explore global developments and why they matter.",
      "world"
    );
  }

  function progress() {
    featurePage(
      "progress",
      "My Progress",
      `${state.xp} XP earned • ${state.history.length} quiz attempts completed.`,
      "progress"
    );
  }

  function achievements() {
    featurePage(
      "achievements",
      "Achievements",
      state.xp >= 100
        ? "🏆 100 XP milestone unlocked!"
        : `Earn ${100 - state.xp} more XP to unlock your first milestone.`,
      ""
    );
  }

  function bookmarks() {
    featurePage(
      "home",
      "Bookmarks",
      state.bookmarks.length
        ? state.bookmarks.join(" • ")
        : "No bookmarks yet.",
      ""
    );
  }

  function settings() {
    featurePage(
      "home",
      "Settings",
      "Manage your MindFuel preferences.",
      ""
    );
  }

  function about() {
    featurePage(
      "home",
      "About MindFuel",
      "A little learning every day adds up to big dreams. Created with ❤️ by Neha Hemant Nevrekar.",
      ""
    );
  }

  /*
   * Compatibility CSS.
   * These rules keep the interface usable with
   * the existing repository stylesheet.
   */

  const style =
    document.createElement("style");

  style.textContent = `
    .mf-page {
      position: relative;
      min-height: 100vh;
      width: 100%;
      overflow: hidden;
      background: #f7f4ff;
    }

    .mf-screen-image {
      display: block;
      width: 100%;
      height: 100vh;
      object-fit: cover;
    }

    .mf-hotspot {
      position: absolute;
      border: 0;
      background: transparent;
      cursor: pointer;
      z-index: 10;
    }

    .mf-begin {
      left: 15%;
      right: 15%;
      bottom: 7%;
      height: 14%;
    }

    .mf-menu {
      left: 3%;
      top: 3%;
      width: 15%;
      height: 10%;
    }

    .mf-profile {
      right: 3%;
      top: 3%;
      width: 15%;
      height: 10%;
    }

    .mf-quiz-hotspot {
      left: 8%;
      right: 8%;
      top: 27%;
      height: 19%;
    }

    .mf-hr-hotspot,
    .mf-word-hotspot,
    .mf-india-hotspot,
    .mf-world-hotspot {
      width: 39%;
      height: 18%;
    }

    .mf-hr-hotspot {
      left: 8%;
      top: 49%;
    }

    .mf-word-hotspot {
      right: 8%;
      top: 49%;
    }

    .mf-india-hotspot {
      left: 8%;
      top: 69%;
    }

    .mf-world-hotspot {
      right: 8%;
      top: 69%;
    }

    .mf-progress-hotspot {
      left: 8%;
      right: 8%;
      bottom: 9%;
      height: 9%;
    }

    .mf-drawer-actions {
      position: absolute;
      left: 20%;
      right: 5%;
      top: 18%;
      display: flex;
      flex-direction: column;
      gap: 7px;
      z-index: 20;
    }

    .mf-drawer-actions button {
      border: 0;
      border-radius: 12px;
      padding: 10px 12px;
      text-align: left;
      color: #fff;
      background: rgba(255,255,255,.08);
      cursor: pointer;
    }

    .mf-bottom-nav {
      position: absolute;
      z-index: 30;
      left: 4%;
      right: 4%;
      bottom: 2%;
      display: flex;
      justify-content: space-around;
      padding: 10px;
      border-radius: 20px;
      background: rgba(255,255,255,.95);
      box-shadow: 0 8px 30px rgba(30,20,80,.18);
    }

    .mf-bottom-nav button {
      border: 0;
      background: none;
      color: #5b4c7d;
      padding: 5px 10px;
      cursor: pointer;
    }

    .mf-bottom-nav button.active {
      color: #6a39c5;
      font-weight: 700;
    }

    .mf-quiz-ui {
      position: absolute;
      inset: 0;
      z-index: 20;
      padding: 22px 18px;
      pointer-events: none;
    }

    .mf-quiz-ui > * {
      pointer-events: auto;
    }

    .mf-back {
      border: 0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 30px;
      cursor: pointer;
    }

    .mf-quiz-title {
      position: absolute;
      top: 28px;
      left: 80px;
      color: #fff;
      font-weight: 800;
    }

    .mf-xp {
      position: absolute;
      top: 25px;
      right: 22px;
      color: #fff;
      font-weight: 700;
    }

    .mf-question-card {
      position: absolute;
      left: 7%;
      right: 7%;
      bottom: 10%;
      padding: 22px;
      border-radius: 28px;
      background: rgba(255,255,255,.97);
      box-shadow: 0 15px 45px rgba(40,20,80,.22);
    }

    .mf-pill {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 20px;
      background: #eee5ff;
      color: #6331b7;
      font-size: 12px;
      font-weight: 700;
    }

    .mf-question-card h2 {
      color: #2e2244;
      margin: 14px 0;
    }

    .mf-options {
      display: grid;
      gap: 10px;
    }

    .mf-option {
      padding: 13px;
      border: 0;
      border-radius: 14px;
      background: #f5f1fb;
      color: #302440;
      text-align: left;
      cursor: pointer;
    }

    .mf-option.correct {
      background: #dff7e7 !important;
    }

    .mf-option.wrong {
      background: #ffe2e2 !important;
    }

    .mf-next,
    .mf-primary {
      margin-top: 14px;
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 15px;
      background: #6638c8;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }

    .mf-feature-card {
      position: absolute;
      left: 7%;
      right: 7%;
      top: 22%;
      padding: 24px;
      border-radius: 28px;
      background: rgba(255,255,255,.96);
      box-shadow: 0 15px 45px rgba(40,20,80,.18);
      color: #302440;
    }

    .mf-feature-card h1 {
      margin-top: 0;
    }

    .mf-feature-card p {
      line-height: 1.55;
    }

    .mf-toast {
      position: fixed;
      z-index: 1000;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%);
      background: #24183a;
      color: #fff;
      padding: 10px 16px;
      border-radius: 999px;
      font-weight: 700;
    }

    @media (min-width: 700px) {
      .mf-page {
        max-width: 430px;
        margin: 0 auto;
        box-shadow: 0 0 50px rgba(0,0,0,.12);
      }
    }
  `;

  document.head.appendChild(style);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .catch(() => {});
  }

  splash();
})();
