module.exports = {
  less: {
    files:["less/**/*.less"],
    tasks:["less"]
  },
  js:{
    files:["src/*.js"],
    tasks:["concat","uglify"]
  },
  build:{

    files:["src/*.js","css/*.css"],
    tasks:["concat","uglify","concat_css","cssmin"]
  }
};
