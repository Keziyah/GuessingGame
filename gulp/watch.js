let gulp = require("gulp");

let watch = require("gulp-watch");

let browserSync = require("browser-sync").create();


//!!!!!!!BROWSER SYNC WILL NOT WORK WITHOUT A BODY TAG IN THE HTML 

gulp.task("watch", function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "app"
    }
  });

  watch("./app/index.html", function() {
    browserSync.reload();
  });

  watch("./app/styles.css", function() {
    gulp.start("cssInject");
  });
});




gulp.task("cssInject", ["styles"], function() {
  return gulp.src("./app/temp/styles/styles.css")
  .pipe(browserSync.stream());
});
