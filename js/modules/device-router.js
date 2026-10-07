// డివైస్ రౌటింగ్, లైవ్ ప్రివ్యూ మరియు పత్రిక లోగో ఆటో-డిటెక్షన్ ఇంజిన్
const DeviceRouter = {
    uploadedImageBase64: '',

    // 1. డివైస్ మోడ్ ఎంపిక (మొబైల్ / ల్యాప్‌టాప్)
    select: function(mode) {
        const modal = document.getElementById('deviceModal');
        if (modal) {
            modal.classList.add('hidden');
        }

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

    // 2. మోడ్ మార్చుకోవడానికి మోడల్ తెరవడం
    switch: function() {
        const modal = document.getElementById('deviceModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    },

    // 3. టార్గెట్ పేజీ డ్రాప్‌డౌన్ నింపడం (1 నుండి 16 పేజీలు)
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

    // 4. మొబైల్ నుండి ఫోటో అప్‌లోడ్ చేసినప్పుడు Base64 గా మార్చడం
    handleImageUpload: function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedImageBase64 = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    },

    // 5. మొబైల్ నుండి డేటా పంపి లైవ్ ప్రివ్యూ చూపే ఫంక్షన్
    uploadFromMobile: function() {
        const targetPage = document.getElementById('mobileTargetPage') ? document.getElementById('mobileTargetPage').value : '1';
        const gridShape = document.getElementById('mGridShape') ? document.getElementById('mGridShape').value : 'rect';
        const headline = (document.getElementById('mHeadline') && document.getElementById('mHeadline').value) ? document.getElementById('mHeadline').value : 'శీర్షిక లేదు';
        const subHeadline = document.getElementById('mSubHeadline') ? document.getElementById('mSubHeadline').value : '';
        const dateline = document.getElementById('mDateline') ? document.getElementById('mDateline').value : '';
        const bodyText = document.getElementById('mBody') ? document.getElementById('mBody').value : '';

        // మాస్టర్ లోగోను ఆటోమేటిక్‌గా ఫెచ్ చేయడం
        const logoImg = document.getElementById('clippingLogo');
        const paperTitle = document.getElementById('clippingPaperName');
        
        let masterLogoSrc = window.masterPaperLogoSrc || '';
        
        if (masterLogoSrc && logoImg) {
            logoImg.src = masterLogoSrc;
            logoImg.style.display = 'block';
            if (paperTitle) paperTitle.style.display = 'none';
        } else if (logoImg) {
            logoImg.style.display = 'none';
            if (paperTitle) paperTitle.style.display = 'block';
        }

        // ప్రివ్యూ కంటెంట్ రెండర్ చేయడం
        const contentArea = document.getElementById('clippingContent');
        if (contentArea) {
            let imageHTML = this.uploadedImageBase64 ? `<img src="${this.uploadedImageBase64}" class="clip-img" />` : '';

            contentArea.className = `clipping-body shape-${gridShape}`;
            contentArea.innerHTML = `
                <h2 class="clip-headline">${headline}</h2>
                ${subHeadline ? `<h4 class="clip-subhead">${subHeadline}</h4>` : ''}
                <div class="clip-main-wrap">
                    ${imageHTML}
                    <p class="clip-text"><strong>${dateline ? dateline + ' :' : ''}</strong> ${bodyText}</p>
                </div>
                <div class="clip-footer-tag">యువగళం దినపత్రిక - పేజీ ${targetPage} లో సెట్ చేయబడింది 🟢</div>
            `;
        }

        // ప్రివ్యూ బాక్స్ చూపించడం
        const previewArea = document.getElementById('mobilePreviewArea');
        if (previewArea) {
            previewArea.classList.remove('hidden');
        }

        // ల్యాప్‌టాప్ కాన్వాస్ పేజీ లోనికి కూడా ఇంజెక్ట్ చేయడం
        if (typeof CanvasEngine !== 'undefined' && typeof CanvasEngine.injectMobileNews === 'function') {
            CanvasEngine.injectMobileNews(targetPage, {
                shape: gridShape, headline, subHeadline, dateline, bodyText, image: this.uploadedImageBase64
            });
        }
    },

    // 6. క్లిప్పింగ్ వార్తను PNG ఇమేజ్‌గా డౌన్‌లోడ్ చేయడం
    downloadPNG: function() {
        const cardNode = document.getElementById('pngClippingCard');
        if (!cardNode) return;

        if (typeof html2canvas !== 'undefined') {
            html2canvas(cardNode, { scale: 2, useCORS: true }).then(canvas => {
                const link = document.createElement('a');
                link.download = `Yuvagalam_News_${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            alert("PNG డౌన్‌లోడ్ లైబ్రరీ (html2canvas) లోడ్ కాలేదు. దయచేసి పేజీని రీఫ్రెష్ చేయండి.");
        }
    }
};
