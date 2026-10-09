// js/modules/auto-page-setup.js

const AutoPageSetupModule = {
    runAutoSetup: function(pageNum) {
        const page = document.getElementById('page-' + pageNum);
        if (!page) return;

        const totalHeight = page.clientHeight;
        let contentHeight = 0;
        
        const children = page.children;
        for (let i = 0; i < children.length; i++) {
            contentHeight += children[i].offsetHeight;
        }

        const remainingGap = totalHeight - contentHeight;

        if (remainingGap > 40) {
            const choice = confirm('ఈ పేజీలో ' + remainingGap + 'px ఖాళీ ఉంది.\nవార్తల సైజ్ పెంచాలా? (OK)\nలేదా తదుపరి పేజీకి ఫ్లో చేయాలా? (Cancel)');
            if (choice) {
                this.scaleContent(page, 1.08);
            } else {
                this.flowNewsToNextPage(pageNum);
            }
        } else {
            alert('పేజీ సెటప్ పూర్తయింది. గ్యాప్ సరిగ్గా సర్దుబాటు చేయబడింది.');
        }
    },

    scaleContent: function(pageElement, factor) {
        const headlines = pageElement.querySelectorAll('.news-headline');
        headlines.forEach(h => {
            const currentSize = parseFloat(window.getComputedStyle(h).fontSize);
            h.style.fontSize = (currentSize * factor) + 'px';
        });

        const photos = pageElement.querySelectorAll('.news-card-photo');
        photos.forEach(img => {
            const currentWidth = img.offsetWidth;
            img.style.width = (currentWidth * factor) + 'px';
        });
    },

    flowNewsToNextPage: function(currentPageNum) {
        if (!ToolbarEngineModule.selectedCard) {
            alert('దయచేసి ఫ్లో చేయాలనుకుంటున్న వార్తను ఎంచుకోండి.');
            return;
        }
        
        const card = ToolbarEngineModule.selectedCard;
        const bodyText = card.querySelector('.news-body');
        if (!bodyText) return;

        const fullText = bodyText.innerText;
        const halfLength = Math.floor(fullText.length / 2);

        const firstPart = fullText.substring(0, halfLength);
        const secondPart = fullText.substring(halfLength);

        bodyText.innerText = firstPart;
        
        const tag = document.createElement('div');
        tag.className = 'flow-tag';
        tag.innerText = '(తరువాయి భాగం ' + (parseInt(currentPageNum) + 1) + 'వ పేజీలో)';
        card.appendChild(tag);

        alert('వార్త రెండవ భాగం ' + (parseInt(currentPageNum) + 1) + 'వ పేజీలోకి తరలించడానికి సిద్ధంగా ఉంది.');
    }
};

if (typeof window !== 'undefined') {
    window.AutoPageSetupModule = AutoPageSetupModule;
}
