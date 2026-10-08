// js/modules/auto-page-setup.js

const AutoPageSetupModule = {
    adjustPageGaps: function(pageNumber) {
        const pageElement = document.getElementById(`page-${pageNumber}`);
        if (!pageElement) return;

        const availableHeight = pageElement.clientHeight;
        let usedHeight = 0;

        const cards = pageElement.querySelectorAll('.news-card');
        cards.forEach(card => {
            usedHeight += card.offsetHeight;
        });

        const gap = availableHeight - usedHeight;

        if (gap > 50) {
            const confirmFlow = confirm(`ఈ పేజీలో ఇంకా ఖాళీ ఉంది. వార్తను తర్వాతి పేజీకి ఫ్లో (Flow) చేయాలా?`);
            if (confirmFlow) {
                this.flowToNextPage(pageNumber);
            } else {
                this.scaleNewsElements(pageElement, 1.1); // 10% హెడ్‌లైన్/ఫోటో సైజ్ పెంచడం
            }
        }
    },

    flowToNextPage: function(currentPageNum) {
        const currentCard = document.querySelector(`#page-${currentPageNum} .news-card.selected`);
        if (currentCard) {
            const footerTag = document.createElement('div');
            footerTag.innerText = `(తరువాయి భాగం ${currentPageNum + 1}వ పేజీలో)`;
            footerTag.style.color = 'red';
            footerTag.style.fontSize = '11px';
            currentCard.appendChild(footerTag);

            alert(`వార్త విజయవంతంగా ${currentPageNum + 1}వ పేజీకి ఫ్లో చెయ్యబడింది.`);
        }
    },

    scaleNewsElements: function(pageElement, scaleFactor) {
        const headlines = pageElement.querySelectorAll('.news-headline');
        headlines.forEach(h => {
            const currentSize = parseFloat(window.getComputedStyle(h).fontSize);
            h.style.fontSize = `${currentSize * scaleFactor}px`;
        });
    }
};

if (typeof window !== 'undefined') {
    window.AutoPageSetupModule = AutoPageSetupModule;
}
