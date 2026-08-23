(() => {
  "use strict";

  const app = document.getElementById("app");
  const KEY = "mindfuel-v5";
  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch (_) {}

  const state = {
    xp: Number(saved.xp || 0),
    history: Array.isArray(saved.history) ? saved.history : [],
    bookmarks: Array.isArray(saved.bookmarks) ? saved.bookmarks : [],
    wordIndex: Number.isInteger(saved.wordIndex) ? saved.wordIndex : 0,
    name: saved.name || "Neha"
  };

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  const screens = {
    splash: "splash.jpg",
    home: "home.jpg",
    drawer: "drawer.jpg",
    quiz: "quiz.jpg",
    world: "world.jpg",
    english: "english.jpg",
    hr: "hr.jpg",
    india: "india.jpg",
    progress: "progress.jpg",
    achievements: "achievements.jpg",
    result: "result.jpg"
  };

  function toast(text) {
    document.querySelectorAll(".mf-toast").forEach(e => e.remove());

    const t = document.createElement("div");
    t.className = "mf-toast";
    t.textContent = text;

    document.body.appendChild(t);

    requestAnimationFrame(() => t.classList.add("show"));

    setTimeout(() => t.remove(), 1500);
  }

  function clear() {
    app.innerHTML = "";
  }

  function imageScreen(file, label = "") {
    clear();

    const page = document.createElement("main");
    page.className = "screen";
    page.setAttribute("aria-label", label);

    const img = document.createElement("img");

    img.className = "screen-image";
    img.src = file;
    img.alt = label;
    img.draggable = false;

    img.onerror = () => {
      page.classList.add("asset-error");

      page.innerHTML = `
        <div class="fallback">
          <h1>MindFuel</h1>
          <p>Unable to load ${file}</p>
        </div>
      `;
    };

    page.appendChild(img);
    app.appendChild(page);

    return page;
  }

  function hit(page, className, label, x, y, w, h, action) {
    const b = document.createElement("button");

    b.className = `hit ${className || ""}`;
    b.setAttribute("aria-label", label);

    b.style.left = x + "%";
    b.style.top = y + "%";
    b.style.width = w + "%";
    b.style.height = h + "%";

    b.onclick = action;

    page.appendChild(b);

    return b;
  }

  function bottomNav(page) {
    hit(page, "", "Home", 0, 90.5, 25, 9, home);
    hit(page, "", "Play Quiz", 25, 90.5, 25, 9, quiz);
    hit(page, "", "English Lab", 50, 90.5, 25, 9, words);
    hit(page, "", "Menu", 75, 90.5, 25, 9, drawer);
  }

  function splash() {
    const p = imageScreen(
      screens.splash,
      "MindFuel welcome"
    );

    hit(
      p,
      "",
      "Let's Begin",
      11,
      78,
      78,
      12,
      home
    );
  }

  function home() {
    const p = imageScreen(
      screens.home,
      "MindFuel home"
    );

    hit(
      p,
      "",
      "Open menu",
      4,
      3.5,
      14,
      8,
      drawer
    );

    hit(
      p,
      "",
      "Profile",
      86,
      3,
      11,
      8,
      () => toast(state.name)
    );

    hit(
      p,
      "",
      "Start Brain Challenge",
      5,
      31,
      90,
      23,
      quiz
    );

    hit(
      p,
      "",
      "HR Radar",
      5,
      55,
      44,
      13,
      hr
    );

    hit(
      p,
      "",
      "English Lab",
      51,
      55,
      44,
      13,
      words
    );

    hit(
      p,
      "",
      "India Now",
      5,
      68,
      44,
      13,
      india
    );

    hit(
      p,
      "",
      "World Now",
      51,
      68,
      44,
      13,
      world
    );

    hit(
      p,
      "",
      "My Progress",
      5,
      81,
      44,
      9,
      progress
    );

    bottomNav(p);
  }

  const questions = [
    [
      "Which skill is most useful for solving a new problem?",
      [
        "Critical thinking",
        "Guessing",
        "Ignoring details",
        "Avoiding questions"
      ],
      0
    ],
    [
      "What does HRBP stand for?",
      [
        "Human Resources Business Partner",
        "Human Retail Business Plan",
        "Hiring Role Business Process",
        "Human Relations Benefit Policy"
      ],
      0
    ],
    [
      "Which habit best improves vocabulary?",
      [
        "Learning and using new words",
        "Never reading",
        "Repeating one word",
        "Skipping examples"
      ],
      0
    ],
    [
      "Which approach helps you learn consistently?",
      [
        "Small daily practice",
        "Studying once a month",
        "Avoiding revision",
        "Waiting for motivation"
      ],
      0
    ],
    [
      "Which behaviour supports good teamwork?",
      [
        "Active listening",
        "Ignoring others",
        "Avoiding feedback",
        "Keeping information to yourself"
      ],
      0
    ],
    [
      "What helps you remember a new concept?",
      [
        "Connect it to an example",
        "Read it once only",
        "Avoid practice",
        "Ignore context"
      ],
      0
    ],
    [
      "Which is a useful workplace skill?",
      [
        "Clear communication",
        "Avoiding feedback",
        "Guessing expectations",
        "Ignoring priorities"
      ],
      0
    ],
    [
      "What is a good way to build a habit?",
      [
        "Start small and repeat",
        "Do everything once",
        "Wait for motivation",
        "Change the goal daily"
      ],
      0
    ]
  ];

  let currentQuestion = 0;

  function quiz() {
    const p = imageScreen(
      screens.quiz,
      "Brain Challenge"
    );

    const card = document.createElement("section");

    card.className = "quiz-card";

    p.appendChild(card);

    renderQuiz(card);

    hit(
      p,
      "back-hit",
      "Back to home",
      0,
      2,
      15,
      8,
      home
    );

    bottomNav(p);
  }

  function renderQuiz(card) {
    const q =
      questions[
        currentQuestion % questions.length
      ];

    card.innerHTML = `
      <div class="quiz-meta">
        Question ${currentQuestion + 1}/${questions.length}
      </div>

      <h2>${q[0]}</h2>

      <div class="answers">
        ${q[1]
          .map(
            (a, i) => `
              <button
                class="answer"
                data-i="${i}"
              >
                <span>${String.fromCharCode(65 + i)}</span>
                ${a}
              </button>
            `
          )
          .join("")}
      </div>

      <button class="next-btn" id="next">
        Next →
      </button>
    `;

    let answered = false;

    card
      .querySelectorAll(".answer")
      .forEach(btn => {
        btn.onclick = () => {
          if (answered) return;

          answered = true;

          const correct =
            Number(btn.dataset.i) === q[2];

          btn.classList.add(
            correct ? "correct" : "wrong"
          );

          if (correct) {
            state.xp += 10;
            toast("+10 XP");
          } else {
            toast("Keep learning!");
          }

          state.history.push({
            question: q[0],
            correct,
            date: new Date().toISOString()
          });

          save();
        };
      });

    card.querySelector("#next").onclick = () => {
      currentQuestion =
        (currentQuestion + 1) %
        questions.length;

      renderQuiz(card);
    };
  }

  const words = [
    [
      "Insightful",
      "Having or showing deep understanding and clear perception.",
      "Her insightful analysis helped the team solve the problem quickly.",
      "Perceptive • Thoughtful • Illuminating"
    ],
    [
      "Resilient",
      "Able to recover quickly from difficulty.",
      "She remained resilient through the change.",
      "Strong • Adaptable • Enduring"
    ],
    [
      "Curious",
      "Eager to know or learn something.",
      "A curious mind keeps growing.",
      "Inquisitive • Interested • Eager"
    ],
    [
      "Articulate",
      "Able to express ideas clearly and effectively.",
      "He was articulate during the presentation.",
      "Eloquent • Expressive • Clear"
    ],
    [
      "Adaptable",
      "Able to adjust to new conditions.",
      "An adaptable learner welcomes change.",
      "Flexible • Versatile • Adjustable"
    ],
    [
      "Meticulous",
      "Very careful and precise.",
      "She was meticulous while checking the report.",
      "Careful • Thorough • Precise"
    ]
  ];

  function words() {
    const p = imageScreen(
      screens.english,
      "English Lab"
    );

    const card =
      document.createElement("section");

    card.className = "word-card";

    p.appendChild(card);

    renderWord(card);

    hit(
      p,
      "back-hit",
      "Back to home",
      0,
      2,
      15,
      8,
      home
    );

    bottomNav(p);
  }

  function renderWord(card) {
    const w =
      words[state.wordIndex % words.length];

    const bookmarked =
      state.bookmarks.includes(w[0]);

    card.innerHTML = `
      <div class="word-label">
        WORD OF THE DAY
      </div>

      <h1>${w[0]}</h1>

      <p>
        <b>Meaning</b><br>
        ${w[1]}
      </p>

      <p>
        <b>Example</b><br>
        ${w[2]}
      </p>

      <p>
        <b>Synonyms</b><br>
        ${w[3]}
      </p>

      <div class="word-actions">
        <button id="prev">
          ‹ Previous
        </button>

        <button id="nextword">
          Next Word ›
        </button>
      </div>

      <button class="bookmark" id="bookmark">
        ${
          bookmarked
            ? "★ Bookmarked"
            : "☆ Bookmark Word"
        }
      </button>
    `;

    card.querySelector("#prev").onclick =
      () => {
        state.wordIndex =
          (state.wordIndex - 1 + words.length) %
          words.length;

        save();
        renderWord(card);
      };

    card.querySelector("#nextword").onclick =
      () => {
        state.wordIndex =
          (state.wordIndex + 1) %
          words.length;

        save();
        renderWord(card);

        toast("New word loaded");
      };

    card.querySelector("#bookmark").onclick =
      () => {
        if (bookmarked) {
          state.bookmarks =
            state.bookmarks.filter(
              x => x !== w[0]
            );
        } else {
          state.bookmarks.push(w[0]);
        }

        save();
        renderWord(card);

        toast(
          bookmarked
            ? "Bookmark removed"
            : "Word bookmarked"
        );
      };
  }

  function contentScreen(
    file,
    title,
    fallbackText
  ) {
    const p = imageScreen(file, title);

    hit(
      p,
      "back-hit",
      "Back to home",
      0,
      2,
      15,
      8,
      home
    );

    bottomNav(p);

    const panel =
      document.createElement("section");

    panel.className = "content-card";

    panel.innerHTML = `
      <h1>${title}</h1>
      <p>${fallbackText}</p>
    `;

    p.appendChild(panel);

    return p;
  }

  function hr() {
    contentScreen(
      screens.hr,
      "HR Radar",
      "Hiring, AI, L&D and workplace trends — learn something useful every day."
    );
  }

  function india() {
    contentScreen(
      screens.india,
      "India Now",
      "India-focused headlines, facts and learning bites."
    );
  }

  function world() {
    contentScreen(
      screens.world,
      "World Now",
      "Global developments and why they matter."
    );
  }

  function progress() {
    contentScreen(
      screens.progress,
      "My Progress",
      `${state.xp} XP earned • ${
        state.history.length
      } quiz attempts • ${
        state.history.filter(
          x => x.correct
        ).length
      } correct answers.`
    );
  }

  function achievements() {
    contentScreen(
      screens.achievements,
      "Achievements",
      state.xp >= 100
        ? "🏆 100 XP milestone unlocked!"
        : "Keep learning to reach your first 100 XP milestone."
    );
  }

  function result() {
    contentScreen(
      screens.result,
      "Quiz Result",
      `You have ${state.xp} XP. Keep going!`
    );
  }

  function drawer() {
    const p = imageScreen(
      screens.drawer,
      "MindFuel menu"
    );

    hit(
      p,
      "",
      "Close menu",
      78,
      2,
      18,
      8,
      home
    );

    const items = [
      ["Home", home],
      ["Play Quiz", quiz],
      ["HR Radar", hr],
      ["English Lab", words],
      ["India Now", india],
      ["World Now", world],
      ["My Progress", progress],
      ["Achievements", achievements],
      [
        "Settings",
        () => toast("Settings coming next")
      ],
      [
        "About MindFuel",
        () =>
          toast(
            "MindFuel • Created by Neha"
          )
      ]
    ];

    items.forEach((item, i) => {
      hit(
        p,
        "",
        item[0],
        8,
        13 + i * 6.8,
        82,
        6,
        item[1]
      );
    });
  }

  window.MindFuel = {
    home,
    quiz,
    words,
    drawer,
    hr,
    india,
    world,
    progress,
    achievements,
    result
  };

  splash();

})();
