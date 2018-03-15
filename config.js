let adIds = {
    banner: {
        clientAdWebView: 'ca-app-pub-5210992602133618/6851071702',
        circular: 'ca-app-pub-5210992602133618/7233942018',
        favorites: 'ca-app-pub-5210992602133618/3205807912',
        home: 'ca-app-pub-5210992602133618/2757363155',
        notesWebView: 'ca-app-pub-5210992602133618/9669323654',
        notesQpRectangle: 'ca-app-pub-5210992602133618/8867733091',
        qpWebView: 'ca-app-pub-5210992602133618/3343588459',
        resultsWebView: 'ca-app-pub-5210992602133618/2896155456',
        studyMaterials: 'ca-app-pub-5210992602133618/8360219210',
        techNewsWebView: 'ca-app-pub-5210992602133618/6189598861'
    },
    interstitial: {
        contentDownloadWebView: 'ca-app-pub-5210992602133618/1104561635',
        download: 'ca-app-pub-5210992602133618/9013927545',
        results: 'ca-app-pub-5210992602133618/2025314533',
        techNews: 'ca-app-pub-5210992602133618/6321203646'
    }
};

let envTypes = {
    dev: 'dev',
    prod: 'prod'
};

let ENV = envTypes.dev;

export {adIds, ENV};