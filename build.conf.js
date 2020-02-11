module.exports = {
    module: {
        name: 'pipDashboard',
        styles: 'index',
        export: 'pip.dashboard',
        standalone: 'pip.dashboard'
    },
    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        sass: true,
        lib: true,
        images: true,
        dist: false
    },
    browserify: {
        entries: [
            './src/index.ts',
            './temp/pip-webui-dashboard-html.min.js',
        ]
    }, 
    file: {
        lib: [
            '../node_modules/pip-webui-all/dist/**/*'
        ]
    },
    samples: {
        port: 8060,
        https: false
    },
    api: {
        port: 8061
    }
};
