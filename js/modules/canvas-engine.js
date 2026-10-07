// పేజీల డిజైనింగ్ మరియు ఆటో మిర్రర్ ఇంజిన్
const CanvasEngine = {
    renderPages: function(totalPages) {
        const canvas = document.getElementById('paperCanvas');
        canvas.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'newspaper-page';
            pageDiv.id = `page-${i}`;

            // 1. హెడర్ బ్రాండింగ్ సెటప్
            pageDiv.appendChild(this.createHeader(i, totalPages));

            // 2. న్యూస్ గ్రిడ్‌ల నిర్మాణం (ఫ్రంట్, ఆడ్, ఈవెన్, లాస్ట్)
            const gridContainer = document.createElement('div');
            gridContainer.className = 'news-container';

            if (i === 1) {
                gridContainer.innerHTML = this.getFrontPageGrid();
            } else if (i % 2 === 0) {
                // ఈవెన్ పేజీ: 35% ఎడమ, 65% కుడి
                gridContainer.className += ' mirror-even';
                gridContainer.innerHTML = this.getEvenPageGrid();
            } else {
                // ఆడ్ పేజీ: 65% ఎడమ, 35% కుడి (మిర్రర్ ఎఫెక్ట్)
                gridContainer.className += ' mirror-odd';
                gridContainer.innerHTML = this.getOddPageGrid();
            }

            pageDiv.appendChild(gridContainer);

            // 3. ఫుటర్ / బుల్లెట్స్ / ఎడిటర్ వివరాలు
            pageDiv.appendChild(this.createFooter(i, totalPages));
            canvas.appendChild(pageDiv);
        }
    },

    createHeader: function(pageNum, totalPages) {
        const header = document.createElement('div');
        header.className = 'branding-header';

        if (pageNum === 1) {
            header.innerHTML = `
                <div class="top-row">
                    <div class="ad-box-left" id="paperAdBox">పత్రిక ప్రకటన</div>
                    <div class="main-logo-area" id="mainLogo">
                        <small>సాత్విక పబ్లిషర్‌కు స్వాగతం</small>
                        <h2>యువగళం</h2>
                    </div>
                    <div class="sukthi-box" id="sukthiBox">
                        <strong>మంచి మాట</strong>
                        <p id="sukthiText">రోజూ ఒక శుభ వర్తమానం.</p>
                    </div>
                </div>
                <div class="branding-grid">
                    <span>సంపుటి: 1</span> | <span>సంచిక: 10</span> | <span>తేదీ: ${new Date().toLocaleDateString('te-IN')}</span> | <span>వెల: ₹ 5.00</span>
                </div>
            `;
        } else {
            header.innerHTML = `
                <div class="branding-grid inner-header">
                    <div class="header-left-logo" id="innerLogoP${pageNum}">[లోగో]</div>
                    <div class="header-center-title">యువగళం</div>
                    <div class="header-right-cat">జనరల్ వార్తలు | పేజీ: ${pageNum}</div>
                </div>
            `;
        }
        return header;
    },

    getFrontPageGrid: function() {
        return `
            <div class="row-1 flex-row">
                <div class="news-card main-news shape-rect flex-60" id="p1-n1">
                    <span class="signal-tag new-tag">🟢 NEW</span>
                    <h1 class="headline">ప్రధాన వార్త శీర్షిక...</h1>
                    <div class="body-content">వార్తా కథనం వివరాలు...</div>
                </div>
                <div class="news-card sub-news shape-rect flex-40" id="p1-n2">
                    <h3 class="headline">రెండవ చిన్న వార్త...</h3>
                    <div class="body-content">సమాచారం...</div>
                </div>
            </div>
            <div class="row-2 grid-3-col">
                <div class="news-card shape-rect">మధ్యస్థ వార్త 1</div>
                <div class="news-card shape-rect">మధ్యస్థ వార్త 2</div>
                <div class="news-card shape-rect">మధ్యస్థ వార్త 3</div>
            </div>
        `;
    },

    getEvenPageGrid: function() {
        return `
            <div class="col-left-35">
                <div class="news-card">చిన్న వార్త 1</div>
                <div class="news-card">చిన్న వార్త 2</div>
                <div class="news-card">చిన్న వార్త 3</div>
            </div>
            <div class="col-right-65">
                <div class="news-card">మధ్యస్థ వార్త 1</div>
                <div class="news-card">మధ్యస్థ వార్త 2</div>
                <div class="news-card">మధ్యస్థ వార్త 3</div>
            </div>
        `;
    },

    getOddPageGrid: function() {
        return `
            <div class="col-left-65">
                <div class="news-card">మధ్యస్థ వార్త 1</div>
                <div class="news-card">మధ్యస్థ వార్త 2</div>
                <div class="news-card">మధ్యస్థ వార్త 3</div>
            </div>
            <div class="col-right-35">
                <div class="news-card">చిన్న వార్త 1</div>
                <div class="news-card">చిన్న వార్త 2</div>
                <div class="news-card">చిన్న వార్త 3</div>
            </div>
        `;
    },

    createFooter: function(pageNum, totalPages) {
        const footer = document.createElement('div');
        footer.className = 'page-footer';

        if (pageNum === totalPages) {
            footer.innerHTML = `
                <div id="editorDetails" class="editor-box">
                    ముద్రణ మరియు ప్రచురణకర్త వివరాలు: యువగళం ప్రింటింగ్ ప్రెస్.
                </div>
                <div id="lastPageBullets" class="bullet-line hidden">● ■ ◆ ★</div>
            `;
        } else {
            footer.innerHTML = `<div class="bullet-line">● ■ ◆ ★ ● ■ ◆ ★ ● ■ ◆ ★</div>`;
        }
        return footer;
    }
};
          
