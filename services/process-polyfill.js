window.process = {
    env: {
        NODE_ENV: window.location.hostname === 'miss-smith-class-bank.netlify.com' ? 'production' : window.location.hostname.includes('.netlify.com') ? 'staging' : 'development',
        testing: false
    },
    argv: []
};