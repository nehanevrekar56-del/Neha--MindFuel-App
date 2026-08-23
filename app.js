(() => {
  "use strict";

  const app = document.getElementById("app");

  if (!app) {
    document.body.innerHTML =
      "<h2 style='padding:30px'>MindFuel: app container not found.</h2>";
    return;
  }

  const STORAGE_KEY = "mindfuel-final-v1";

  /* -------------------------
     SAVED USER STATE
  ------------------------- */

  let saved = {};

  try {
    saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );
  } catch (e) {
    saved = {};
  }

  const state = {
    xp: Number(saved.xp || 0),
    history: Array.isArray(saved.history)
      ? saved.history
      : [],
    bookmarks: Array.isArray(saved.bookmarks)
      ? saved.bookmarks
      : [],
    wordIndex: Number.isInteger(saved.wordIndex)
      ? saved.wordIndex
      : 0,
    name: saved.name || "Neha"
  };

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  }

  /* -------------------------
     IMAGE ASSETS
  ------------------------- */

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

  /* -------------------------
     HELPERS
  ------------------------- */

  function clearApp() {
    app.innerHTML = "";
  }

  function toast(message) {
    document
      .querySelectorAll(".mf-toast")
      .forEach(el => el.remove());

    const t = document.createElement("div");
    t.className = "mf-toast";
    t.textContent = message;

    document.body.appendChild(t);

    requestAnimationFrame(() => {
      t.classList.add("show");
    });

    setTimeout(() => {
      t.remove();
    }, 1600);
  }

  function imageScreen(file, title) {
    clearApp();

    const page = document.createElement("main");

    page.className = "screen";
    page.setAttribute("aria-label", title || "MindFuel");

    const image = document.createElement("img");

    image.className = "screen-image";
    image.src = file;
    image.alt = title || "MindFuel";
    image.draggable = false;

    image.onerror = () => {
      page.innerHTML = `
        <div style="
          width:100%;
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#f6f3ff;
          color:#24125f;
          text-align:center;
          padding:30px;
        ">
          <div>
            <h1>MindFuel</h1>
            <p>Unable to load ${file}</p>
          </div>
        </div>
      `;
    };

    page.appendChild(image);
    app.appendChild(page);

    return page;
  }

  function hit(
    page,
    label,
    x,
    y,
    width,
    height,
    action,
    className = ""
  ) {
    const button = document.createElement("button");

    button.className = `hit ${className}`;

    button.setAttribute(
      "aria-label",
      label
    );

    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.style.width = `${width}%`;
    button.style.height = `${height}%`;

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof action === "function") {
          action();
        }
      }
    );

    page.appendChild(button);

    return button;
  }

  /* -------------------------
     BOTTOM NAVIGATION
  ------------------------- */

  function bottomNav(page) {
    hit(
      page,
      "Home",
      0,
      89.5,
      25,
      10,
      home
    );

    hit(
      page,
      "Play Quiz",
      25,
      89.5,
      25,
      10,
      quiz
    );

    hit(
      page,
      "English Lab",
      50,
      89.5,
      25,
      10,
      englishLab
    );

    hit(
      page,
      "Menu",
      75,
      89.5,
      25,
      10,
      drawer
    );
  }

  /* -------------------------
     SPLASH
  ------------------------- */

  function splash() {
    const page = imageScreen(
      screens.splash,
      "MindFuel Welcome"
    );

    hit(
      page,
      "Let's Begin",
      8,
      76,
      84,
      14,
      home
    );
  }

  /* -------------------------
     HOME
  ------------------------- */

  function home() {
    const page = imageScreen(
      screens.home,
      "MindFuel Home"
    );

    /* Menu */
    hit(
      page,
      "Open Menu",
      2,
      2,
      16,
      9,
      drawer
    );

    /* Profile */
    hit(
      page,
      "Profile",
      84,
      2,
      14,
      9,
      () => {
        toast(state.name);
      }
    );

    /* Brain Challenge */
    hit(
      page,
      "Start Brain Challenge",
      4,
      30,
      92,
      25,
      quiz
    );

    /* HR Radar */
    hit(
      page,
      "HR Radar",
      4,
      54,
      46,
      14,
      hr
    );

    /* English Lab */
    hit(
      page,
      "English Lab",
      50,
      54,
      46,
      14,
      englishLab
    );

    /* India Now */
    hit(
      page,
      "India Now",
      4,
      67,
      46,
      14,
      india
    );

    /* World Now */
    hit(
      page,
      "World Now",
      50,
      67,
      46,
      14,
      world
    );

    /* Inspiration / progress area */
    hit(
      page,
      "My Progress",
      4,
      80,
      92,
      9,
      progress
    );

    bottomNav(page);
  }

  /* -------------------------
     QUIZ DATA
  ------------------------- */

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
      correct: 0
    },

    {
      question:
        "What does HRBP stand for?",
      options: [
        "Human Resources Business Partner",
        "Human Retail Business Plan",
        "Hiring Role Business Process",
        "Human Relations Benefit Policy"
      ],
      correct: 0
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
      correct: 0
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
      correct: 0
    },

    {
      question:
        "Which behaviour supports good teamwork?",
      options: [
        "Active listening",
        "Ignoring others",
        "Avoiding feedback",
        "Keeping information to yourself"
      ],
      correct: 0
    },

    {
      question:
        "What helps you remember a new concept?",
      options: [
        "Connect it to an example",
        "Read it once only",
        "Avoid practice",
        "Ignore context"
      ],
      correct: 0
    },

    {
      question:
        "Which is a useful workplace skill?",
      options: [
        "Clear communication",
        "Avoiding feedback",
        "Guessing expectations",
        "Ignoring priorities"
      ],
      correct: 0
    },

    {
      question:
        "What is a good way to build a habit?",
      options: [
        "Start small and repeat",
        "Do everything once",
        "Wait for motivation",
        "Change the goal daily"
      ],
      correct: 0
    },

    {
      question:
        "Which action improves learning?",
      options: [
        "Practice regularly",
        "Avoid questions",
        "Never revise",
        "Ignore mistakes"
      ],
      correct: 0
    },

    {
      question:
        "What is a strong learning mindset?",
      options: [
        "Stay curious",
        "Avoid challenges",
        "Never ask why",
        "Give up quickly"
      ],
      correct: 0
    }
  ];

  let currentQuestion = 0;

  /* -------------------------
     QUIZ
  ------------------------- */

  function quiz() {
    const page = imageScreen(
      screens.quiz,
      "Play Quiz"
    );

    const card =
      document.createElement("section");

    card.className = "quiz-card";

    page.appendChild(card);

    renderQuiz(card);

    hit(
      page,
      "Back",
      0,
      2,
      15,
      8,
      home,
      "back-hit"
    );

    bottomNav(page);
  }

  function renderQuiz(card) {
    const q =
      questions[
        currentQuestion %
          questions.length
      ];

    card.innerHTML = `
      <div class="quiz-meta">
        Question ${currentQuestion + 1}/${questions.length}
      </div>

      <h2>${q.question}</h2>

      <div class="answers">
        ${q.options
          .map(
            (option, index) => `
              <button
                class="answer"
                data-index="${index}"
              >
                <span>
                  ${String.fromCharCode(
                    65 + index
                  )}
                </span>
                ${option}
              </button>
            `
          )
          .join("")}
      </div>

      <button
        class="next-btn"
        id="nextQuestion"
      >
        Next →
      </button>
    `;

    let answered = false;

    card
      .querySelectorAll(".answer")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            if (answered) return;

            answered = true;

            const selected =
              Number(
                button.dataset.index
              );

            const correct =
              selected === q.correct;

            button.classList.add(
              correct
                ? "correct"
                : "wrong"
            );

            if (correct) {
              state.xp += 10;
              toast("+10 XP 🎉");
            } else {
              toast(
                "Keep learning! 💜"
              );

              const correctButton =
                card.querySelector(
                  `[data-index="${q.correct}"]`
                );

              if (correctButton) {
                correctButton.classList.add(
                  "correct"
                );
              }
            }

            state.history.push({
              question: q.question,
              correct,
              date:
                new Date().toISOString()
            });

            save();
          }
        );
      });

    card
      .querySelector("#nextQuestion")
      .addEventListener(
        "click",
        () => {
          currentQuestion =
            (currentQuestion + 1) %
            questions.length;

          renderQuiz(card);
        }
      );
  }

  /* -------------------------
     ENGLISH LAB DATA
     IMPORTANT:
     Named wordList — NOT words
  ------------------------- */

  const wordList = [
    {
      word: "Insightful",
      meaning:
        "Having or showing deep understanding and clear perception.",
      example:
        "Her insightful analysis helped the team solve the problem quickly.",
      synonyms:
        "Perceptive • Thoughtful • Illuminating"
    },

    {
      word: "Resilient",
      meaning:
        "Able to recover quickly from difficulty.",
      example:
        "She remained resilient through the change.",
      synonyms:
        "Strong • Adaptable • Enduring"
    },

    {
      word: "Curious",
      meaning:
        "Eager to know or learn something.",
      example:
        "A curious mind keeps growing.",
      synonyms:
        "Inquisitive • Interested • Eager"
    },

    {
      word: "Articulate",
      meaning:
        "Able to express ideas clearly and effectively.",
      example:
        "He was articulate during the presentation.",
      synonyms:
        "Eloquent • Expressive • Clear"
    },

    {
      word: "Adaptable",
      meaning:
        "Able to adjust to new conditions.",
      example:
        "An adaptable learner welcomes change.",
      synonyms:
        "Flexible • Versatile • Adjustable"
    },

    {
      word: "Meticulous",
      meaning:
        "Very careful and precise.",
      example:
        "She was meticulous while checking the report.",
      synonyms:
        "Careful • Thorough • Precise"
    },

    {
      word: "Empathy",
      meaning:
        "The ability to understand and share another person's feelings.",
      example:
        "Empathy helps create stronger workplace relationships.",
      synonyms:
        "Understanding • Compassion • Sensitivity"
    },

    {
      word: "Proactive",
      meaning:
        "Taking action before a problem or situation requires it.",
      example:
        "She took a proactive approach to solving the issue.",
      synonyms:
        "Initiative • Prepared • Forward-thinking"
    }
  ];

  /* -------------------------
     ENGLISH LAB
  ------------------------- */

  function englishLab() {
    const page = imageScreen(
      screens.english,
      "English Lab"
    );

    const card =
      document.createElement("section");

    card.className = "word-card";

    page.appendChild(card);

    renderWord(card);

    hit(
      page,
      "Back",
      0,
      2,
      15,
      8,
      home,
      "back-hit"
    );

    bottomNav(page);
  }

  function renderWord(card) {
    const word =
      wordList[
        state.wordIndex %
          wordList.length
      ];

    const isBookmarked =
      state.bookmarks.includes(
        word.word
      );

    card.innerHTML = `
      <div class="word-label">
        WORD OF THE DAY
      </div>

      <h1>${word.word}</h1>

      <p>
        <b>Meaning</b><br>
        ${word.meaning}
      </p>

      <p>
        <b>Example</b><br>
        ${word.example}
      </p>

      <p>
        <b>Synonyms</b><br>
        ${word.synonyms}
      </p>

      <div class="word-actions">

        <button id="previousWord">
          ‹ Previous
        </button>

        <button id="nextWord">
          New Word →
        </button>

      </div>

      <button
        class="bookmark"
        id="bookmarkWord"
      >
        ${
          isBookmarked
            ? "★ Bookmarked"
            : "☆ Bookmark Word"
        }
      </button>
    `;

    /* PREVIOUS WORD */

    card
      .querySelector("#previousWord")
      .addEventListener(
        "click",
        () => {
          state.wordIndex =
            (state.wordIndex -
              1 +
              wordList.length) %
            wordList.length;

          save();

          renderWord(card);

          toast(
            "Previous word"
          );
        }
      );

    /* NEW WORD */

    card
      .querySelector("#nextWord")
      .addEventListener(
        "click",
        () => {
          state.wordIndex =
            (state.wordIndex + 1) %
            wordList.length;

          save();

          renderWord(card);

          toast(
            "New word loaded ✨"
          );
        }
      );

    /* BOOKMARK */

    card
      .querySelector("#bookmarkWord")
      .addEventListener(
        "click",
        () => {
          if (isBookmarked) {
            state.bookmarks =
              state.bookmarks.filter(
                item =>
                  item !== word.word
              );

            toast(
              "Bookmark removed"
            );
          } else {
            state.bookmarks.push(
              word.word
            );

            toast(
              "Word bookmarked 🔖"
            );
          }

          save();

          renderWord(card);
        }
      );
  }

  /* -------------------------
     CONTENT PAGES
  ------------------------- */

  function contentScreen(
    file,
    title,
    text
  ) {
    const page =
      imageScreen(file, title);

    const card =
      document.createElement("section");

    card.className =
      "content-card";

    card.innerHTML = `
      <h1>${title}</h1>
      <p>${text}</p>
    `;

    page.appendChild(card);

    hit(
      page,
      "Back",
      0,
      2,
      15,
      8,
      home,
      "back-hit"
    );

    bottomNav(page);

    return page;
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
    const correct =
      state.history.filter(
        item => item.correct
      ).length;

    contentScreen(
      screens.progress,
      "My Progress",
      `${state.xp} XP earned • ${state.history.length} quiz attempts • ${correct} correct answers.`
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

  /* -------------------------
     DRAWER
  ------------------------- */

  function drawer() {
    const page =
      imageScreen(
        screens.drawer,
        "MindFuel Menu"
      );

    /* Close X */

    hit(
      page,
      "Close Menu",
      76,
      2,
      20,
      9,
      home
    );

    const menuItems = [
      ["Home", home],
      ["Play Quiz", quiz],
      ["HR Radar", hr],
      ["English Lab", englishLab],
      ["India Now", india],
      ["World Now", world],
      ["My Progress", progress],
      [
        "Bookmarks",
        () => {
          if (
            state.bookmarks.length === 0
          ) {
            toast(
              "No bookmarks yet"
            );
          } else {
            toast(
              `${state.bookmarks.length} bookmarked word(s)`
            );
          }
        }
      ],
      [
        "Achievements",
        achievements
      ],
      [
        "Settings",
        () =>
          toast(
            "Settings coming soon"
          )
      ],
      [
        "About MindFuel",
        () =>
          toast(
            "MindFuel • Created by Neha ❤️"
          )
      ]
    ];

    menuItems.forEach(
      (item, index) => {
        hit(
          page,
          item[0],
          6,
          12 + index * 6.4,
          88,
          6,
          item[1]
        );
      }
    );
  }

  /* -------------------------
     GLOBAL API
  ------------------------- */

  window.MindFuel = {
    home,
    quiz,
    englishLab,
    hr,
    india,
    world,
    progress,
    achievements,
    result,
    drawer
  };

  /* -------------------------
     START APP
  ------------------------- */

  splash();

})();
