// js/modules/news-shapes.js

const NewsShapesModule = {
    applyShape: function(cardElement, shapeType) {
        if (!cardElement) return;

        // పాత షేప్ క్లాసులను తొలగించడం
        const shapeClasses = [
            'shape-rectangle', 
            'shape-ball', 
            'shape-egg', 
            'shape-half-egg-left', 
            'shape-half-egg-right'
        ];
        cardElement.classList.remove(...shapeClasses);

        // కొత్త షేప్ క్లాస్ జోడించడం
        cardElement.classList.add(shapeType);

        // పక్కన ఉన్న చతురస్ర వార్తలను ప్లెక్సిబుల్ చేయడం
        this.adjustAdjacentFlexibleGrid(cardElement, shapeType);
    },

    adjustAdjacentFlexibleGrid: function(cardElement, shapeType) {
        const parentPage = cardElement.closest('.newspaper-page');
        if (!parentPage) return;

        const allCards = parentPage.querySelectorAll('.news-card');
        allCards.forEach(card => {
            if (card !== cardElement && !card.classList.contains('shape-ball') && !card.classList.contains('shape-egg')) {
                card.classList.add('shape-rectangle-flexible');
            }
        });
    }
};

if (typeof window !== 'undefined') {
    window.NewsShapesModule = NewsShapesModule;
}
