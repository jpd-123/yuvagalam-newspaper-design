// js/modules/toolbar-engine.js

const ToolbarEngineModule = {
    currentMode: 'master', // master, daily, mobile

    setToolbarMode: function(mode) {
        this.currentMode = mode;
        const masterTools = document.querySelectorAll('.master-only-tool');
        
        if (mode === 'daily') {
            // డైలీ మోడ్‌లో పాత 5 ఆప్షన్లను దాచడం
            masterTools.forEach(el => el.classList.add('hidden'));
        } else if (mode === 'master') {
            masterTools.forEach(el => el.classList.remove('hidden'));
        }
    },

    handlePasteLogo: async function() {
        try {
            const textOrImage = await navigator.clipboard.read();
            for (const item of textOrImage) {
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    const blob = await item.getType(item.types.find(t => t.startsWith('image/')));
                    const imgUrl = URL.createObjectURL(blob);
                    
                    // ప్రధాన లోగో సెట్ చేయడం
                    const mainLogoImg = document.getElementById('main-logo-target');
                    if (mainLogoImg) mainLogoImg.src = imgUrl;

                    // 2వ పేజీ నుండి బ్రాండింగ్ హెడర్‌లలో సెట్ చేయడం
                    const sideLogos = document.querySelectorAll('.side-branding-logo');
                    sideLogos.forEach(img => img.src = imgUrl);
                }
            }
        } catch (err) {
            alert('Ctrl+V చేయడానికి ఇమేజ్ కాపీ చేయండి లేదా పర్మిషన్ ఇవ్వండి.');
        }
    }
};

if (typeof window !== 'undefined') {
    window.ToolbarEngineModule = ToolbarEngineModule;
}
