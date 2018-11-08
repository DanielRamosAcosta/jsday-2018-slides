const { src, dest, watch, series, parallel } = require('gulp')
const pug = require('gulp-pug')

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


const build = parallel(views, reveal)

const serve = () => {
  const browserSync = require('browser-sync').create()

  browserSync.init({
    server: {
      baseDir: OUTPUT_DIR
    }
  })

  watch(['slides/**/*'], views)

  watch([`${OUTPUT_DIR}/**/*`], done => {
    browserSync.reload()
    done()
  });
}

module.exports = {
  views,
  reveal,
  build,
  serve: series(build, serve)
}
