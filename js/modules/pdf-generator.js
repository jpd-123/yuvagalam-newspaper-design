// js/modules/pdf-generator.js

const PdfGeneratorModule = {
    downloadPdf: function(type, targetMb) {
        const canvas = document.getElementById('paper-canvas');
        if (!canvas) return;

        let qualityVal = 1.0;
        if (type === 'social') {
            const mb = parseFloat(targetMb) || 5;
            qualityVal = Math.min(Math.max(mb / 100, 0.2), 1.0);
        }

        const opt = {
            margin: 0,
            filename: 'Satvika_Publisher_' + type + '.pdf',
            image: { type: 'jpeg', quality: qualityVal },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
        };

        if (window.html2pdf) {
            window.html2pdf().set(opt).from(canvas).save();
        } else {
            alert('PDF జనరేటర్ లైబ్రరీ అందుబాటులో లేదు.');
        }
    }
};

if (typeof window !== 'undefined') {
    window.PdfGeneratorModule = PdfGeneratorModule;
}
