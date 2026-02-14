const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, 
        PageNumber, LevelFormat, PageBreak, TableOfContents } = require('docx');
const fs = require('fs');

// Color scheme
const colors = {
  primary: "1A365D",
  secondary: "2D3748",
  accent: "4A5568",
  tableHeader: "E8EDF2",
  tableBg: "F7FAFC",
  highlight: "FFF3CD",
  weekend: "E6F7E6",
  exam: "FFEBEE",
  white: "FFFFFF"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E0" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const bulletRef = "bullet-list";
const numRef = "num-list";

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 0, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.accent, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: bulletRef, levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: numRef, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // Cover Page
    {
      properties: { page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
      children: [
        new Paragraph({ spacing: { before: 2500 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [new TextRun({ text: "PgMP Exam Preparation", size: 56, bold: true, color: colors.primary, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Study Calendar & Schedule", size: 40, bold: true, color: colors.secondary, font: "Times New Roman" })]
        }),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Exam Date: April 23, 2025", size: 28, color: colors.accent, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Time: 9:30 AM (Dubai, UAE)", size: 28, color: colors.accent, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [new TextRun({ text: "Online Proctored Exam", size: 24, color: colors.accent, font: "Times New Roman", italics: true })]
        }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "69 Days to Prepare | 10 Weeks | 20 Weekend Days", size: 24, color: colors.primary, font: "Times New Roman", bold: true })]
        }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // Main Content
    {
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "PgMP Exam Preparation Schedule | Exam: April 23, 2025", size: 18, color: colors.accent, font: "Times New Roman", italics: true })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Page ", size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " of ", size: 18 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18 })]
        })] })
      },
      children: [
        // Table of Contents
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Table of Contents")] }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 400 },
          children: [new TextRun({ text: "Right-click the Table of Contents and select 'Update Field' to refresh page numbers.", size: 18, color: "999999", font: "Times New Roman", italics: true })]
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // Section 1: Overview
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Study Plan Overview")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Time Available")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Your PgMP exam is scheduled for April 23, 2025, at 9:30 AM Dubai time. This gives you 69 days (approximately 10 weeks) to prepare thoroughly. The schedule below optimizes your study time with heavier focus on weekends while maintaining manageable weekday sessions that accommodate your work commitments.", size: 22 })]
        }),

        // Time breakdown table
        new Table({
          columnWidths: [4680, 4680],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Parameter", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Value", bold: true, size: 22 })] })] })
              ]
            }),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Total Days", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "69 days", size: 22, bold: true })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Weekday Study Days", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "49 days (1-2 hours/day)", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Weekend Study Days", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "20 days (4-6 hours/day)", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Estimated Total Study Hours", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "140-180 hours", size: 22, bold: true })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Study Strategy")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Weekdays: 1-2 hours of focused study (early morning or evening)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Weekends: 4-6 hours of intensive study with breaks", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Focus on understanding concepts first, then memorization", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Regular practice exams starting Week 6", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 300 }, children: [new TextRun({ text: "Final week dedicated to review and rest", size: 22 })] }),

        // Section 2: Weekly Schedule
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Week-by-Week Study Schedule")] }),

        // Week 1
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 1: February 13-19, 2025 - Foundation & Introduction")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Understanding Program Management fundamentals and key definitions", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 13", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Read Standard Introduction (Ch.1); Define program vs project vs portfolio", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 15", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "4 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Deep dive: Program definition, components, organizational business value; Create flashcards for key terms", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 16", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "4 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Role of Program Manager; Program Manager competencies; Review PMI Code of Ethics", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 2
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 2: February 20-26, 2025 - Program Management Principles (Part 1)")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: First four principles - Stakeholders, Benefits Realization, Synergy, Team of Teams", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 20", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Principle 1: Stakeholders - Statement and key characteristics", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 21", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Principle 2: Benefits Realization - Focus on outcomes and value", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 22", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Deep study: Principles 1-2; Practice scenarios; Create summary notes; Review stakeholder engagement techniques", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 23", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Principle 3: Synergy; Principle 4: Team of Teams; Compare and contrast all four principles; Quiz yourself", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Review flashcards; Re-read principle summaries; Practice questions on principles 1-4", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 3
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 3: February 27 - March 5, 2025 - Program Management Principles (Part 2)")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Remaining four principles - Change, Leadership, Risk, Governance", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 27", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Principle 5: Change - Managing change at program level vs project level", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 28", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Principle 6: Leadership - Program leadership vs project leadership", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat Mar 1", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Principle 7: Risk - Program risk management and strategic alignment; Risk thresholds and appetite", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun Mar 2", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Principle 8: Governance - Framework, transparency, oversight; Review ALL 8 principles; Create comprehensive summary", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Practice questions on all 8 principles; Identify weak areas; Review flashcards", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 4
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 4: March 6-12, 2025 - Performance Domains (Part 1)")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Strategic Alignment, Benefits Management, Stakeholder Engagement Domains", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 6", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Domain 1: Strategic Alignment - Business case, program charter, program management plan", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 7", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Domain 2: Benefits Management - Identification, analysis, planning, delivery, transition, sustainment", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 8", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Deep dive: Benefits Management life cycle; Benefits realization plan; Benefits metrics and KPIs", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 9", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Domain 3: Stakeholder Engagement - Identification, analysis, planning, engagement, communications", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Review domains 1-3; Practice questions; Map domains to principles", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 5
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 5: March 13-19, 2025 - Performance Domains (Part 2)")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Governance Framework, Collaboration, Life Cycle Management Domains", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 13", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Domain 4: Governance Framework - Practices, roles, stage-gate reviews", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 14", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Domain 5: Collaboration - Creating synergy across stakeholders", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 15", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Domain 6: Life Cycle Management - Definition, Delivery, Closure phases; Program roadmap", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 16", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Review ALL 6 domains; Create domain summary matrix; Domain interaction mapping", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Practice questions on all domains; Review weak areas; Update flashcards", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 6
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 6: March 20-26, 2025 - Program Activities & Documents")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Program Activities, Key Documents, Integration Management", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 20", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Program Activities: Integration, Change, Communications, Financial Management", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 21", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Program Activities: Information, Procurement, Quality, Resource Management", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 22", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Key Documents: Business Case, Program Charter; Understand structure and content requirements", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 23", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "6 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Program Management Plan, Program Roadmap; FIRST PRACTICE EXAM (50 questions)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Review practice exam results; Identify weak areas; Focus study on gaps", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 7
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 7: March 27 - April 2, 2025 - Integration & Practice")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Integrating all concepts, Practice Exams, Gap Analysis", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 27", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Project vs Program vs Portfolio distinctions; Scenario-based practice", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 28", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Program Life Cycle in-depth review; Phase gates and decision points", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 29", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "6 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "FULL PRACTICE EXAM #2 (170 questions, 4-hour timed); Review incorrect answers", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 30", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Analyze practice exam gaps; Targeted study on weak areas; Create cheat sheet", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Targeted practice on weak topics; Review all flashcards; Update notes", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 8
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 8: April 3-9, 2025 - Advanced Practice & Refinement")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Advanced scenarios, Time management, Exam strategies", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 3", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Advanced scenario practice; Complex stakeholder situations", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 4", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Benefits management scenarios; Governance decision points", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 5", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "6 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "FULL PRACTICE EXAM #3 (170 questions, 4-hour timed); Focus on time management", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 6", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Detailed exam analysis; Review all incorrect answers; Finalize cheat sheet", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Quick review of all topics; Exam-taking strategies; Question analysis techniques", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 9
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 9: April 10-16, 2025 - Final Intensive Review")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Comprehensive review, Final practice exam, Confidence building", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 10", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Review all 8 principles; Key definitions and statements", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Fri 11", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.5 hrs", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Review all 6 domains; Domain interactions and key outputs", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 12", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "6 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "FINAL FULL PRACTICE EXAM #4 (170 questions, 4-hour timed); Simulate exam conditions", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 13", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Final gap analysis; Review any remaining weak areas; Finalize all notes", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon-Wed", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr each", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Light review only; Focus on confidence-building; Review cheat sheet", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Week 10 - Final Week
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 10: April 17-22, 2025 - Final Preparation & Rest")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Light review, Mental preparation, Logistics, Rest", size: 22, italics: true })] }),
        new Table({
          columnWidths: [1800, 2000, 5560],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Tasks", bold: true, size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Thu 17", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1 hr", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Quick review of cheat sheet; Light practice (20 questions)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sat 19", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "3 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Final review of key concepts; Quick practice exam (50 questions); Review logistics", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Sun 20", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "2 hrs", size: 20, bold: true })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Light review only; Prepare exam day items; Verify system requirements for online exam", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Mon 21", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "30 min", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Very light review; Focus on relaxation and positive mindset", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Tue 22", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "REST", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "NO STUDY - Full rest day; Prepare for tomorrow; Sleep early; Stay hydrated", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Exam Day
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("EXAM DAY: April 23, 2025 (Wednesday)")] }),
        new Table({
          columnWidths: [2400, 6960],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Exam Time", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "9:30 AM Dubai time (Online Proctored)", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Wake Up", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "6:30 AM - Light breakfast, stay hydrated, light exercise", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Setup", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "7:30 AM - Test system, check internet, prepare workspace", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Check-in", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "9:00 AM - Begin online check-in process", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.highlight, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "EXAM", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.highlight, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "9:30 AM - 170 questions, 4 hours - Stay calm, manage time, trust your preparation!", bold: true, size: 22 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 400 } }),

        // Section 3: Study Tips
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Study Tips & Strategies")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Weekday Study Tips (1-2 hours)")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Study early morning (before work) or evening (after work) when you are freshest", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Focus on one topic per session - don't try to cover everything", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Use commuting time for audio review or flashcard apps", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Keep a study journal to track progress and insights", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Review previous day's notes for 10 minutes before starting new material", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Weekend Study Tips (4-6 hours)")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Break study into 90-minute focused blocks with 15-minute breaks", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Morning (8 AM - 12 PM): Deep study of complex topics", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Afternoon (2 PM - 5 PM): Practice exams and review", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Use practice exams to simulate real exam conditions", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Review and analyze all incorrect answers thoroughly", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Exam Day Strategies")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Read each question carefully - identify keywords and what is being asked", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Eliminate obviously wrong answers first", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Time management: Aim for 1.4 minutes per question average", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Mark uncertain questions and return to them later", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Trust your preparation - don't second-guess yourself excessively", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Remember: PMI expects the 'best' answer, not necessarily the 'correct' answer", size: 22 })] }),

        // Section 4: Online Exam Logistics
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Online Proctored Exam Logistics")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Technical Requirements")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Reliable internet connection (wired preferred over WiFi)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Desktop or laptop computer (tablets not permitted)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Webcam and microphone working properly", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Current version of supported browser (Chrome preferred)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Quiet, private room with clear desk and walls", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 What to Have Ready")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Valid government-issued ID (passport recommended for UAE)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "PMI ID and confirmation email", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Water bottle (must be in clear container)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Comfortable clothing (no prohibited items in pockets)", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Prohibited Items During Exam")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Mobile phones, smart watches, or any electronic devices", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Books, notes, papers, or study materials", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Headphones or earbuds", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 400 }, children: [new TextRun({ text: "Food (only water allowed in clear container)", size: 22 })] }),

        // Final Note
        new Paragraph({
          spacing: { before: 300, after: 200 },
          alignment: AlignmentType.CENTER,
          shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
          children: [new TextRun({ text: "Best of luck with your PgMP exam on April 23, 2025!", size: 24, bold: true, color: colors.primary })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Your preparation is your foundation - trust the process and stay confident!", size: 22, italics: true, color: colors.accent })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/PgMP_Study_Calendar_April2025.docx', buffer);
  console.log('Document created successfully: PgMP_Study_Calendar_April2025.docx');
});
