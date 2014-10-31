module.exports = {

    files: {
        expand: true,
        cwd: 'assets/pic/',
        src: '*.jpg',
        dest: 'assets/pic/'
    },
    options: {
        binpath: /*require('webp-bin').path*/false,
        preset: 'photo',
        verbose: true,
        quality: 80,
        alphaQuality: 80,
        compressionMethod: 6,
        segments: 4,
        psnr: 42,
        sns: 50,
        filterStrength: 40,
        filterSharpness: 3,
        simpleFilter: true,
        partitionLimit: 50,
        analysisPass: 6,
        multiThreading: true,
        lowMemory: false,
        alphaMethod: 0,
        alphaFilter: 'best',
        alphaCleanup: true,
        noAlpha: false,/* set to true when converting jpg files  */
        lossless: false
    }
};
