import { useEffect, useState, useRef } from "react";
import CV from "../CVComps/cv";
import '../../styles/spaces.css'
import '../../styles/modals.css'
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, ExternalHyperlink, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";


export default function WorkSpace() {
    const [size, setSize] = useState('8.5x11')
    const [preview, setPreview] = useState(false)
    const [downloadFormat, setDownloadFormat] = useState('docx');
    const cvRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSections, setSelectedSections] = useState({
        projects: true,
        experience: true,
        education: true,
    });
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedSections((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const openInfo = () => {
        setIsInfoOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeInfo = () => {
        setIsInfoOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    function showPreview() {
        const panel = document.querySelector('.cv-panel')
        const cvBTN = panel.querySelectorAll('button')
        cvBTN.forEach(btn => {
            if (preview) {
                btn.style.display = 'none'
            } else {
                btn.style.display = 'inline-block'
            }
        })
    }

    useEffect(showPreview, [preview])

    function handlePrevChange() {
        setPreview(!preview)
    }

    function handleDownloadFormatChange(e) {
        setDownloadFormat(e.target.value);
    }


    function handleSizeChange(e) {
        setSize(e.target.value)
    }

    function resizePage() {
        const panel = document.querySelector('.cv-panel')
        const resize = size.split('x')

        const workPanel = document.querySelector('.work-space')
        let workWidth = workPanel.clientWidth

        let multiplicate = (96 * workWidth) / 820
        panel.style.width = (resize[0] * multiplicate) + 'px'
        panel.style.minHeight = (resize[1] * multiplicate) + 'px'
    }

    useEffect(resizePage, [size])

    window.addEventListener('resize', resizePage)


    function toggleCVButtons(show) {
        if (!cvRef.current) return;
        const buttons = cvRef.current.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.display = show ? 'inline-block' : 'none';
        });
    }


    // Map state size to jsPDF format string for html2pdf
    function mapSizeToFormat(size) {
        switch (size) {
            case '8.5x11':
                return 'letter';
            case '8.27x11.69':
                return 'a4';
            default:
                return 'letter';
        }
    }

    // Handler to download CV content as PDF
    async function handleDownloadPDF() {
        if (!cvRef.current) return;
        const element = cvRef.current;

        toggleCVButtons(false);
        const panel = document.querySelector('.cv-panel')
        const resize = size.split('x')
        panel.style.width = (resize[0] * 96) + 'px'
        panel.style.minHeight = (resize[1] * 96) + 'px'


        const pdfFormat = mapSizeToFormat(size);

        const opt = {
            margin: 0,
            filename: 'CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3.5, letterRendering: true, useCORS: true },
            jsPDF: { unit: 'in', format: pdfFormat, orientation: 'portrait' }
        };
        try {
            await html2pdf().set(opt).from(element).save();
        } catch (e) {
            console.error('Error generating PDF:', e);
        }

        toggleCVButtons(true);
        resizePage()
    }

    // Handler to download CV content as Word
    async function handleDownloadWord() {
        if (!cvRef.current) return;
        const element = cvRef.current;

        toggleCVButtons(false);

        const children = [];

        function addContentToDoc(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Sección Info (cv-contact) 
                if (node.classList.contains('cv-contact')) {
                    node.childNodes.forEach(child => {
                        if (child.tagName === 'H2') {
                            children.push(new Paragraph({
                                children: [new TextRun({
                                    text: child.innerText,
                                    bold: true,
                                    size: 40, // 20 pts
                                    color: "000000",
                                })],
                                spacing: { after: 0 },
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.tagName === 'HR') {
                            children.push(new Paragraph({
                                children: [new TextRun({ text: "" })],
                                border: {
                                    bottom: {
                                        color: "auto",
                                        space: 1,
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                    }
                                },
                                spacing: { after: 175 },
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.tagName === 'P') {

                            const paragraph = new Paragraph({
                                spacing: { after: 400 },
                                alignment: AlignmentType.CENTER,
                            });

                            // Función recursiva para procesar todos los nodos hijos
                            const processNode = (node) => {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    // Agregar texto normal
                                    if (node.textContent.trim()) {
                                        paragraph.addChildElement(new TextRun({
                                            text: node.textContent,
                                            size: 24,
                                            color: "000000",
                                        }));
                                    }
                                } else if (node.nodeType === Node.ELEMENT_NODE) {
                                    if (node.tagName === 'A') {
                                        // Crear hipervínculo
                                        paragraph.addChildElement(
                                            new ExternalHyperlink({
                                                children: [new TextRun({
                                                    text: node.textContent,
                                                    size: 24,
                                                    color: "222222",
                                                    underline: true,
                                                })],
                                                link: node.getAttribute('href')
                                            })
                                        );
                                    } else {
                                        // Procesar otros elementos (como SPAN) recursivamente
                                        node.childNodes.forEach(childNode => processNode(childNode));
                                    }
                                }
                            };
                            // Procesar todos los nodos hijos del párrafo
                            child.childNodes.forEach(childNode => processNode(childNode));
                            children.push(paragraph);
                        }
                    });
                    return;
                }

                // Sección Info (cv-contact)
                if (node.classList.contains('cv-projects')) {
                    node.childNodes.forEach(child => {
                        if (child.tagName === 'H2') {
                            children.push(new Paragraph({
                                children: [new TextRun({
                                    text: child.innerText.toUpperCase(),
                                    bold: true,
                                    size: 24, // 12 pts
                                    color: "000000",
                                })],
                                spacing: { after: 20 }, // espacio reducido
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.tagName === 'HR') {
                            children.push(new Paragraph({
                                children: [new TextRun({ text: "" })],
                                border: {
                                    bottom: {
                                        color: "auto",
                                        space: 1,
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                    }
                                },
                                spacing: { before: 0, after: 75 },
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.classList && child.classList.contains('cv-projects-list')) {
                            child.childNodes.forEach(project => {
                                if (project.classList && project.classList.contains('cv-projects-list-project')) {
                                    project.childNodes.forEach(projectChild => {
                                        if (projectChild.classList && projectChild.classList.contains('cv-projects-list-project-header')) {
                                            const h3 = projectChild.querySelector('h3');
                                            if (h3) {
                                                children.push(new Paragraph({
                                                    children: [new TextRun({
                                                        text: h3.innerText.toUpperCase(),
                                                        bold: true,
                                                        size: 24, // 12 pts
                                                        color: "000000",
                                                    })],
                                                    spacing: { after: 150 },
                                                    alignment: AlignmentType.LEFT,
                                                }));
                                            }
                                        } else if (projectChild.classList && projectChild.classList.contains('cv-projects-list-project-data')) {
                                            projectChild.childNodes.forEach(data => {
                                                if (data.className === 'cv-projects-list-project-data-technologies') {
                                                    children.push(new Paragraph({
                                                        children: [
                                                            new TextRun({
                                                                text: data.innerText,
                                                                size: 24,
                                                                bold: true,
                                                                italics: true,
                                                                color: "000000",
                                                            }),
                                                        ],
                                                        spacing: { after: 150 },
                                                        alignment: AlignmentType.LEFT,
                                                    }))
                                                } else if (data.className === 'cv-projects-list-project-data-description') {
                                                    children.push(new Paragraph({
                                                        children: [
                                                            new TextRun({
                                                                text: data.innerText,
                                                                size: 24,
                                                                color: "000000",
                                                            }),
                                                        ],
                                                        spacing: { before: 150, line: 360 },
                                                        alignment: AlignmentType.JUSTIFIED,
                                                    }));
                                                } else if (data.className === 'cv-projects-list-project-data-link') {

                                                    const linkElement = data.querySelector('a');
                                                    const spanElement = data.querySelector('span');
                                                    if (linkElement) {
                                                        const url = linkElement.getAttribute('href');
                                                        const linkText = linkElement.textContent;
                                                        // Crear un hipervínculo en el documento Word
                                                        const hyperlink = new ExternalHyperlink({
                                                            link: url,
                                                            children: [new TextRun({
                                                                text: linkText,
                                                                size: 24,
                                                                color: "222222", // Color azul para el hipervínculo
                                                                underline: true, // Subrayar el texto del hipervínculo
                                                            })],
                                                        });

                                                        children.push(new Paragraph({
                                                            children: [new TextRun({
                                                                text: spanElement.textContent,
                                                                size: 24,
                                                                color: "000000",
                                                            }), hyperlink],
                                                            spacing: { after: 300 },
                                                            alignment: AlignmentType.JUSTIFIED,
                                                        }));
                                                    } else {
                                                        // Si no hay un enlace, simplemente agrega el texto
                                                        children.push(new Paragraph({
                                                            children: [
                                                                new TextRun({
                                                                    text: data.innerText,
                                                                    size: 24,
                                                                    color: "000000",
                                                                }),
                                                            ],
                                                            spacing: { after: 300 },
                                                            alignment: AlignmentType.JUSTIFIED,
                                                        }));
                                                    }

                                                }

                                            })
                                        }
                                    })
                                }

                            })
                        }

                    })
                    children.push(new Paragraph({
                        text: "",
                        spacing: { after: 100 },
                    }));

                    return;
                }

                // Sección Educación (cv-education)
                if (node.classList.contains('cv-education')) {
                    node.childNodes.forEach(child => {
                        if (child.tagName === 'H2') {
                            children.push(new Paragraph({
                                children: [new TextRun({
                                    text: child.innerText.toUpperCase(),
                                    bold: true,
                                    size: 24, // 12 pts
                                    color: "000000",
                                })],
                                spacing: { after: 20 }, // espacio reducido
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.tagName === 'HR') {
                            children.push(new Paragraph({
                                children: [new TextRun({ text: "" })],
                                border: {
                                    bottom: {
                                        color: "auto",
                                        space: 1,
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                    }
                                },
                                spacing: { before: 0, after: 75 },
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.classList && child.classList.contains('cv-education-list')) {
                            child.childNodes.forEach(study => {
                                if (study.classList && study.classList.contains('cv-education-list-study')) {
                                    study.childNodes.forEach(studyChild => {
                                        if (studyChild.classList && studyChild.classList.contains('cv-education-list-study-header')) {
                                            const h3 = studyChild.querySelector('h3');
                                            if (h3) {
                                                children.push(new Paragraph({
                                                    children: [new TextRun({
                                                        text: h3.innerText.toUpperCase(),
                                                        bold: true,
                                                        size: 24, // 12 pts
                                                        color: "000000",
                                                    })],
                                                    spacing: { after: 150 },
                                                    alignment: AlignmentType.LEFT,
                                                }));
                                            }
                                        } else if (studyChild.classList && studyChild.classList.contains('cv-education-list-study-data')) {
                                            studyChild.childNodes.forEach(dataChild => {
                                                if (dataChild.tagName === 'SPAN') {
                                                    // Aquí se maneja el span de la escuela
                                                    const schoolText = dataChild.innerText;
                                                    const dateText = dataChild.nextSibling.innerText; // Asumiendo que el siguiente es el span de la fecha

                                                    // Crear una tabla de 1 fila y 2 columnas
                                                    const table = new Table({
                                                        width: {
                                                            size: 100,
                                                            type: WidthType.PERCENTAGE,
                                                        },
                                                        borders: {
                                                            top: { style: BorderStyle.NONE },
                                                            bottom: { style: BorderStyle.NONE },
                                                            left: { style: BorderStyle.NONE },
                                                            right: { style: BorderStyle.NONE },
                                                            insideHorizontal: { style: BorderStyle.NONE },
                                                            insideVertical: { style: BorderStyle.NONE },
                                                        },
                                                        rows: [
                                                            new TableRow({
                                                                children: [
                                                                    new TableCell({
                                                                        width: {
                                                                            size: 50,
                                                                            type: WidthType.PERCENTAGE,
                                                                        },
                                                                        children: [
                                                                            new Paragraph({
                                                                                children: [
                                                                                    new TextRun({
                                                                                        text: schoolText,
                                                                                        size: 24,
                                                                                        color: "000000",
                                                                                    }),
                                                                                ],
                                                                                alignment: AlignmentType.LEFT,
                                                                            }),
                                                                        ],
                                                                        borders: {
                                                                            top: { style: BorderStyle.NONE },
                                                                            bottom: { style: BorderStyle.NONE },
                                                                            left: { style: BorderStyle.NONE },
                                                                            right: { style: BorderStyle.NONE },
                                                                        },
                                                                    }),
                                                                    new TableCell({
                                                                        width: {
                                                                            size: 50,
                                                                            type: WidthType.PERCENTAGE,
                                                                        },
                                                                        children: [
                                                                            new Paragraph({
                                                                                children: [
                                                                                    new TextRun({
                                                                                        text: dateText,
                                                                                        size: 24,
                                                                                        color: "000000",
                                                                                    }),
                                                                                ],
                                                                                alignment: AlignmentType.RIGHT,
                                                                            }),
                                                                        ],
                                                                        borders: {
                                                                            top: { style: BorderStyle.NONE },
                                                                            bottom: { style: BorderStyle.NONE },
                                                                            left: { style: BorderStyle.NONE },
                                                                            right: { style: BorderStyle.NONE },
                                                                        },
                                                                    }),
                                                                ],
                                                            }),
                                                        ],
                                                    });


                                                    children.push(table);

                                                    children.push(new Paragraph({
                                                        text: "",
                                                        spacing: { after: 10 }, // aumentado espacio
                                                    }));
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    return;
                }

                // Sección Experiencia (cv-experience)
                if (node.classList.contains('cv-experience')) {
                    node.childNodes.forEach(child => {
                        if (child.tagName === 'H2') {
                            children.push(new Paragraph({
                                children: [new TextRun({
                                    text: child.innerText.toUpperCase(),
                                    bold: true,
                                    size: 24, // 12 pts
                                    color: "000000",
                                })],
                                spacing: { after: 20 },
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.tagName === 'HR') {
                            children.push(new Paragraph({
                                children: [new TextRun({ text: "" })],
                                border: {
                                    bottom: {
                                        color: "auto",
                                        space: 1,
                                        style: BorderStyle.SINGLE,
                                        size: 6,
                                    }
                                },
                                spacing: { before: 0, after: 75 },
                                alignment: AlignmentType.CENTER,
                            }));
                        } else if (child.classList && child.classList.contains('cv-experience-list')) {
                            child.childNodes.forEach(panel => {
                                if (panel.classList && panel.classList.contains('cv-experience-list-panel')) {
                                    const companyHeader = panel.querySelector('.cv-experience-list-panel-head h3');
                                    if (companyHeader) {
                                        children.push(new Paragraph({
                                            children: [new TextRun({
                                                text: companyHeader.innerText.toUpperCase(),
                                                bold: true,
                                                size: 24,
                                                color: "000000",
                                            })],
                                            spacing: { after: 150 },
                                            alignment: AlignmentType.LEFT,
                                        }));
                                    }

                                    const positionEntries = panel.querySelectorAll('.cv-experience-list-panel-list-data');
                                    positionEntries.forEach(entry => {
                                        const positionSpan = entry.querySelector('.cv-experience-list-panel-list-data-head-position');
                                        const timeSpan = entry.querySelector('.cv-experience-list-panel-list-data-head-time');
                                        const descriptionSpan = entry.querySelector('.cv-experience-list-panel-list-data-description');

                                        if (positionSpan && timeSpan) {
                                            const positionText = positionSpan.innerText;
                                            const timeText = timeSpan.innerText;

                                            const table = new Table({
                                                width: {
                                                    size: 100,
                                                    type: WidthType.PERCENTAGE,
                                                },
                                                borders: {
                                                    top: { style: BorderStyle.NONE },
                                                    bottom: { style: BorderStyle.NONE },
                                                    left: { style: BorderStyle.NONE },
                                                    right: { style: BorderStyle.NONE },
                                                    insideHorizontal: { style: BorderStyle.NONE },
                                                    insideVertical: { style: BorderStyle.NONE },
                                                },
                                                rows: [
                                                    new TableRow({
                                                        children: [
                                                            new TableCell({
                                                                width: {
                                                                    size: 50,
                                                                    type: WidthType.PERCENTAGE,
                                                                },
                                                                children: [
                                                                    new Paragraph({
                                                                        children: [
                                                                            new TextRun({
                                                                                text: positionText,
                                                                                size: 24,
                                                                                bold: true,
                                                                                italics: true,
                                                                                color: "000000",
                                                                            }),
                                                                        ],
                                                                        alignment: AlignmentType.LEFT,
                                                                    }),
                                                                ],
                                                                borders: {
                                                                    top: { style: BorderStyle.NONE },
                                                                    bottom: { style: BorderStyle.NONE },
                                                                    left: { style: BorderStyle.NONE },
                                                                    right: { style: BorderStyle.NONE },
                                                                },
                                                            }),
                                                            new TableCell({
                                                                width: {
                                                                    size: 50,
                                                                    type: WidthType.PERCENTAGE,
                                                                },
                                                                children: [
                                                                    new Paragraph({
                                                                        children: [
                                                                            new TextRun({
                                                                                text: timeText,
                                                                                size: 24,
                                                                                color: "000000",
                                                                            }),
                                                                        ],
                                                                        alignment: AlignmentType.RIGHT,
                                                                    }),
                                                                ],
                                                                borders: {
                                                                    top: { style: BorderStyle.NONE },
                                                                    bottom: { style: BorderStyle.NONE },
                                                                    left: { style: BorderStyle.NONE },
                                                                    right: { style: BorderStyle.NONE },
                                                                },
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                            });
                                            children.push(table);
                                        }

                                        if (descriptionSpan) {
                                            children.push(new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: descriptionSpan.innerText,
                                                        size: 24,
                                                        color: "000000",
                                                    }),
                                                ],
                                                spacing: { before: 150, after: 200, line: 360 },
                                                alignment: AlignmentType.JUSTIFIED,
                                            }));
                                        }
                                    });
                                }
                            });
                        }
                    });
                    children.push(new Paragraph({
                        text: "",
                        spacing: { after: 80 },
                    }));

                    return;
                }

                // Lógica general para otros nodos (como Experience)
                switch (node.tagName) {
                    case 'H2':
                        children.push(new Paragraph({
                            text: node.innerText,
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 200 },
                        }));
                        break;
                    case 'H3':
                        children.push(new Paragraph({
                            text: node.innerText,
                            heading: HeadingLevel.HEADING_3,
                            spacing: { after: 150 },
                        }));
                        break;
                    case 'P':
                    case 'SPAN':
                        children.push(new Paragraph({
                            text: node.innerText,
                            spacing: { after: 100 },
                        }));
                        break;
                    case 'HR':
                        children.push(new Paragraph({
                            children: [new TextRun({ text: "" })],
                            border: {
                                bottom: {
                                    color: "auto",
                                    space: 1,
                                    style: BorderStyle.SINGLE,
                                    size: 6,
                                }
                            },
                            spacing: { after: 200 },
                        }));
                        break;
                    default:
                        node.childNodes.forEach(child => addContentToDoc(child));
                        break;
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    children.push(new Paragraph({
                        text: text,
                        spacing: { after: 100 },
                    }));
                }
            }
        }

        element.childNodes.forEach(child => addContentToDoc(child));


        const pageSizeMap = {
            '8.5x11': { width: 12240, height: 15840 },  // Carta
            '8.27x11.69': { width: 11907, height: 16840 } // A4
        };

        const pageSize = pageSizeMap[size] || pageSizeMap['8.5x11'];

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        size: {
                            orientation: 'portrait',
                            width: pageSize.width,
                            height: pageSize.height,
                        }
                    }
                },
                children: children,
            }]
        });




        try {
            const blob = await Packer.toBlob(doc);
            saveAs(blob, "CV.docx");
        } catch (e) {
            console.error("Error generating Word document:", e);
        }

        toggleCVButtons(true);
    }

    function handleDownload() {
        if (downloadFormat === 'pdf') {
            handleDownloadPDF();
        } else if (downloadFormat === 'docx') {
            handleDownloadWord();
        }
    }

    return (
        <main className="work-space" id="workSpace">

            <button onClick={openInfo} className="btn-info">
                <ion-icon name="information-outline"></ion-icon>
            </button>

            <button onClick={openModal} className="btn-sections">Add Sections</button>

            <div className="head-buttons">
                <label>
                    <input type="checkbox" checked={preview} id="preview" onChange={handlePrevChange} />
                    <span><span>Preview</span> <span>(Disable buttons)</span></span>
                </label>
                <label>
                    <span>Size:</span>
                    <select id="pageSize" value={size} onChange={handleSizeChange}>
                        <option value="8.5x11">Letter</option>
                        <option value="8.27x11.69">A4</option>

                    </select>
                </label>
            </div>

            <div className="cv-parent" ref={cvRef}>
                <CV selectedSections={selectedSections} />
            </div>


            <div className="bottom-buttons">
                <span>Download as: </span>
                <div className="buttons">
                    <select name="file" value={downloadFormat} onChange={handleDownloadFormatChange}>
                        <option value="docx">WORD</option>
                        <option value="pdf">PDF</option>
                    </select>
                    <button onClick={handleDownload}>Download</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal show-sections">
                    <h2>Sections</h2>

                    <form className="input-group">
                        <label>
                            <input
                                type="checkbox"
                                name="projects"
                                checked={selectedSections.projects}
                                onChange={handleCheckboxChange}
                            />
                            <span>Personal Projects</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="experience"
                                checked={selectedSections.experience}
                                onChange={handleCheckboxChange}
                            />
                            <span>Practical Experience</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="education"
                                checked={selectedSections.education}
                                onChange={handleCheckboxChange}
                            />
                            <span>Education</span>
                        </label>
                    </form>

                    <button
                        onClick={closeModal}
                    >
                        Close
                    </button>
                </div>
            )}

            {isInfoOpen && (
                <div className="modal show-info">
                    <h2>About your Downloads</h2>

                    <p>
                        Don't worry about how your CV content looks in the preview due to font and page size. When you download your CV, the sizes and proportions will automatically adjust to the actual dimensions, and it will look perfect. Focus solely on filling out your CV with the information you need. <br />
                    </p>
                    <span>GOOD LUCK!</span>

                    <button
                        onClick={closeInfo}
                    >
                        Close
                    </button>
                </div>
            )}
        </main>
    )
}










