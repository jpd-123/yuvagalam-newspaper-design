// js/modules/canvas-engine.js

const CanvasEngineModule = {
    renderPages: function(totalPages) {
        const canvas = document.getElementById('paper-canvas');
        if (!canvas) return;
        canvas.innerHTML = '';

        const count = parseInt(totalPages) || 4;

        for (let i = 1; i <= count; i++) {
            const page = document.createElement('div');
            page.className = 'newspaper-page';
            page.id = 'page-' + i;
            page.setAttribute('data-page-number', i);

            if (i === 1) {
                page.innerHTML = this.getFrontPageHTML();
            } else if (i === count) {
                page.innerHTML = this.getInnerPageHTML(i, 'mirror-even', true);
            } else {
                const gridClass = (i % 2 === 0) ? 'mirror-even' : 'mirror-odd';
                page.innerHTML = this.getInnerPageHTML(i, gridClass, false);
            }

            canvas.appendChild(page);
        }
    },

    getFrontPageHTML: function() {
        return '<div class="branding-header">' +
            '<div class="top-row">' +
                '<div class="ad-box-left" id="reporter-ad-box">పత్రిక ప్రకటన (యాడ్)</div>' +
                '<div class="main-logo-container" id="front-logo-container">' +
                    '<span id="welcome-text-placeholder">సాత్విక పబ్లిషర్ కు స్వాగతం</span>' +
                    '<img id="main-logo-img" class="main-logo-style hidden" alt="Main Logo" />' +
                '</div>' +
                '<div class="ad-box-right" id="sukti-box">' +
                    '<b id="sukti-title">మంచి మాట</b><br>' +
                    '<span id="sukti-text">ఒక మంచి మాట సూక్తి...</span>' +
                '</div>' +
            '</div>' +
            '<div class="branding-grid" id="branding-grid-page-1">' +
                'సంపుటి: 1 | సంచిక: 1 | రోజు: సోమవారం | తేదీ: 01 | నెల: జనవరి | సంవత్సరం: 2026 | పేజీలు: 4 | వెల: ₹5.00' +
            '</div>' +
        '</div>' +
        '<div class="news-container">' +
            '<div class="news-row line-1">' +
                '<div class="news-card flex-large shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)">' +
                    '<h2 class="news-headline">ప్రధాన వార్త హెడ్‌లైన్</h2>' +
                    '<div class="news-subheadline">సబ్ హెడ్‌లైన్ 1</div>' +
                    '<div class="news-dateline">హైదరాబాద్:</div>' +
                    '<div class="news-body">ప్రధాన వార్త వివరణ ఇక్కడ ప్రచురించబడుతుంది...</div>' +
                '</div>' +
                '<div class="news-card flex-small shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)">' +
                    '<h3 class="news-headline">చిన్న వార్త</h3>' +
                    '<div class="news-dateline">అమరావతి:</div>' +
                    '<div class="news-body">చిన్న వార్త వివరణ...</div>' +
                '</div>' +
            '</div>' +
            '<div class="news-row line-2">' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">మధ్యస్థ వార్త 1</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">మధ్యస్థ వార్త 2</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">మధ్యస్థ వార్త 3</h3><div class="news-body">వివరణ...</div></div>' +
            '</div>' +
            '<div class="news-row line-3">' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">మధ్యస్థ వార్త 4</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">మధ్యస్థ వార్త 5</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">మధ్యస్థ వార్త 6</h3><div class="news-body">వివరణ...</div></div>' +
            '</div>' +
        '</div>' +
        '<div class="bullet-line-footer">● ■ ◆ ▲</div>';
    },

    getInnerPageHTML: function(pageNum, gridClass, isLastPage) {
        let footerContent = '<div class="bullet-line-footer">● ■ ◆ ▲</div>';
        if (isLastPage) {
            footerContent = '<div id="editor-details-container-' + pageNum + '" class="editor-details-box hidden">' +
                'ఎడిటర్ వివరాలు: ప్రింటర్, పబ్లిషర్ వివరాలు నమోదు చేయబడతాయి.' +
            '</div>' +
            '<div id="editor-bullet-container-' + pageNum + '" class="bullet-line-footer">● ■ ◆ ▲</div>';
        }

        return '<div class="branding-header" id="branding-header-page-' + pageNum + '">' +
            '<div class="inner-top-row">' +
                '<div class="inner-header-left">' +
                    '<img class="secondary-logo-img hidden" alt="Logo" />' +
                '</div>' +
                '<div class="inner-header-center">' +
                    '<span class="paper-title-text">పత్రిక పేరు</span>' +
                '</div>' +
                '<div class="inner-header-right">' +
                    '<span class="general-news-text">జనరల్ వార్తలు</span>' +
                    '<span class="page-number-display">పేజీ: ' + pageNum + '</span>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="news-container ' + gridClass + '">' +
            '<div class="col-left">' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">వార్త 1</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">వార్త 2</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">వార్త 3</h3><div class="news-body">వివరణ...</div></div>' +
            '</div>' +
            '<div class="col-right">' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">వార్త 4</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">వార్త 5</h3><div class="news-body">వివరణ...</div></div>' +
                '<div class="news-card shape-rectangle" onclick="ToolbarEngineModule.selectCard(this)"><h3 class="news-headline">వార్త 6</h3><div class="news-body">వివరణ...</div></div>' +
            '</div>' +
        '</div>' +
        footerContent;
    }
};

if (typeof window !== 'undefined') {
    window.CanvasEngineModule = CanvasEngineModule;
}
