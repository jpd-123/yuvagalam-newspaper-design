// js/config/shapes-config.js

const NewsShapesConfig = {
    RECTANGLE: 'shape-rectangle',
    BALL: 'shape-ball',
    EGG: 'shape-egg',
    HALF_EGG_LEFT: 'shape-half-egg-left',
    HALF_EGG_RIGHT: 'shape-half-egg-right'
};

if (typeof window !== 'undefined') {
    window.NewsShapesConfig = NewsShapesConfig;
}
