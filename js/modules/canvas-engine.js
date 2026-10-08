// js/modules/canvas-engine.js

const CanvasEngineModule = {
    renderPages: function(totalPages = 4) {
        const canvas = document.getElementById('paper-canvas');
        if (!canvas) return;
        canvas.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const page = document.createElement('div');
            page.className = 'newspaper-page';
            page.id = `page-${i}`;

            // మిర్రర్ ఎఫెక్ట్ గ్రిడ్ అమరిక
            const gridClass = (i % 2 === 0) ? 'mirror-even' : 'mirror-odd';

            if (i === 1) {
                page.innerHTML = this.getFrontPageHTML();
            } else if (i === totalPages) {
                page.innerHTML = this.getFinalPageHTML(i, gridClass);
            } else {
                page.innerHTML = this.getInnerPageHTML(i, gridClass);
            }

            canvas.appendChild(page);
        }
    },

    getFrontPageHTML: function() {
        return `
            <div class="branding-header">
                <div class="top-row">
                    <div style="width: 20%; border: 1px dashed #ccc;">రిపోర్టర్ యాడ్</div>
                    <div style="width: 55%; text-align: center;">
                        <span id="welcome-text">సాత్విక పబ్లిషర్ కు స్వాగతం</span>
                        <img id="main-logo-target" style="max-height: 60px; display: none;" />
                    </div>
                    <div style="width: 20%; border: 1px dashed #ccc;"><b>మంచి మాట</b><br><small>డమ్మీ సూక్తి</small></div>
                </div>
                <div class="branding-grid">
                    సంపుటి: 1 | సంచిక: 1 | రోజు: సోమవారం | తేదీ: 01/10/2026 | పేజీలు: 4 | వెల: ₹5.00
                </div>
            </div>
            <div class="news-container">
                <div class="news-card shape-rectangle">
                    <h2 class="news-headline">ప్రధాన వార్త హెడ్‌లైన్</h2>
                    <p>డమ్మీ ప్రధాన వార్త బాడీ టెక్స్ట్...</p>
                </div>
            </div>
            <div class="bullet-line">● ■ ◆ ▲ ★ ❖</div>
        `;
    },

    getInnerPageHTML: function(pageNum, gridClass) {
        return `
            <div class="branding-header">
                <div class="top-row">
                    <img class="side-branding-logo" style="height: 30px;" />
                    <span>యువగళం దినపత్రిక</span>
                    <span>జనరల్ వార్తలు</span>
                    <span>పేజీ: ${pageNum}</span>
                </div>
            </div>
            <div class="${gridClass}">
                <div class="news-card">సాధారణ వార్త గ్రిడ్</div>
                <div class="news-card">సాధారణ వార్త గ్రిడ్</div>
            </div>
            <div class="bullet-line">● ■ ◆ ▲ ★ ❖</div>
        `;
    },

    getFinalPageHTML: function(pageNum, gridClass) {
        return `
            <div class="branding-header">
                <div class="top-row">
                    <img class="side-branding-logo" style="height: 30px;" />
                    <span>యువగళం దినపత్రిక</span>
                    <span>చివరి పేజీ</span>
                    <span>పేజీ: ${pageNum}</span>
                </div>
            </div>
            <div class="${gridClass}">
                <div class="news-card">చివరి పేజీ వార్త</div>
            </div>
            <div id="editor-details-area" class="branding-grid hidden">
                ప్రింటర్, పబ్లిషర్ మరియు ఎడిటర్ వివరాలు...
            </div>
            <div class="bullet-line">● ■ ◆ ▲ ★ ❖</div>
        `;
    }
};

if (typeof window !== 'undefined') {
    window.CanvasEngineModule = CanvasEngineModule;
}
