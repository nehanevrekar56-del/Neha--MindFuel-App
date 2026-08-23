# MindFuel — Final Visual App

A mobile-first Progressive Web App built to match the supplied MindFuel reference visuals.

## Included screens
- Splash / Let's Begin
- Home dashboard
- Side navigation drawer
- Play Quiz
- Quiz result
- HR Radar
- English Lab
- India Now
- World Now
- My Progress
- Bookmarks
- Achievements
- Settings
- About MindFuel
- Profile / Me

## Functional interactions
- Let's Begin opens Home directly.
- Home cards navigate to their modules.
- Side drawer navigation works.
- Quiz supports selecting answers, checking, XP, next question and a result screen.
- English Lab bookmark action saves **Insightful** to Bookmarks.
- World Now scanner button opens a learning-brief interaction sheet.
- Settings toggles persist locally.
- Profile, XP, quiz history and bookmarks persist in localStorage.

## GitHub Pages
Upload the **entire contents of this folder**, not just `index.html`.
The required structure is:

```
index.html
app.js
styles.css
manifest.json
sw.js
assets/
  splash.jpg
  home.jpg
  drawer.jpg
  quiz.jpg
  result.jpg
  english.jpg
  world.jpg
  hr.jpg
  india.jpg
  progress.jpg
  achievements.jpg
```

For GitHub Pages, publish the `main` branch from `/ (root)`.
