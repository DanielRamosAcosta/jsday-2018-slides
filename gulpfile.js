const { src, dest, watch, series, parallel } = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync')

const OUTPUT_DIR = "./public"

const views = () => src(["slides/index.pug"])
  .pipe(pug({}))
  .pipe(dest(OUTPUT_DIR))

const reveal = () => src([
  "node_modules/reveal.js/css/**/*",
  "node_modules/reveal.js/lib/**/*",
  "node_modules/reveal.js/js/**/*",
  "node_modules/reveal.js/plugin/**/*",
], { base: 'node_modules/reveal.js' })
.pipe(dest(OUTPUT_DIR))

const images = () => src([
  "slides/assets/**/*",
], { base: 'slides' })
.pipe(dest(OUTPUT_DIR))


const build = parallel(views, reveal, images)

const serve = () => {
  const server = browserSync.create()

  server.init({
    server: {
      baseDir: OUTPUT_DIR
    }
  })

  watch(['slides/**/*.pug'], views)
  watch(['slides/assets/**/*'], images)

  watch([`${OUTPUT_DIR}/**/*`], done => {
    server.reload()
    done()
  });
}

module.exports = {
  views,
  reveal,
  build,
  serve: series(build, serve)
}
