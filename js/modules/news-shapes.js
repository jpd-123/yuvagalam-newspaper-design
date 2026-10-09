// js/modules/news-shapes.js

const NewsShapesModule = {
    applyNewsShape: function(cardElement, shapeType) {
        if (!cardElement) return;

        const shapes = ['shape-rectangle', 'shape-ball', 'shape-egg', 'shape-half-egg-left', 'shape-half-egg-right'];
        shapes.forEach(s => cardElement.classList.remove(s));

        cardElement.classList.add(shapeType);
        this.adjustAdjacentFlexibility(cardElement);
    },

    adjustAdjacentFlexibility: function(cardElement) {
        const parentRow = cardElement.parentElement;
        if (!parentRow) return;

        const siblings = parentRow.querySelectorAll('.news-card');
        siblings.forEach(sibling => {
            if (sibling !== cardElement && sibling.classList.contains('shape-rectangle')) {
                sibling.classList.add('shape-rectangle-flexible');
            }
        });
    }
};

if (typeof window !== 'undefined') {
    window.NewsShapesModule = NewsShapesModule;
}
