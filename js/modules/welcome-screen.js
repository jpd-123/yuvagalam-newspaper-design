
// FIFO (First-In, First-Out) మాస్టర్ లేఅవుట్ మరియు యాడ్ మేనేజర్
const WelcomeScreen = {
    layouts: [],
    ads: [],

    init: function() {
        this.layouts = JSON.parse(localStorage.getItem('saathvika_layouts') || '[]');
        this.ads = JSON.parse(localStorage.getItem('saathvika_ads') || '[]');
        this.renderDashboard();
    },

    saveMasterLayout: function(layoutData) {
        if (this.layouts.length >= 5) {
            this.layouts.shift(); // మొదటిది డిలీట్ చేసి 6వది చివర చేరుస్తుంది
        }
        this.layouts.push(layoutData);
        localStorage.setItem('saathvika_layouts', JSON.stringify(this.layouts));
        this.renderDashboard();
    },

    saveAdImage: function(adData) {
        if (this.ads.length >= 10) {
            this.ads.shift(); // 11వది వచ్చినప్పుడు 1వది తొలగించబడుతుంది
        }
        this.ads.push(adData);
        localStorage.setItem('saathvika_ads', JSON.stringify(this.ads));
        this.renderDashboard();
    },

    renderDashboard: function() {
        const lContainer = document.getElementById('masterLayoutList');
        const aContainer = document.getElementById('adImageList');

        if(lContainer) {
            lContainer.innerHTML = this.layouts.map((l, i) => `<div class="item-badge">లేఅవుట్ ${i+1}</div>`).join('') || '<p>డమ్మీ లేఅవుట్‌లు సిద్ధంగా ఉన్నాయి</p>';
        }
        if(aContainer) {
            aContainer.innerHTML = this.ads.map((a, i) => `<div class="item-badge">యాడ్ ${i+1}</div>`).join('') || '<p>డమ్మీ యాడ్ బాక్స్‌లు సిద్ధంగా ఉన్నాయి</p>';
        }
    },

    openMasterCanvas: function() {
        document.getElementById('welcomeScreen').classList.add('hidden');
        document.getElementById('laptopWorkspace').classList.remove('hidden');
    }
};
