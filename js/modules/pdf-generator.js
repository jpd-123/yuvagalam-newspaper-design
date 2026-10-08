// js/modules/pdf-generator.js

const PdfGeneratorModule = {
    generatePdf: function(type, targetMb = 5) {
        const element = document.getElementById('paper-canvas');
        if (!element) return;

        let imgQuality = 1.0;
        if (type === 'social') {
            // MB పరిమాణాన్ని బట్టి ఇమేజ్ క్వాలిటీ మార్చడం (టెక్స్ట్ HD లోనే ఉంటుంది)
            imgQuality = Math.min(Math.max(targetMb / 100, 0.3), 1.0);
        }

        const options = {
            margin: 0,
            filename: `Satvika_Publisher_${type}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: imgQuality },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
        };

        if (window.html2pdf) {
            window.html2pdf().set(options).from(element).save();
        } else {
            alert('PDF లైబ్రరీ సరిగ్గా లోడ్ అవ్వలేదు.');
        }
    }
};

if (typeof window !== 'undefined') {
    window.PdfGeneratorModule = PdfGeneratorModule;
}
