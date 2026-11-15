# webraul.com

Source of my personal site, [webraul.com](https://webraul.com): a one-page portfolio built with **Jekyll** and
hosted on **GitHub Pages**.

Content lives in plain data files, so updating the site never means touching the HTML:

- `_config.yml`: name, links and the About Me text
- `_data/projects.yml`: projects
- `_data/timeline.yml`: education and experience
- `_data/skills-*.yml`: skills

## Run locally

```bash
bundle install
bundle exec jekyll serve      # http://localhost:4000
npm install && npm run build # rebuild the minified CSS and JS after style changes
```

Based on an open-source Jekyll portfolio template (MIT license, see `LICENSE`).
