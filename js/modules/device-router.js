// js/modules/device-router.js

const DeviceRouterModule = {
    init: function() {
        const isMobile = window.innerWidth <= 768;
        const laptopView = document.getElementById('laptop-view');
        const mobileView = document.getElementById('mobile-view');

        if (isMobile) {
            if (laptopView) laptopView.classList.add('hidden');
            if (mobileView) mobileView.classList.remove('hidden');
            if (window.ToolbarEngineModule) {
                window.ToolbarEngineModule.setToolbarMode('mobile');
            }
        } else {
            if (laptopView) laptopView.classList.remove('hidden');
            if (mobileView) mobileView.classList.add('hidden');
            if (window.ToolbarEngineModule) {
                window.ToolbarEngineModule.setToolbarMode('master');
            }
        }
    }
};

window.addEventListener('resize', () => DeviceRouterModule.init());
window.addEventListener('DOMContentLoaded', () => DeviceRouterModule.init());

if (typeof window !== 'undefined') {
    window.DeviceRouterModule = DeviceRouterModule;
}
