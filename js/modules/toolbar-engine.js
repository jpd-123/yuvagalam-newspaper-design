// js/modules/toolbar-engine.js

const ToolbarEngineModule = {
    selectedCard: null,
    copiedImageBlob: null,

    selectCard: function(cardElement) {
        if (this.selectedCard) {
            this.selectedCard.classList.remove('selected-card');
        }
        this.selectedCard = cardElement;
        this.selectedCard.classList.add('selected-card');
    },

    setPaperSize: function(size) {
        const pages = document.querySelectorAll('.newspaper-page');
        pages.forEach(p => {
            p.className = 'newspaper-page size-' + size.toLowerCase();
        });
    },

    changeBottomBullets: function(bulletPattern) {
        const footers = document.querySelectorAll('.bullet-line-footer');
        footers.forEach(f => {
            f.innerText = bulletPattern;
        });
    },

    handlePasteLogo: async function() {
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    const blob = await item.getType(item.types.find(t => t.startsWith('image/')));
                    const url = URL.createObjectURL(blob);
                    
                    const placeholder = document.getElementById('welcome-text-placeholder');
                    const mainImg = document.getElementById('main-logo-img');
                    if (placeholder) placeholder.classList.add('hidden');
                    if (mainImg) {
                        mainImg.src = url;
                        mainImg.classList.remove('hidden');
                    }

                    const subLogos = document.querySelectorAll('.secondary-logo-img');
                    subLogos.forEach(img => {
                        img.src = url;
                        img.classList.remove('hidden');
                    });
                }
            }
        } catch (err) {
            alert('క్లిప్‌బోర్డ్ నుండి ఇమేజ్ కాపీ చేసి రండి.');
        }
    },

    resizeLogo: function(dimension, value) {
        const logo = document.getElementById('main-logo-img');
        if (!logo) return;
        if (dimension === 'height') {
            logo.style.height = value + 'px';
        } else if (dimension === 'width') {
            logo.style.width = value + 'px';
        }
    },

    toggleReporterAd: function(enable) {
        const box = document.getElementById('reporter-ad-box');
        if (!box) return;
        if (enable) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    },

    toggleSuktiBox: function(enable) {
        const box = document.getElementById('sukti-box');
        if (!box) return;
        if (enable) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    },

    updateSuktiContent: function(title, text) {
        const t = document.getElementById('sukti-title');
        const b = document.getElementById('sukti-text');
        if (t && title) t.innerText = title;
        if (b && text) b.innerText = text;
    },

    setSuktiColors: function(color, bgColor) {
        const box = document.getElementById('sukti-box');
        if (!box) return;
        if (color) box.style.color = color;
        if (bgColor) box.style.backgroundColor = bgColor;
    },

    updateHeadline: function(text) {
        if (!this.selectedCard) {
            alert('దయచేసి ముందుగా ఒక వార్తను ఎంచుకోండి.');
            return;
        }
        let headline = this.selectedCard.querySelector('.news-headline');
        if (!headline) {
            headline = document.createElement('h3');
            headline.className = 'news-headline';
            this.selectedCard.prepend(headline);
        }
        headline.innerText = text;
    },

    setHeadlineStyle: function(fontFamily, color, bgColor) {
        if (!this.selectedCard) return;
        const headline = this.selectedCard.querySelector('.news-headline');
        if (!headline) return;
        if (fontFamily) headline.style.fontFamily = fontFamily;
        if (color) headline.style.color = color;
        if (bgColor) headline.style.backgroundColor = bgColor;
    },

    updateSubHeadline: function(text) {
        if (!this.selectedCard) return;
        let sub = this.selectedCard.querySelector('.news-subheadline');
        if (!sub) {
            sub = document.createElement('div');
            sub.className = 'news-subheadline';
            const headline = this.selectedCard.querySelector('.news-headline');
            if (headline) headline.after(sub);
            else this.selectedCard.prepend(sub);
        }
        sub.innerText = text;
    },

    setSubHeadlineStyle: function(fontFamily, color, bgColor, bullet, underline) {
        if (!this.selectedCard) return;
        const sub = this.selectedCard.querySelector('.news-subheadline');
        if (!sub) return;
        if (fontFamily) sub.style.fontFamily = fontFamily;
        if (color) sub.style.color = color;
        if (bgColor) sub.style.backgroundColor = bgColor;
        if (bullet) sub.innerText = bullet + ' ' + sub.innerText.replace(/^[●■◆▲★❖]\s*/, '');
        if (underline) sub.style.borderBottom = underline;
    },

    updateDateline: function(text) {
        if (!this.selectedCard) return;
        let dl = this.selectedCard.querySelector('.news-dateline');
        if (!dl) {
            dl = document.createElement('div');
            dl.className = 'news-dateline';
            this.selectedCard.appendChild(dl);
        }
        dl.innerText = text;
        dl.style.color = 'red';
        dl.style.fontWeight = 'bold';
    },

    updateBodyText: function(text) {
        if (!this.selectedCard) return;
        let body = this.selectedCard.querySelector('.news-body');
        if (!body) {
            body = document.createElement('div');
            body.className = 'news-body';
            this.selectedCard.appendChild(body);
        }
        body.innerText = text;
    },

    uploadPhotoToCard: async function() {
        if (!this.selectedCard) {
            alert('దయచేసి ఫోటో అప్‌లోడ్ చేయడానికి వార్తను ఎంచుకోండి.');
            return;
        }
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                    const blob = await item.getType(item.types.find(t => t.startsWith('image/')));
                    const url = URL.createObjectURL(blob);
                    
                    const existingImgs = this.selectedCard.querySelectorAll('img');
                    if (existingImgs.length >= 3) {
                        alert('ఒక వార్తలో గరిష్టంగా 3 ఫోటోలు మాత్రమే అనుమతించబడతాయి.');
                        return;
                    }

                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'news-card-photo photo-medium';
                    img.onclick = function(e) {
                        e.stopPropagation();
                        ToolbarEngineModule.selectImage(img);
                    };
                    this.selectedCard.prepend(img);
                }
            }
        } catch (err) {
            alert('క్లిప్‌బోర్డ్ నుండి ఇమేజ్ కాపీ చేయండి.');
        }
    },

    selectImage: function(imgElement) {
        const allImgs = document.querySelectorAll('.news-card-photo');
        allImgs.forEach(i => i.classList.remove('selected-img'));
        imgElement.classList.add('selected-img');
        this.selectedImg = imgElement;
    },

    applyPhotoShape: function(shapeClass) {
        if (!this.selectedImg) {
            alert('దయచేసి ముందుగా ఫోటోపై క్లిక్ చేసి ఎంచుకోండి.');
            return;
        }
        this.selectedImg.className = 'news-card-photo photo-medium ' + shapeClass;
    },

    toggleEditorDetails: function(enable) {
        const pages = document.querySelectorAll('.newspaper-page');
        const lastPage = pages[pages.length - 1];
        if (!lastPage) return;

        const pageNum = lastPage.getAttribute('data-page-number');
        const editorBox = document.getElementById('editor-details-container-' + pageNum);
        const bulletBox = document.getElementById('editor-bullet-container-' + pageNum);

        if (editorBox && bulletBox) {
            if (enable) {
                editorBox.classList.remove('hidden');
                bulletBox.classList.add('hidden');
            } else {
                editorBox.classList.add('hidden');
                bulletBox.classList.remove('hidden');
            }
        }
    },

    deleteSelectedCard: function() {
        if (this.selectedCard) {
            this.selectedCard.remove();
            this.selectedCard = null;
        }
    }
};

if (typeof window !== 'undefined') {
    window.ToolbarEngineModule = ToolbarEngineModule;
}
