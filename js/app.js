/**
 * సాత్విక పబ్లిషర్
 * Main Application Bootstrap
 * File: js/app.js
 *
 * బాధ్యతలు:
 * 1. Welcome screen నుంచి Workspace తెరవడం
 * 2. Mobile / Desktop వీక్షణ నిర్వహణ
 * 3. Master / Daily workspace ఎంపిక
 * 4. పేజీల సంఖ్య నిర్వహణ
 * 5. సెట్టింగులను LocalStorageలో భద్రపరచడం
 * 6. మాస్టర్ లేఅవుట్‌లను లోడ్ చేయడం
 * 7. PDF Exportకు ప్రాథమిక అనుసంధానం
 */

(() => {
    "use strict";

    const APP_NAME = "సాత్విక పబ్లిషర్";

    const STORAGE_KEY = "satvika_publisher_app_settings";
    const MASTER_LAYOUTS_KEY = "satvika_master_layouts";

    const state = {
        initialized: false,
        opened: false,
        deviceMode: "laptop",
        workspaceMode: "master",
        paperSize: "A3",
        pageCount: 4,
        selectedPage: 1,
        masterLayouts: []
    };

    const $ = (id) => document.getElementById(id);

    // --------------------------------------------------
    // 1. సందేశాలు
    // --------------------------------------------------

    function setStatus(message, type = "info") {
        const status = $("app-status");

        if (status) {
            status.textContent = message;
            status.dataset.statusType = type;
        }

        console.info(`[${APP_NAME}] ${message}`);
    }

    function setWelcomeStatus(message) {
        const status = $("welcome-status");

        if (status) {
            status.textContent = message;
        }

        if (message) {
            console.info(`[${APP_NAME}] ${message}`);
        }
    }

    // --------------------------------------------------
    // 2. LocalStorage భద్రత
    // --------------------------------------------------

    function readJSON(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.error(`నిల్వ చేసిన డేటా చదవడంలో సమస్య: ${key}`, error);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`డేటా సేవ్ చేయడంలో సమస్య: ${key}`, error);

            setStatus(
                "సెట్టింగులు సేవ్ కాలేదు. బ్రౌజర్ నిల్వను తనిఖీ చేయండి.",
                "error"
            );

            return false;
        }
    }

    // --------------------------------------------------
    // 3. సెట్టింగులు లోడ్ చేయడం
    // --------------------------------------------------

    function loadSettings() {
        const saved = readJSON(STORAGE_KEY, {});

        if (!saved || typeof saved !== "object") {
            return;
        }

        const paperSize = $("paper-size");

        if (
            paperSize &&
            typeof saved.paperSize === "string"
        ) {
            const optionExists = Array.from(paperSize.options)
                .some((option) => option.value === saved.paperSize);

            if (optionExists) {
                paperSize.value = saved.paperSize;
            }
        }

        const pageCount = $("page-count");

        if (pageCount) {
            const count = Number(saved.pageCount);

            if (
                Number.isInteger(count) &&
                count >= 1 &&
                count <= 16
            ) {
                pageCount.value = String(count);
            }
        }

        const workspaceMode = $("workspace-mode");

        if (
            workspaceMode &&
            ["master", "daily"].includes(saved.workspaceMode)
        ) {
            const optionExists = Array.from(workspaceMode.options)
                .some((option) => option.value === saved.workspaceMode);

            if (optionExists) {
                workspaceMode.value = saved.workspaceMode;
            }
        }

        if (
            saved.branding &&
            typeof saved.branding === "object"
        ) {
            const brandingFields = {
                "newspaper-name": saved.branding.newspaperName,
                "volume-number": saved.branding.volumeNumber,
                "issue-number": saved.branding.issueNumber,
                "publication-day": saved.branding.publicationDay,
                "publication-date": saved.branding.publicationDate,
                "cover-price": saved.branding.coverPrice,
                "quote-heading": saved.branding.quoteHeading,
                "quote-text": saved.branding.quoteText
            };

            Object.entries(brandingFields).forEach(([id, value]) => {
                const element = $(id);

                if (element && value !== undefined) {
                    element.value = value;
                }
            });
        }
    }

    function saveSettings() {
        const settings = {
            paperSize: $("paper-size")?.value || state.paperSize,

            pageCount: Number(
                $("page-count")?.value || state.pageCount
            ),

            workspaceMode:
                $("workspace-mode")?.value || state.workspaceMode,

            branding: {
                newspaperName:
                    $("newspaper-name")?.value || "యువగళం",

                volumeNumber:
                    $("volume-number")?.value || "1",

                issueNumber:
                    $("issue-number")?.value || "1",

                publicationDay:
                    $("publication-day")?.value || "",

                publicationDate:
                    $("publication-date")?.value || "",

                coverPrice:
                    $("cover-price")?.value || "₹5",

                quoteHeading:
                    $("quote-heading")?.value || "మంచి మాట",

                quoteText:
                    $("quote-text")?.value || ""
            }
        };

        return writeJSON(STORAGE_KEY, settings);
    }

    // --------------------------------------------------
    // 4. పరికరం గుర్తించడం
    // --------------------------------------------------

    function detectDevice() {
        state.deviceMode = window.matchMedia("(max-width: 767px)").matches
            ? "mobile"
            : "laptop";

        document.documentElement.dataset.deviceMode = state.deviceMode;

        return state.deviceMode;
    }

    function updateDeviceView() {
        detectDevice();

        const desktop = $("desktop-workspace");
        const mobile = $("mobile-workspace");

        if (!state.opened) {
            return;
        }

        if (state.deviceMode === "mobile") {
            if (desktop) {
                desktop.classList.add("hidden");
            }

            if (mobile) {
                mobile.classList.remove("hidden");
            }
        } else {
            if (mobile) {
                mobile.classList.add("hidden");
            }

            if (desktop) {
                desktop.classList.remove("hidden");
            }
        }

        document.dispatchEvent(
            new CustomEvent("satvika:device-mode-changed", {
                detail: {
                    mode: state.deviceMode
                }
            })
        );
    }

    // --------------------------------------------------
    // 5. Workspace తెరవడం
    // --------------------------------------------------

    function openWorkspace() {
        const welcome = $("welcome-screen");
        const shell = $("app-shell");

        if (!welcome || !shell) {
            setWelcomeStatus(
                "అవసరమైన HTML అంశాలు కనిపించలేదు. index.htmlలో welcome-screen, app-shell IDలను తనిఖీ చేయండి."
            );

            console.error(
                "Satvika Publisher: welcome-screen లేదా app-shell ID లేదు."
            );

            return;
        }

        state.opened = true;

        welcome.classList.add("hidden");
        shell.classList.remove("hidden");

        updateWorkspaceMode();
        updatePageOptions();
        updateDeviceView();

        setWelcomeStatus("");

        setStatus("వర్క్‌స్పేస్ విజయవంతంగా తెరుచుకుంది.");

        document.dispatchEvent(
            new CustomEvent("satvika:workspace-opened", {
                detail: {
                    deviceMode: state.deviceMode,
                    workspaceMode: state.workspaceMode
                }
            })
        );
    }

    // --------------------------------------------------
    // 6. Master / Daily Workspace
    // --------------------------------------------------

    function updateWorkspaceMode() {
        const selector = $("workspace-mode");

        state.workspaceMode =
            selector?.value === "daily" ? "daily" : "master";

        const title = $("workspace-title");

        if (title) {
            title.textContent =
                state.workspaceMode === "daily"
                    ? "రోజువారీ ఎడిషన్"
                    : "మాస్టర్ లేఅవుట్";
        }

        document.querySelectorAll(".master-only-tool")
            .forEach((element) => {
                element.hidden = state.workspaceMode === "daily";
            });

        saveSettings();

        document.dispatchEvent(
            new CustomEvent("satvika:workspace-mode-changed", {
                detail: {
                    mode: state.workspaceMode
                }
            })
        );
    }

    // --------------------------------------------------
    // 7. పేజీల సంఖ్య
    // --------------------------------------------------

    function rebuildPageSelect(select, total, selected) {
        if (!select) {
            return;
        }

        const previous = Number(selected) || 1;
        const fragment = document.createDocumentFragment();

        for (let page = 1; page <= total; page++) {
            const option = document.createElement("option");

            option.value = String(page);
            option.textContent = `పేజీ ${page}`;

            fragment.appendChild(option);
        }

        select.replaceChildren(fragment);
        select.value = String(Math.min(previous, total));
    }

    function updatePageOptions() {
        const pageCountElement = $("page-count");

        const requested = Number(
            pageCountElement?.value || state.pageCount
        );

        state.pageCount =
            Number.isInteger(requested) &&
            requested >= 1 &&
            requested <= 16
                ? requested
                : 4;

        state.selectedPage = Math.min(
            state.selectedPage,
            state.pageCount
        );

        rebuildPageSelect(
            $("selected-page"),
            state.pageCount,
            state.selectedPage
        );

        rebuildPageSelect(
            $("mobile-page-number"),
            state.pageCount,
            state.selectedPage
        );

        saveSettings();

        document.dispatchEvent(
            new CustomEvent("satvika:page-count-changed", {
                detail: {
                    pageCount: state.pageCount
                }
            })
        );
    }

    function onSelectedPageChange(event) {
        const page = Number(event.target.value);

        if (
            Number.isInteger(page) &&
            page >= 1 &&
            page <= state.pageCount
        ) {
            state.selectedPage = page;

            const mobileSelect = $("mobile-page-number");
            const desktopSelect = $("selected-page");

            if (mobileSelect && event.target !== mobileSelect) {
                mobileSelect.value = String(page);
            }

            if (desktopSelect && event.target !== desktopSelect) {
                desktopSelect.value = String(page);
            }

            document.dispatchEvent(
                new CustomEvent("satvika:selected-page-changed", {
                    detail: {
                        pageNumber: page
                    }
                })
            );
        }
    }

    // --------------------------------------------------
    // 8. Master Layouts
    // --------------------------------------------------

    function loadMasterLayouts() {
        const layouts = readJSON(MASTER_LAYOUTS_KEY, []);

        state.masterLayouts = Array.isArray(layouts) ? layouts : [];

        populateMasterLayoutOptions();

        return state.masterLayouts;
    }

    function populateMasterLayoutOptions() {
        const selectors = [
            $("mobile-master-layout"),
            $("master-layout-select")
        ].filter(Boolean);

        selectors.forEach((select) => {
            const currentValue = select.value;

            select.replaceChildren();

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "మాస్టర్ లేఅవుట్ ఎంచుకోండి";

            select.appendChild(defaultOption);

            state.masterLayouts.forEach((layout, index) => {
                if (!layout || typeof layout !== "object") {
                    return;
                }

                const option = document.createElement("option");

                option.value = String(
                    layout.id ?? layout.name ?? index
                );

                option.textContent =
                    layout.name ||
                    layout.title ||
                    `లేఅవుట్ ${index + 1}`;

                select.appendChild(option);
            });

            if (
                Array.from(select.options).some(
                    (option) => option.value === currentValue
                )
            ) {
                select.value = currentValue;
            }
        });
    }

    // --------------------------------------------------
    // 9. పేపర్ సైజు
    // --------------------------------------------------

    function onPaperSizeChange() {
        state.paperSize = $("paper-size")?.value || "A3";

        saveSettings();

        document.dispatchEvent(
            new CustomEvent("satvika:paper-size-changed", {
                detail: {
                    paperSize: state.paperSize
                }
            })
        );

        setStatus(
            `పేపర్ సైజు ${state.paperSize}గా ఎంచుకున్నారు. పేజీ పరిమాణం మార్పు కోసం సంబంధిత లేఅవుట్ ఇంజిన్ అనుసంధానం అవసరం.`
        );
    }

    // --------------------------------------------------
    // 10. PDF Export
    // --------------------------------------------------

    async function exportPrintPDF() {
        const canvas = $("paper-canvas");

        if (!canvas) {
            setStatus("పేపర్ క్యాన్వాస్ కనిపించలేదు.", "error");
            return;
        }

        if (!canvas.children.length) {
            setStatus(
                "PDF తయారు చేయడానికి క్యాన్వాస్‌లో పేజీలు లేవు.",
                "warning"
            );
            return;
        }

        if (typeof window.html2pdf !== "function") {
            setStatus(
                "PDF లైబ్రరీ లోడ్ కాలేదు. ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి.",
                "error"
            );
            return;
        }

        try {
            setStatus("ప్రింటింగ్ PDF తయారవుతోంది...");

            await window.html2pdf()
                .set({
                    margin: 0,
                    filename: "Satvika-Publisher-Print.pdf",
                    image: {
                        type: "jpeg",
                        quality: 0.95
                    },
                    html2canvas: {
                        scale: 2,
                        useCORS: true
                    },
                    jsPDF: {
                        unit: "mm",
                        format: state.paperSize.toLowerCase() === "a4"
                            ? "a4"
                            : "a3",
                        orientation: "portrait"
                    }
                })
                .from(canvas)
                .save();

            setStatus("PDF డౌన్‌లోడ్ పూర్తయింది.");
        } catch (error) {
            console.error("PDF export error:", error);

            setStatus(
                "PDF తయారీలో సమస్య వచ్చింది. క్యాన్వాస్, ఫోటోలు, PDF లైబ్రరీ తనిఖీ చేయండి.",
                "error"
            );
        }
    }

    // --------------------------------------------------
    // 11. Install Button
    // --------------------------------------------------

    function setupInstallButton() {
        let installPrompt = null;

        const button = $("install-app-button");

        if (!button) {
            return;
        }

        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            installPrompt = event;
            button.classList.remove("hidden");
        });

        button.addEventListener("click", async () => {
            if (!installPrompt) {
                setStatus(
                    "ప్రస్తుతం యాప్ ఇన్‌స్టాల్ ఎంపిక అందుబాటులో లేదు."
                );
                return;
            }

            try {
                installPrompt.prompt();
                await installPrompt.userChoice;
            } catch (error) {
                console.error("Install prompt error:", error);
            }

            installPrompt = null;
            button.classList.add("hidden");
        });
    }

    // --------------------------------------------------
    // 12. Service Worker
    // --------------------------------------------------

    function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            return;
        }

        window.addEventListener("load", async () => {
            try {
                await navigator.serviceWorker.register(
                    "./service-worker.js"
                );

                console.info(
                    `[${APP_NAME}] Service Worker నమోదు పూర్తయింది.`
                );
            } catch (error) {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            }
        });
    }

    // --------------------------------------------------
    // 13. Event Listeners
    // --------------------------------------------------

    function bindEvents() {
        const openButton = $("open-project-button");

        if (openButton) {
            openButton.addEventListener("click", (event) => {
                event.preventDefault();
                openWorkspace();
            });
        } else {
            console.error(
                "Satvika Publisher: open-project-button HTMLలో కనిపించలేదు."
            );
        }

        $("workspace-mode")?.addEventListener(
            "change",
            updateWorkspaceMode
        );

        $("page-count")?.addEventListener(
            "change",
            updatePageOptions
        );

        $("selected-page")?.addEventListener(
            "change",
            onSelectedPageChange
        );

        $("mobile-page-number")?.addEventListener(
            "change",
            onSelectedPageChange
        );

        $("paper-size")?.addEventListener(
            "change",
            onPaperSizeChange
        );

        $("export-pdf-button")?.addEventListener(
            "click",
            exportPrintPDF
        );

        $("print-pdf-button")?.addEventListener(
            "click",
            exportPrintPDF
        );

        window.addEventListener("resize", () => {
            updateDeviceView();
        });

        window.addEventListener("orientationchange", () => {
            updateDeviceView();
        });

        document.addEventListener(
            "satvika:master-layouts-updated",
            loadMasterLayouts
        );
    }

    // --------------------------------------------------
    // 14. ప్రారంభం
    // --------------------------------------------------

    function init() {
        if (state.initialized) {
            return;
        }

        state.initialized = true;

        detectDevice();
        loadSettings();
        loadMasterLa
