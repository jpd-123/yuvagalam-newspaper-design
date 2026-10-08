// js/config/colors.js

const ConfigData = {
    darkColors: [
        "#D32F2F", "#C2185B", "#7B1FA2", "#512DA8", "#303F9F",
        "#1976D2", "#00796B", "#388E3C", "#E64A19", "#5D4037"
    ],
    lightColors: [
        "#FFEBEE", "#FCE4EC", "#F3E5F5", "#EDE7F6", "#E8EAF6",
        "#E3F2FD", "#E0F2F1", "#E8F5E9", "#FBE9E7", "#EFEBE9"
    ],
    fonts: [
        "Mandali", "Gidugu", "Arial", "sans-serif", "Ramabhadra", 
        "NTR", "Suranna", "Mallanna", "Peddana", "Raviprakash", 
        "Sree Krushnadevaraya", "Gurazada"
    ],
    bullets: ["●", "■", "◆", "▲", "★", "❖"],
    underlines: ["solid 2px", "double 3px"]
};

if (typeof window !== 'undefined') {
    window.ConfigData = ConfigData;
}
