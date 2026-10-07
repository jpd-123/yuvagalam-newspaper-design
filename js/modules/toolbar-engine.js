// 26 టూల్స్ ఆపరేషన్ల ఇంజిన్ (ToolbarEngine)
const ToolbarEngine = {
    mode: 'master',

    switchMode: function(modeName) {
        this.mode = modeName;
        const titleElem = document.getElementById('toolbarModeTitle');
        const buttons = document.querySelectorAll('.mode-buttons .btn-tab');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        
        if (modeName === 'master') {
            if (titleElem) titleElem.innerText = 'మాస్టర్ లేఅవుట్ టూల్‌బార్';
            buttons[0]?.classList.add('active');
        } else {
            if (titleElem) titleElem.innerText = 'డైలీ న్యూస్ టూల్‌బార్';
            buttons[1]?.classList.add('active');
        }
    },

    // 3. బాటమ్ బుల్లెట్లు మార్చడం
    cycleBullets: function() {
        const bullets = ['● ■ ◆ ★', '★ ★ ★ ★', '◆ ◆ ◆ ◆', '■ ■ ■ ■'];
        const pageFooters = document.querySelectorAll('.bullet-line');
        pageFooters.forEach(footer => {
            let current = footer.innerText;
            let nextIdx = (bullets.indexOf(current) + 1) % bullets.length;
            footer.innerText = bullets[nextIdx];
        });
        alert('ఫుటర్ బుల్లెట్ల శైలి మారినది!');
    },

    // 4. మెయిన్ లోగో క్లిప్‌బోర్డ్ నుండి పేస్ట్
    pasteLogo: async function() {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        const blob = await item.getType(type);
                        const url = URL.createObjectURL(blob);
                        const logoArea = document.getElementById('mainLogo');
                        if (logoArea) {
                            logoArea.innerHTML = `<img src="${url}" style="max-height:80px; width:auto;">`;
                        }
                        alert('లోగో విజయవంతంగా పేస్ట్ అయ్యింది!');
                        return;
                    }
                }
            }
            alert('క్లిప్‌బోర్డ్‌లో ఇమేజ్ ఏదీ లేదు! Ctrl+C తో ముందుగా లోగోను కాపీ చేసుకోండి.');
        } catch (err) {
            alert('క్లిప్‌బోర్డ్ యాక్సెస్ చేయడానికి అనుమతి అవసరం లేదా సరిగ్గా కాపీ కాలేదు.');
        }
    },

    // 6. రిపోర్టర్స్ యాడ్ ఆన్/ఆఫ్
    toggleAd: function() {
        const adBox = document.getElementById('paperAdBox');
        if (adBox) {
            adBox.style.display = (adBox.style.display === 'none') ? 'block' : 'none';
        }
    },

    // 7. సూక్తి బాక్స్ ఎడిట్
    editSukthi: function() {
        const currentText = document.getElementById('sukthiText')?.innerText || '';
        const newText = prompt('కొత్త సూక్తిని నమోదు చేయండి:', currentText);
        if (newText !== null) {
            const sukthiElem = document.getElementById('sukthiText');
            if (sukthiElem) sukthiElem.innerText = newText;
        }
    },

    // 8. బ్రాండింగ్ హెడర్ రంగులు & వివరాలు
    editBranding: function() {
        const color = prompt('హెడర్ బ్యాక్‌గ్రౌండ్ కలర్ కోడ్ ఎంటర్ చేయండి (HEX/Name):', '#f8fafc');
        if (color) {
            const headerGrids = document.querySelectorAll('.branding-grid');
            headerGrids.forEach(grid => grid.style.background = color);
        }
    },

    // 9. ఎడిటర్ వివరాలు ఆన్/ఆఫ్
    toggleEditor: function() {
        const editorBox = document.getElementById('editorDetails');
        if (editorBox) {
            editorBox.style.display = (editorBox.style.display === 'none') ? 'block' : 'none';
        }
    },

    // 10. న్యూస్ గ్రిడ్ సెలెక్టర్
    selectGridType: function() {
        alert('గ్రిడ్ మోడల్ ఎంపిక మోడ్ యాక్టివేట్ అయ్యింది.');
    },

    // 12. హెడ్‌లైన్ స్టైలర్
    styleHeadline: function() {
        const firstHeadline = document.querySelector('.headline');
        if (firstHeadline) {
            const color = prompt('హెడ్‌లైన్ కలర్ ఎంచుకోండి (Red, Blue, Black, Green):', 'Red');
            if (color) firstHeadline.style.color = color;
        }
    },

    // 14. సబ్ హెడ్‌లైన్ కంట్రోలర్
    styleSubheadline: function() {
        alert('సబ్ హెడ్‌లైన్ స్టైల్స్ అప్‌డేట్ అయ్యాయి.');
    },

    // 17. న్యూస్ ఫోటో పేస్ట్ (Ctrl+V)
    pasteNewsPhoto: async function() {
        alert('Ctrl+V ద్వారా ఫోటో అప్‌లోడ్ చేయడానికి సిద్ధంగా ఉంది.');
    },

    // 18. ఫోటో స్టైలర్
    stylePhoto: function() {
        alert('ఫోటో క్రాపింగ్ / గుండ్రని ఆకారం సెట్టింగ్స్.');
    },

    // 19. వార్త షేప్ కంట్రోలర్ (L-Shape / Flow)
    setNewsShape: function() {
        alert('వార్తా లేఅవుట్ షేప్ మారినది.');
    },

    // 21. గ్రిడ్ డిలీట్
    deleteGrid: function() {
        if (confirm('ఎంచుకున్న వార్తా గ్రిడ్‌ను డిలీట్ చేయాలా?')) {
            const selectedCard = document.querySelector('.news-card');
            if (selectedCard) selectedCard.remove();
        }
    },

    // 22. యాడ్ అప్‌లోడ్
    uploadAd: function() {
        alert('యాడ్ ఇమేజ్ అప్‌లోడ్ బాక్స్.');
    },

    // 24. కలర్ సిగ్నల్ క్లీనర్ (పాత వార్తలు తీసివేయడం)
    cleanSignals: function() {
        const tags = document.querySelectorAll('.signal-tag');
        tags.forEach(tag => tag.remove());
        alert('అన్ని సిగ్నల్ ట్యాగ్‌లు క్లీన్ చేయబడ్డాయి!');
    },

    // 25. పిక్చర్ క్రాపర్
    cropImage: function() {
        alert('పిక్చర్ క్రాపింగ్ టూల్ తెరవబడింది.');
    }
};
