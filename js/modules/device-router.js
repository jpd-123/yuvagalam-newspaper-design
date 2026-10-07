// డివైస్ రౌటింగ్ మరియు మోడ్ చేంజ్ ఇంజిన్
const DeviceRouter = {
    select: function(mode) {
        // 1. మోడల్ డైలాగ్ బాక్స్‌ను దాచడం
        const modal = document.getElementById('deviceModal');
        if (modal) {
            modal.classList.add('hidden');
        }

        // 2. ఎంచుకున్న మోడ్‌ను బట్టి స్క్రీన్లు చూపించడం
        const welcomeScreen = document.getElementById('welcomeScreen');
        const mobileForm = document.getElementById('mobileNewsForm');
        const workspace = document.getElementById('laptopWorkspace');

        if (mode === 'mobile') {
            if (mobileForm) mobileForm.classList.remove('hidden');
            if (welcomeScreen) welcomeScreen.classList.add('hidden');
            if (workspace) workspace.classList.add('hidden');
            this.populatePageNumbers();
        } else if (mode === 'laptop') {
            if (welcomeScreen) welcomeScreen.classList.remove('hidden');
            if (mobileForm) mobileForm.classList.add('hidden');
            if (workspace) workspace.classList.add('hidden');
        }
    },

    switch: function() {
        // తిరిగి మోడల్ బాక్స్‌ను చూపించడం
        const modal = document.getElementById('deviceModal');
        if (modal) modal.classList.remove('hidden');
    },

    populatePageNumbers: function() {
        const select = document.getElementById('mobileTargetPage');
        if (select && select.options.length === 0) {
            for (let i = 1; i <= 16; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `పేజీ ${i}`;
                select.appendChild(opt);
            }
        }
    },

    uploadFromMobile: function() {
        alert("మొబైల్ న్యూస్ డేటా విజయవంతంగా కాన్వాస్‌కు పంపబడింది!");
        this.select('laptop'); // అప్‌లోడ్ అయ్యాక వర్క్‌స్పేస్‌లోకి తీసుకెళ్తుంది
    }
};
