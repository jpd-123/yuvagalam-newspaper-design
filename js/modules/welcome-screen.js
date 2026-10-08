// js/modules/welcome-screen.js

const WelcomeScreenModule = {
    masterLayouts: [],
    adImages: [],

    init: function() {
        this.loadInitialDummies();
    },

    loadInitialDummies: function() {
        // 5 డమ్మీ మాస్టర్ లేఅవుట్‌లు
        for (let i = 1; i <= 5; i++) {
            this.masterLayouts.push({ id: i, name: `డమ్మీ మాస్టర్ లేఅవుట్ ${i}` });
        }
        // 10 డమ్మీ యాడ్ ఇమేజ్ లు
        for (let j = 1; j <= 10; j++) {
            this.adImages.push({ id: j, src: `dummy_ad_${j}.png` });
        }
    },

    uploadMasterLayout: function(layoutData) {
        if (this.masterLayouts.length >= 5) {
            // 5 దాటితే మొదటిది తొలగించి 6వది చేర్చడం
            this.masterLayouts.shift();
        }
        this.masterLayouts.push(layoutData);
        alert('మాస్టర్ లేఅవుట్ విజయవంతంగా సేవ్ అయ్యింది!');
    },

    uploadAdImage: function(adData) {
        if (this.adImages.length >= 10) {
            // 10 దాటితే మొదటిది తొలగించి 11వది చేర్చడం
            this.adImages.shift();
        }
        this.adImages.push(adData);
        alert('యాడ్ ఇమేజ్ విజయవంతంగా అప్‌లోడ్ అయ్యింది!');
    }
};

if (typeof window !== 'undefined') {
    window.WelcomeScreenModule = WelcomeScreenModule;
}
