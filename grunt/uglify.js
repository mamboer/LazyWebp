module.exports = {
    options: {
        // the banner is inserted at the top of the output
        banner: '<%= banner%>'
    },
    //for test only
    dist: {
        files: {
            'dist/LazyPic.min.js': ['dist/LazyPic.js'],
            'dist/lazyload.cmd.min.js':['dist/lazyload.cmd.js'],
            'dist/zepto.x.min.js':['dist/zepto.x.js']
        }
    }
};
