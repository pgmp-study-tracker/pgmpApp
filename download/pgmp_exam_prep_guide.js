const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign, 
        PageNumber, LevelFormat, PageBreak, TableOfContents } = require('docx');
const fs = require('fs');

// Color scheme - Professional Navy theme
const colors = {
  primary: "1A365D",      // Deep Navy for titles
  secondary: "2D3748",    // Dark gray for body
  accent: "4A5568",       // Medium gray for subtitles
  tableHeader: "E8EDF2",  // Light blue-gray for table headers
  tableBg: "F7FAFC",      // Very light gray for alternating rows
  white: "FFFFFF"
};

// Table borders
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E0" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// Bullet list config reference
const bulletRef = "bullet-list";

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
      { reference: bulletRef,
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-4", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-5", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-6", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-7", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-8", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // Cover Page Section
    {
      properties: { page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } } },
      children: [
        new Paragraph({ spacing: { before: 3000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: "PgMP Exam Preparation Guide", size: 56, bold: true, color: colors.primary, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Critical Points from PMI's Standard for Program Management", size: 28, color: colors.accent, font: "Times New Roman" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Fifth Edition", size: 24, color: colors.secondary, font: "Times New Roman", italics: true })]
        }),
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "A Comprehensive Study Resource for Program Management Professionals", size: 22, color: colors.accent, font: "Times New Roman" })]
        }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // Main Content Section
    {
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "PgMP Exam Preparation Guide", size: 18, color: colors.accent, font: "Times New Roman", italics: true })]
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
          children: [new TextRun({ text: "Note: Right-click the Table of Contents and select 'Update Field' to refresh page numbers.", size: 18, color: "999999", font: "Times New Roman", italics: true })]
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // Section 1: Introduction
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Introduction to Program Management")] }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 What is a Program?")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "A program comprises related projects, subsidiary programs, and program activities managed in a coordinated manner to obtain benefits not available from managing them individually. The components of a program are related through their pursuit of complementary goals that contribute to the delivery of benefits. Programs are conducted primarily to deliver benefits to their target stakeholders, sponsor organizations, or constituents. Programs deliver benefits by enhancing current capabilities, implementing change, creating or maintaining assets, offering new products and services, developing new opportunities to generate or preserve value, minimizing company loss or reputation damage, considering interrelated risk approaches, or implementing a minimal risk entry to a market or a minimal risk exit from a market.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 What is Program Management?")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Program management is the application of knowledge, skills, and principles to a program to achieve the program objectives and to obtain benefits and control not available by managing program components individually. It involves aligning program components and resources to ensure that program goals are met, benefits are optimally delivered, and risks are effectively managed. Program management is led by a program manager, who is the person authorized by the performing organization to lead the team or teams responsible for achieving program objectives.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 Program Components")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "The following are the key program components and their definitions:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Components: Projects, subsidiary programs, or other related activities conducted to support a program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Projects: Temporary endeavors undertaken to create a unique product, service, or result.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Subsidiary Programs: Programs sponsored and conducted to pursue a subset of goals and benefits important to the primary program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Other Program-related Activities: Work processes or activities that support a program but are not directly tied to subsidiary programs or projects.", size: 22 })] }),

        // Section 2: Program Management Principles
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. The Eight Program Management Principles")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Principles of program management are fundamental norms, truths, or values that provide guidance for the behaviors and actions of people involved in programs as they influence and shape the performance domains to achieve intended benefits. These eight principles guide behavior within program management practices and establish the foundation for effective program management.", size: 22 })]
        }),

        // Principle 1: Stakeholders
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Principle of Stakeholders")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Engage stakeholders at a level commensurate with their impacts or contributions to the program's success.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "The primary goal is to ensure that stakeholder expectations, program benefits, and organizational strategy are all in harmony with one another, and the expected business value of the program is achieved. Key characteristics include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "Proactiveness: Engages stakeholders by assessing their attitudes and interests toward the program and their change readiness.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "Collaboration: Includes stakeholders in program activities via communications targeted to their needs and interests.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "Monitoring: Tracks the influences, expectations, needs, feedback, involvement, and attitudes throughout the program life cycle.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "Facilitation: Educates and supports training initiatives within the context of the program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "Adaptivity: Leverages benefits gained through synergies and mitigates disruptions caused by conflicts.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Interpersonal Skills: Fosters and builds relationships, takes initiative, and employs integrity and respect.", size: 22 })] }),

        // Principle 2: Benefits Realization
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Principle of Benefits Realization")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Consistently focus on the program outcomes aligned with organizational strategy.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Benefits realization is the gain realized by one or more organizations and/or groups of people from the outcomes of a program's outputs. Key points include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program benefits alignment with organizational strategy takes precedence over the outcome of individual components.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Benefits realized should justify the use of invested resources.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Planned benefits should be agreed upon by key stakeholders and beneficiaries.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Risks should be balanced to support benefits realization.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Governance structures should enable provisioning of adequate resources for benefits realization success.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Program outputs, outcomes, and benefits should be transitioned to ongoing operations and tracked for sustainment.", size: 22 })] }),

        // Principle 3: Synergy
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Principle of Synergy")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: A structured approach that blends portfolio, program, and project management practices to enable the program to accomplish more than what was possible by its individual components.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Synergy is the continual evaluation and navigation of component complexities and dependencies for optimization across the program, creating more than what was achievable by individual component parts. Key aspects include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Use structured or agile approaches that blend project and program management practices.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Drive changes to individual components to optimize the whole of the program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Foster the right conditions and ensure the proper culture for projects and programs to be synergistic.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Align program components with the program management plan, capacity, capabilities, and performance domain efforts.", size: 22 })] }),

        // Principle 4: Team of Teams
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.4 Principle of Team of Teams")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Integrate a team structure to create a network of relationships across components to enhance adaptability and resiliency.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "This principle characterizes an integrated team structure that creates a network of relationships across products and processes, connected vertically and horizontally, forming a structure that allows for shared strategy and empowered execution. Key points include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Utilize appropriate leadership styles, techniques, and networking tools to effectively manage the program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Team leaders should exhibit leadership principles within the team of teams framework.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Team size should stay within a reasonable boundary for effective management.", size: 22 })] }),

        // Principle 5: Change
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.5 Principle of Change")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Embrace change with an overall focus on program benefits realization.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Managing program change effectively is critical to improving the efficiency of benefits realization, delivery, and sustainment during a program's life cycle. Key aspects include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Use a structured approach to change to help respond to internal and/or external factors.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Change can originate from internal influences or external sources.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Change adoption requires fostering the right conditions and culture.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Change should be results-oriented and evaluated against strategic goals.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Enablers include assessment, adoption and assimilation, motivation, engagement and communication, urgency and speed, and embracing risk.", size: 22 })] }),

        // Principle 6: Leadership
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.6 Principle of Leadership")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Motivate and unite the program team to keep the program's overall delivery pace and realize expected program benefits.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Program leadership motivates and unites the program team, harnessing its energy, enthusiasm, and vision to maintain the delivery pace of benefits. Key leadership attributes include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Show empathy for the perspectives of both the program team and other stakeholders.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Create a climate of trust and consistency for the whole program team.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Facilitate negotiations and resolve conflicts within and between teams.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Ensure consistency in vertical support and horizontal coordination.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Empower component managers with authority and autonomy within governance limitations.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Adapt leadership style to the situation and understand political dynamics.", size: 22 })] }),

        // Principle 7: Risk
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.7 Principle of Risk")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Effectively manage program risks to ensure that the program is aligned with the organizational strategy.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "A risk is an uncertain event or condition that, if it occurs, has a positive or negative effect on one or more program objectives. Programs are inherently complex, requiring proactive risk management throughout the life cycle. Key aspects include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Ensure program risk threshold is aligned with the organization's risk appetite.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Identify and evaluate risks throughout the program life cycle.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Implement practical benchmarking against risks observed in other programs.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Effectively manage the component dependencies of the program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Address risks related to business viability throughout the program continuously.", size: 22 })] }),

        // Principle 8: Governance
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.8 Principle of Governance")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Statement: Establish and adopt a proportionate and appropriate program governance framework to control the program as necessary.", size: 22, bold: true })]
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Program governance comprises the framework, functions, processes, and tools by which a program is monitored, managed, and supported to meet organizational strategic and operational goals. Key characteristics include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "Transparency: Enabling relevant access to program information while maintaining responsibility and accountability.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "Oversight: Retaining oversight on policy, control, integration, and decision-making.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "Compliance: Creating a framework to ensure the program is managed appropriately.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "Resiliency: Managing risk and overseeing impacts, issues, and risks that support decision-making.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Adaptivity: Managing changes at the strategic level and overseeing changes in program components.", size: 22 })] }),

        // Section 3: Performance Domains
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Program Management Performance Domains")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Program management performance domains are complementary groupings of related areas of activity or function that uniquely characterize and differentiate the activities of one performance domain from others. These six domains run concurrently throughout the duration of the program, and the program manager and team perform their activities within these domains.", size: 22 })]
        }),

        // Performance Domain Table
        new Paragraph({
          spacing: { before: 200, after: 100 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Table 1: Six Program Management Performance Domains", size: 20, bold: true, color: colors.primary })]
        }),
        new Table({
          columnWidths: [2500, 6860],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Performance Domain", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Description", bold: true, size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Strategic Alignment", size: 22, bold: true })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Identifies program outputs and outcomes to provide benefits aligned with organizational strategy goals and objectives.", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Benefits Management", size: 22, bold: true })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Defines, creates, optimizes, delivers, and sustains the benefits provided by the program.", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Stakeholder Engagement", size: 22, bold: true })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Identifies and analyzes stakeholder needs and manages expectations and communications to foster stakeholder support.", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Governance Framework", size: 22, bold: true })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Enables and performs program decision-making, establishes practices to support the program, maintains program oversight, and ensures compliance with standards and regulations.", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Collaboration", size: 22, bold: true })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Creates and maintains synergy across stakeholders, both internal and external, to optimize benefits delivery and realization.", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Life Cycle Management", size: 22, bold: true })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 6860, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Manages the program life cycle and the phases required to facilitate program definition, delivery, and closure.", size: 22 })] })] })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Section 4: Program Life Cycle
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Program Life Cycle Management")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The program life cycle illustrates the nonsequential nature of a program's life cycle phases. Program benefits may be identified throughout the duration of the program. The life cycle consists of three major phases, each with specific subphases and activities.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Program Definition Phase")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "The program definition phase includes phases conducted to authorize the program and develop the program management plan required to achieve the expected results. It consists of two subphases:", size: 22 })]
        }),
        
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1.1 Program Formulation")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Program formulation involves the development of the program business case that states the overall expected benefits to be addressed by the program. Key activities include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Development of the program business case", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Assignment of program sponsor and program manager", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Initiation of studies and estimates of scope, resources, and cost", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Development of initial risk assessment", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Creation of program charter", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.1.2 Program Planning")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Program planning commences upon formal approval of the program charter. Key activities include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Establishment of governance structure", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Definition of initial program organization", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Assembly of program team", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Development of program management plan and subsidiary plans", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Program Delivery Phase")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "The program delivery phase includes phases performed to produce the intended results of each component in accordance with the program management plan. It consists of three subphases:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun({ text: "Component Authorization and Planning: Initiation of components based on specified criteria and business cases.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun({ text: "Component Oversight and Integration: Execution and coordination of component activities.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Component Transition and Closure: Transition of deliverables to operations or ongoing work.", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Program Closure Phase")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The program closure phase includes phases necessary to transition program benefits to the sustaining organization and formally close the program. Activities include verifying benefits delivery, transitioning resources and responsibilities, archiving information, and obtaining formal closure approval from the portfolio management body.", size: 22 })]
        }),

        // Section 5: Role of Program Manager
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Role of the Program Manager")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "A program manager is assigned by a senior official in the performing organization and is authorized to lead the team responsible for delivering benefits and value. The program manager maintains accountability and responsibility for the leadership, conduct, and performance of a program.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Key Responsibilities")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Exercise critical thinking skills within the eight program management principles and six performance domains.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Collaborate with project and other program managers to provide support and guidance.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Collaborate with portfolio managers to ensure appropriate resource provisioning.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Ensure the scope and deliverables of each component are recognized by stakeholders.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Ensure optimum utilization of common resources between program components.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Integrate component deliverables, outcomes, and benefits into program end products.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Transition outcomes and support benefits realization throughout the program life cycle.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Provide effective leadership and direction to program and component teams.", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Required Competencies")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Program managers need a comprehensive skill set to navigate complexity and deliver benefits. Key competencies include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Communication and Negotiation Skills: Enable effective exchange of information with diverse stakeholders.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Stakeholder Engagement Skills: Support management of complex issues from stakeholder interactions.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Change Management Skills: Enable effective engagement for agreements, alignment, and approvals.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Leadership and Management Skills: Guide program teams throughout the program life cycle.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Collaboration and Facilitation Skills: Enable effective teamwork and partnership management.", size: 22 })] }),

        // Section 6: Key Documents
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Key Program Documents")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Program Business Case")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The program business case is a documented cost-benefit analysis used to establish the validity of the benefits to be delivered by a program. It justifies the need for a program by defining how expected outcomes would support organizational strategic goals. The business case may include: program outcomes, approved concepts, issues, high-level risks, opportunity assessments, key assumptions, business and operational impacts, cost-benefit analysis, alternative solutions, financial analysis, market demands, potential profits, social needs, environmental influences, legal implications, and strategic alignment assessment.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Program Charter")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "The program charter is a document that assigns and authorizes a program manager and defines the scope and purpose of a proposed program. Key elements include:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Justification: Why the program is important and what it achieves", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Vision: The end state and how it will benefit the organization", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Strategic Alignment: Key strategic drivers and organizational objectives relationship", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Scope: What is included and what is out of scope", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Benefits: Key intended gains to be realized", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Assumptions and Constraints: Dependencies and external factors", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Risks and Issues: Initial risks, opportunities, and issues", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Timeline: Total length and key milestone dates", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Resources Needed: Estimated costs and resource requirements", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Stakeholder Considerations: Key stakeholders and engagement strategies", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 Program Management Plan")] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "The program management plan integrates subsidiary plans and establishes management controls for the program. It should be continually updated in response to changes. The plan includes:", size: 22 })]
        }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Strategic Alignment: Linkage between strategic goals and program components", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Executive Ownership: Group or person responsible for benefits realization", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Key Milestones: Significant points for decisions and benefits delivery", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "List of Components: Subsidiary programs, projects, and program-related activities", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Dependencies: Connections across program components and benefits", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Benefits Realization Period: How benefits are fully realized over time", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Benefits Transition and Sustainment Period: Transition from programmatic to operational levels", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.4 Program Roadmap")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The program roadmap is a chronological representation of a program's intended direction, graphically depicting dependencies between major milestones and decision points. It reflects the linkage between organizational strategy and program work, serving as a major component of the program management plan.", size: 22 })]
        }),

        // Section 7: Distinctions
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Key Distinctions: Projects, Programs, and Portfolios")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Understanding the distinctions between projects, programs, and portfolios is essential for the PgMP exam. The following table summarizes the key differences:", size: 22 })]
        }),

        // Distinctions Table
        new Paragraph({
          spacing: { before: 200, after: 100 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Table 2: Key Distinctions Between Projects, Programs, and Portfolios", size: 20, bold: true, color: colors.primary })]
        }),
        new Table({
          columnWidths: [1800, 2520, 2520, 2520],
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Aspect", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Project", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Program", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Portfolio", bold: true, size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Create unique product, service, or result", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Deliver benefits from coordinated management of related components", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Achieve strategic objectives through optimal management of components", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Focus", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Outputs and deliverables", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Outcomes and benefits", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Value and strategic alignment", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Change", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Control and manage change", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Embrace and adapt to change", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Monitor and respond to change", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Planning", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Detailed planning", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "High-level, progressive elaboration", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Strategic planning", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Management", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Project manager", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Program manager", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Portfolio manager", size: 22 })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 1800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Success", bold: true, size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Product quality, time, budget", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Benefits realization", size: 22 })] })] }),
                new TableCell({ borders: cellBorders, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER, width: { size: 2520, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Portfolio value and strategic objectives", size: 22 })] })] })
              ]
            })
          ]
        }),
        new Paragraph({ spacing: { after: 300 } }),

        // Section 8: Benefits Management
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. Benefits Management Domain")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benefits Management is a critical performance domain that defines, creates, optimizes, delivers, and sustains the benefits provided by the program. The Benefits Management life cycle consists of five key phases:", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.1 Benefits Identification")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benefits identification involves discovering and documenting benefits that the program is expected to deliver. Benefits should be aligned with organizational strategy and stakeholder expectations. This process includes identifying both tangible benefits (measurable in monetary terms) and intangible benefits (such as brand awareness, regulatory compliance, or enhanced customer experience).", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.2 Benefits Analysis and Planning")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benefits analysis and planning establishes the approach for benefits delivery, including defining benefit owners, establishing metrics and targets, mapping benefits to program components, and creating the benefits realization plan. This phase ensures that benefits are specific, measurable, achievable, relevant, and time-bound.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.3 Benefits Delivery")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benefits delivery is the execution of the benefits realization plan, ensuring that program components produce the outputs and outcomes that contribute to benefit realization. The program manager monitors progress and makes adjustments as needed to optimize benefit delivery.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.4 Benefits Transition")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benefits transition involves transferring the responsibility for ongoing benefit realization to the appropriate organizational entity. This includes transitioning operational risks, resources, training, and artifacts to the sustaining organization.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.5 Benefits Sustainment")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Benefits sustainment ensures that benefits continue to be realized after the program is closed. This involves establishing processes, measurements, metrics, and tools for tracking and maintaining benefits during ongoing operations.", size: 22 })]
        }),

        // Section 9: Governance Framework
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("9. Governance Framework Domain")] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The Governance Framework performance domain enables and performs program decision-making, establishes practices to support the program, maintains program oversight, and ensures compliance with standards and regulations. Governance occurs across all phases of a program's life cycle.", size: 22 })]
        }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("9.1 Governance Practices")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program Initiation Approval: Review and authorization of program charter and business case.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program Planning Approval: Review and approval of program management plan and subsidiary plans.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Component Authorization: Governance oversight for initiating new program components.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Stage-Gate Reviews: Decision points for assessing program progress and future direction.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Benefit Delivery Reviews: Assessment of benefits realization progress.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Program Closure Approval: Formal authorization to close the program.", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("9.2 Governance Roles")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program Sponsor: Provides funding, authority, and executive support for the program.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program Steering Committee: Provides oversight, guidance, and approval for major program decisions.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program Manager: Responsible for day-to-day program management and coordination.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Program Management Office (PMO): Provides support, standards, and oversight for program management practices.", size: 22 })] }),

        // Section 10: Exam Tips
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("10. Exam Preparation Tips")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.1 Key Exam Focus Areas")] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Know the eight program management principles thoroughly - understand each principle's statement and key characteristics.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Understand the six program management performance domains and their interactions.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Master the program life cycle phases and their associated activities and deliverables.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Understand the distinctions between project, program, and portfolio management.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Know the role and responsibilities of the program manager versus the project manager.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Understand the benefits management life cycle and its phases.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun({ text: "Know the governance framework structure and key governance roles.", size: 22 })] }),
        new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Understand the purpose and content of key program documents (business case, charter, management plan, roadmap).", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.2 Common Exam Topics")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program benefits realization and sustainment strategies", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Stakeholder engagement and communication management", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Governance structures and decision-making frameworks", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Program risk management and issue resolution", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Component authorization, oversight, and transition", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Change management at the program level", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Strategic alignment and organizational objectives", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Program closure activities and transition to operations", size: 22 })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("10.3 Study Recommendations")] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Read the Standard for Program Management Fifth Edition multiple times, focusing on key definitions and concepts.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Create flashcards for the eight principles and six performance domains.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Practice scenario-based questions that require applying principles to real-world situations.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Review the PMI Code of Ethics and Professional Conduct.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, children: [new TextRun({ text: "Understand the relationship and overlap between portfolio, program, and project management principles.", size: 22 })] }),
        new Paragraph({ numbering: { reference: bulletRef, level: 0 }, spacing: { after: 400 }, children: [new TextRun({ text: "Use the glossary to ensure you understand all key terms and definitions.", size: 22 })] }),

        // Final note
        new Paragraph({
          spacing: { before: 200, after: 200 },
          alignment: AlignmentType.CENTER,
          shading: { fill: colors.tableBg, type: ShadingType.CLEAR },
          children: [new TextRun({ text: "This guide is based on PMI's Standard for Program Management, Fifth Edition (2024).", size: 20, italics: true, color: colors.accent })]
        })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/z/my-project/download/PgMP_Exam_Preparation_Guide.docx', buffer);
  console.log('Document created successfully: PgMP_Exam_Preparation_Guide.docx');
});
