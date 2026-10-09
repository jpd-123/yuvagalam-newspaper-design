// js/modules/welcome-screen.js

const WelcomeScreenModule = {
    masterLayouts: [],
    adImages: [],

    init: function() {
        for (let i = 1; i <= 5; i++) {
            this.masterLayouts.push({ id: i, name: 'డమ్మీ మాస్టర్ లేఅవుట్ ' + i });
        }
        for (let j = 1; j <= 10; j++) {
            this.adImages.push({ id: j, url: 'dummy_ad_' + j + '.png' });
        }
    },

    uploadMasterLayout: function(layoutObj) {
        if (this.masterLayouts.length >= 5) {
            this.masterLayouts.shift();
        }
        this.masterLayouts.push(layoutObj);
    },

    uploadAdImage: function(adObj) {
        if (this.adImages.length >= 10) {
            this.adImages.shift();
        }
        this.adImages.push(adObj);
    }
};

if (typeof window !== 'undefined') {
    window.WelcomeScreenModule = WelcomeScreenModule;
}
