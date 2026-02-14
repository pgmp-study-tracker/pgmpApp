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
  weekend: "E8F5E9",
  practice: "FFF3E0",
  exam: "FFEBEE",
  white: "FFFFFF"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E0" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const bulletRef = "bullet-list";
const numRef = "num-list";

// Helper to create a schedule table row
function scheduleRow(day, date, topic, duration, type = "weekday") {
  let fill = colors.white;
  if (type === "weekend") fill = colors.weekend;
  else if (type === "practice") fill = colors.practice;
  else if (type === "exam") fill = colors.exam;
  
  return new TableRow({
    children: [
      new TableCell({ borders: cellBorders, shading: { fill, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1500, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: day, size: 20, bold: type === "weekend" || type === "practice" })] })] }),
      new TableCell({ borders: cellBorders, shading: { fill, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1700, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: date, size: 20 })] })] }),
      new TableCell({ borders: cellBorders, shading: { fill, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 5160, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: topic, size: 20 })] })] }),
      new TableCell({ borders: cellBorders, shading: { fill, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1000, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: duration, size: 20, bold: true })] })] })
    ]
  });
}

// Helper for header row
function headerRow() {
  return new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1500, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Day", bold: true, size: 20 })] })] }),
      new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1700, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Date", bold: true, size: 20 })] })] }),
      new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 5160, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Study Topic & Activities", bold: true, size: 20 })] })] }),
      new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1000, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 20 })] })] })
    ]
  });
}

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
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [new TextRun({ text: "PgMP Exam Preparation", size: 56, bold: true, color: colors.primary, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "68-Day Study Calendar", size: 40, bold: true, color: colors.secondary, font: "Times New Roman" })]
        }),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "February 14 - April 22, 2026", size: 28, color: colors.accent, font: "Times New Roman" })]
        }),
        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "EXAM DATE", size: 24, bold: true, color: colors.primary, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Thursday, April 23, 2026", size: 32, bold: true, color: "C53030", font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: "9:30 AM - Dubai, UAE", size: 26, color: colors.secondary, font: "Times New Roman" })]
        }),
        new Paragraph({ spacing: { before: 1000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "68 Days | 9 Weeks + 5 Days | ~168 Study Hours", size: 22, bold: true, color: colors.primary, font: "Times New Roman" })]
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
          children: [new TextRun({ text: "PgMP Study Calendar | Exam: April 23, 2026 | Dubai, UAE", size: 18, color: colors.accent, font: "Times New Roman", italics: true })]
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
          children: [new TextRun({ text: "Right-click and select 'Update Field' to refresh page numbers.", size: 18, color: "999999", font: "Times New Roman", italics: true })]
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // Section 1: Overview
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Study Plan Overview")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 Time Available")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Your PgMP exam is scheduled for April 23, 2026, at 9:30 AM Dubai time. This gives you 68 days (approximately 9 weeks and 5 days) to prepare thoroughly. The schedule below optimizes your study time with heavier focus on UAE weekends (Friday-Saturday) while maintaining manageable weekday sessions that accommodate your work commitments.", size: 22 })]
        }),

        // Summary Table
        new Table({
          columnWidths: [4680, 4680],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Parameter", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Value", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Total Days", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "68 days", size: 22, bold: true })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Weekdays (Sun-Thu)", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "49 days (1-2 hrs/day)", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Weekends (Fri-Sat)", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "19 days (4-6 hrs/day)", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Total Study Hours", size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "~168 hours", size: 22, bold: true })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Study Strategy")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Weekdays (Sun-Thu): 1-2 hours of focused study after work", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Weekends (Fri-Sat): 4-6 hours intensive study with breaks", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Practice exams start from Week 5", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 300 }, children: [new TextRun({ text: "Final week dedicated to light review and rest", size: 22 })] }),

        // Legend
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 Color Legend")] }),
        new Table({
          columnWidths: [2340, 7020],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.white, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "White", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Weekday study (1-2 hours)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.weekend, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Green", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "UAE Weekend intensive (4-6 hours)", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.practice, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Orange", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Practice Exam day", size: 20 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pink", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "EXAM DAY", size: 20 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 1
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Week-by-Week Study Schedule")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 1: February 14-20, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Foundation & Introduction to Program Management", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Feb 14", "Introduction to Program Management - Read Chapter 1; Program vs Project vs Portfolio definitions", "4 hrs", "weekend"),
            scheduleRow("Sun", "Feb 15", "Program Components & Structure - Projects, subsidiary programs, activities", "1.5 hrs"),
            scheduleRow("Mon", "Feb 16", "Program Management Overview - Application of knowledge, skills, principles", "1.5 hrs"),
            scheduleRow("Tue", "Feb 17", "Organizational Strategy Alignment - How programs support strategic objectives", "1.5 hrs"),
            scheduleRow("Wed", "Feb 18", "Role of Program Manager - Responsibilities and accountabilities", "1.5 hrs"),
            scheduleRow("Thu", "Feb 19", "Program Manager Competencies - Required skills and knowledge areas", "1.5 hrs"),
            scheduleRow("Fri", "Feb 20", "INTENSIVE: Review & Practice - Summarize Week 1; Create flashcards; Practice questions", "5 hrs", "weekend")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 2
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 2: February 21-27, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Program Management Principles 1-4 (Stakeholders, Benefits, Synergy, Team of Teams)", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Feb 21", "Principle 1: STAKEHOLDERS - Statement, characteristics, engagement strategies", "4 hrs", "weekend"),
            scheduleRow("Sun", "Feb 22", "Stakeholder Principle Deep Dive - Proactiveness, collaboration, monitoring", "1.5 hrs"),
            scheduleRow("Mon", "Feb 23", "Principle 2: BENEFITS REALIZATION - Focus on outcomes aligned with strategy", "1.5 hrs"),
            scheduleRow("Tue", "Feb 24", "Benefits Realization Deep Dive - Value creation, justification, sustainment", "1.5 hrs"),
            scheduleRow("Wed", "Feb 25", "Principle 3: SYNERGY - Structured approach, component optimization", "1.5 hrs"),
            scheduleRow("Thu", "Feb 26", "Principle 4: TEAM OF TEAMS - Integrated structure, network relationships", "1.5 hrs"),
            scheduleRow("Fri", "Feb 27", "INTENSIVE: Principles 1-4 Review - Summary notes; Practice scenarios; Quiz", "5 hrs", "weekend")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 3
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 3: February 28 - March 6, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Program Management Principles 5-8 (Change, Leadership, Risk, Governance)", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Feb 28", "Principle 5: CHANGE - Embrace change, structured approach, internal/external sources", "4 hrs", "weekend"),
            scheduleRow("Sun", "Mar 1", "Change Principle Deep Dive - Change management factors, enablers", "1.5 hrs"),
            scheduleRow("Mon", "Mar 2", "Principle 6: LEADERSHIP - Motivate and unite program team", "1.5 hrs"),
            scheduleRow("Tue", "Mar 3", "Leadership Deep Dive - Emotional intelligence, trust, consistency", "1.5 hrs"),
            scheduleRow("Wed", "Mar 4", "Principle 7: RISK - Proactive risk management, strategic alignment", "1.5 hrs"),
            scheduleRow("Thu", "Mar 5", "Principle 8: GOVERNANCE - Framework, transparency, oversight, compliance", "1.5 hrs"),
            scheduleRow("Fri", "Mar 6", "INTENSIVE: ALL 8 Principles Review - Complete summary; Mini practice test (50 questions)", "6 hrs", "practice")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 4
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 4: March 7-13, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Performance Domains - Strategic Alignment & Benefits Management", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Mar 7", "Domain: Strategic Alignment - Business case, program charter, management plan", "4 hrs", "weekend"),
            scheduleRow("Sun", "Mar 8", "Strategic Alignment Deep Dive - Environmental assessments, risk strategy", "1.5 hrs"),
            scheduleRow("Mon", "Mar 9", "Domain: Benefits Management - Benefits identification and analysis", "1.5 hrs"),
            scheduleRow("Tue", "Mar 10", "Benefits Planning & Delivery - Benefits realization plan, delivery approach", "1.5 hrs"),
            scheduleRow("Wed", "Mar 11", "Benefits Transition & Sustainment - Transition to operations, ongoing tracking", "1.5 hrs"),
            scheduleRow("Thu", "Mar 12", "Benefits Life Cycle Review - All 5 phases; Practice questions", "1.5 hrs"),
            scheduleRow("Fri", "Mar 13", "INTENSIVE: Strategic Alignment & Benefits - Domain summary; 40 practice questions", "5 hrs", "weekend")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 5
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 5: March 14-20, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Performance Domains - Stakeholder Engagement & Governance Framework", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Mar 14", "Domain: Stakeholder Engagement - Identification, analysis, planning", "4 hrs", "weekend"),
            scheduleRow("Sun", "Mar 15", "Stakeholder Engagement - Engagement activities, communications", "1.5 hrs"),
            scheduleRow("Mon", "Mar 16", "Domain: Governance Framework - Practices, roles, stage-gate reviews", "1.5 hrs"),
            scheduleRow("Tue", "Mar 17", "Governance Framework Deep Dive - Design, implementation, decision-making", "1.5 hrs"),
            scheduleRow("Wed", "Mar 18", "Governance Roles - Sponsor, steering committee, PMO", "1.5 hrs"),
            scheduleRow("Thu", "Mar 19", "Review: Stakeholder & Governance - Practice questions; Gap analysis", "1.5 hrs"),
            scheduleRow("Fri", "Mar 20", "INTENSIVE: PRACTICE EXAM #1 - Full practice test (100 questions, 2.5 hours)", "6 hrs", "practice")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 6
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 6: March 21-27, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Performance Domains - Collaboration & Life Cycle Management", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Mar 21", "Practice Exam #1 Review - Analyze incorrect answers; Identify weak areas", "4 hrs", "weekend"),
            scheduleRow("Sun", "Mar 22", "Domain: Collaboration - Creating synergy across stakeholders", "1.5 hrs"),
            scheduleRow("Mon", "Mar 23", "Collaboration Deep Dive - Benefits delivery planning, component collaboration", "1.5 hrs"),
            scheduleRow("Tue", "Mar 24", "Domain: Life Cycle Management - Definition, Delivery, Closure phases", "1.5 hrs"),
            scheduleRow("Wed", "Mar 25", "Life Cycle - Program Formulation & Planning subphases", "1.5 hrs"),
            scheduleRow("Thu", "Mar 26", "Life Cycle - Component Authorization, Oversight, Transition", "1.5 hrs"),
            scheduleRow("Fri", "Mar 27", "INTENSIVE: ALL 6 Domains Review - Complete domain matrix; Practice questions", "5 hrs", "weekend")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 7
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 7: March 28 - April 3, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Program Activities, Key Documents & Integration", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Mar 28", "Program Activities Overview - Integration, Change, Communications, Financial", "4 hrs", "weekend"),
            scheduleRow("Sun", "Mar 29", "Program Activities - Information, Procurement, Quality, Resource Management", "1.5 hrs"),
            scheduleRow("Mon", "Mar 30", "Key Documents: Business Case - Structure, content, justification", "1.5 hrs"),
            scheduleRow("Tue", "Mar 31", "Key Documents: Program Charter - Elements, authorization, scope", "1.5 hrs"),
            scheduleRow("Wed", "Apr 1", "Key Documents: Management Plan - Subsidiary plans, roadmap", "1.5 hrs"),
            scheduleRow("Thu", "Apr 2", "Program Roadmap - Milestones, dependencies, strategic linkage", "1.5 hrs"),
            scheduleRow("Fri", "Apr 3", "INTENSIVE: PRACTICE EXAM #2 - Full practice test (120 questions, 3 hours)", "6 hrs", "practice")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 8
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 8: April 4-10, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Integration, Distinctions & Comprehensive Review", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Apr 4", "Practice Exam #2 Review - Detailed analysis; Target weak areas", "4 hrs", "weekend"),
            scheduleRow("Sun", "Apr 5", "Project vs Program vs Portfolio - Key distinctions table", "1.5 hrs"),
            scheduleRow("Mon", "Apr 6", "Program Manager vs Project Manager - Roles and responsibilities", "1.5 hrs"),
            scheduleRow("Tue", "Apr 7", "Governance Roles Review - Sponsor, steering committee, PMO", "1.5 hrs"),
            scheduleRow("Wed", "Apr 8", "Benefits Management Life Cycle - Complete review of 5 phases", "1.5 hrs"),
            scheduleRow("Thu", "Apr 9", "Life Cycle Phases Review - Definition, Delivery, Closure activities", "1.5 hrs"),
            scheduleRow("Fri", "Apr 10", "INTENSIVE: Comprehensive Review - All principles, domains, activities", "5 hrs", "weekend")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 9
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 9: April 11-17, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Final Review & Exam Simulation", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Apr 11", "PRACTICE EXAM #3 - Full simulated exam (170 questions, 4 hours)", "6 hrs", "practice"),
            scheduleRow("Sun", "Apr 12", "Practice Exam #3 Review - Analyze all incorrect answers", "2 hrs"),
            scheduleRow("Mon", "Apr 13", "Targeted Review - Focus on weakest areas from practice exam", "1.5 hrs"),
            scheduleRow("Tue", "Apr 14", "Flashcards Review - All key terms and definitions", "1 hr"),
            scheduleRow("Wed", "Apr 15", "PMI Code of Ethics - Review ethical standards and conduct", "1 hr"),
            scheduleRow("Thu", "Apr 16", "Final Notes Review - Review all summary notes", "1 hr"),
            scheduleRow("Fri", "Apr 17", "PRACTICE EXAM #4 - Final full exam (170 questions, 4 hours)", "6 hrs", "practice")
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // WEEK 10 - Final Days
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Final Days: April 18-22, 2026")] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Focus: Light Review, Mental Preparation & Rest", size: 22, italics: true, color: colors.accent })] }),
        new Table({
          columnWidths: [1500, 1700, 5160, 1000],
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          rows: [
            headerRow(),
            scheduleRow("Sat", "Apr 18", "Practice Exam #4 Review - Final gap analysis; Light study", "3 hrs", "weekend"),
            scheduleRow("Sun", "Apr 19", "Light Review - Quick scan of key concepts; No intensive study", "1 hr"),
            scheduleRow("Mon", "Apr 20", "Light Review - Flashcards only; Stay relaxed", "30 min"),
            scheduleRow("Tue", "Apr 21", "Exam Day Prep - Check system requirements; Prepare workspace; REST", "30 min"),
            scheduleRow("Wed", "Apr 22", "FINAL PREP - Light review; Early sleep; Stay hydrated; NO STUDY", "REST"),
            scheduleRow("Thu", "Apr 23", "EXAM DAY - 9:30 AM Dubai - You're prepared and ready!", "—", "exam")
          ]
        }),
        new Paragraph({ spacing: { after: 400 } }),

        // EXAM DAY DETAILS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Exam Day Schedule")] }),
        
        new Table({
          columnWidths: [2400, 6960],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({ tableHeader: true, children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Time", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Activity", bold: true, size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "6:30 AM", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Wake up, light breakfast, stay hydrated", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "7:30 AM", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Test system, check internet, prepare workspace", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "9:00 AM", bold: true, size: 22 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Begin online check-in process", size: 22 })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "9:30 AM", bold: true, size: 24, color: "C53030" })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.exam, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "EXAM STARTS - 170 questions, 4 hours - GOOD LUCK!", bold: true, size: 22 })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { after: 400 } }),

        // STUDY TIPS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Study Tips & Strategies")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Weekday Study (Sun-Thu: 1-2 hours)")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Study at a consistent time each day (early morning or evening)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Focus on ONE topic per session - avoid multitasking", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Use Pomodoro technique: 25 minutes study + 5 minutes break", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Review previous day's notes for 10 minutes before new material", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Weekend Study (Fri-Sat: 4-6 hours)")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Break into 90-minute focused blocks with 15-minute breaks", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Morning: Deep study of complex topics", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Afternoon: Practice exams and question review", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Simulate real exam conditions during practice tests", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Exam-Taking Strategies")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Read each question carefully - identify keywords", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Eliminate obviously wrong answers first", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Time management: ~1.4 minutes per question average", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Mark uncertain questions and return to them later", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Choose the 'best' answer from PMI's perspective, not just 'correct'", size: 22 })] }),

        // ONLINE EXAM LOGISTICS
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Online Proctored Exam Logistics")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Technical Requirements")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Reliable internet connection (wired preferred)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Desktop or laptop computer (no tablets)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Working webcam and microphone", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Quiet, private room with clear desk", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 What to Have Ready")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Valid government-issued ID (passport recommended)", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "PMI ID and confirmation email", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Water in clear container", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 400 }, children: [new TextRun({ text: "Comfortable clothing (no prohibited items)", size: 22 })] }),

        // FINAL MESSAGE
        new Paragraph({
          spacing: { before: 200, after: 200 },
          alignment: AlignmentType.CENTER,
          shading: { fill: colors.weekend, type: ShadingType.CLEAR },
          children: [new TextRun({ text: "Best of luck with your PgMP exam on April 23, 2026!", size: 24, bold: true, color: colors.primary })]
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
  fs.writeFileSync('/home/z/my-project/download/PgMP_Study_Calendar_Feb_Apr2026.docx', buffer);
  console.log('Document created successfully: PgMP_Study_Calendar_Feb_Apr2026.docx');
});
