const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'textproofreader',
        'win':{
            'target': {
                'target': 'zip',
                'arch': [
                    'x64',
//                  'ia32',
                ]
            }
        }
    }
});
