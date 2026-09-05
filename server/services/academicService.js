const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const OUTPUT_DIR = path.join(__dirname, '../output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Pre-defined original built-in academic templates
const BUILTIN_TEMPLATES = [
  {
    templateId: 'diu-official',
    name: 'DIU Official Format',
    description: 'Authentic DIU standard layout with emblem crest, emerald headings, and group/single table format.',
    style: {
      primaryColor: [0.0, 0.651, 0.318], // DIU emerald green #00A651
      accentColor: [0.04, 0.31, 0.54],
      showBorders: false,
      borderType: 'none',
    },
  },
  {
    templateId: 'minimal-academic',
    name: 'Minimal Academic',
    description: 'Clean lines, elegant typography, and distraction-free layout for formal assignments.',
    style: {
      primaryColor: [0.08, 0.12, 0.18], // Deep slate
      accentColor: [0.2, 0.4, 0.8],
      showBorders: true,
      borderType: 'single-thin',
    },
  },
  {
    templateId: 'modern-university',
    name: 'Modern University',
    description: 'Contemporary academic presentation with bold headers and structured card panels.',
    style: {
      primaryColor: [0.05, 0.25, 0.45], // Academic navy
      accentColor: [0.05, 0.6, 0.45],
      showBorders: true,
      borderType: 'top-bar',
    },
  },
  {
    templateId: 'research-report',
    name: 'Research Report',
    description: 'Rigorous scholarly design with formal section blocks and double rule accents.',
    style: {
      primaryColor: [0.15, 0.15, 0.18],
      accentColor: [0.5, 0.15, 0.15], // Crimson accent
      showBorders: true,
      borderType: 'double-rule',
    },
  },
  {
    templateId: 'lab-report',
    name: 'Lab Report',
    description: 'Engineering & science structured layout with technical metadata matrix.',
    style: {
      primaryColor: [0.06, 0.35, 0.35], // Dark teal
      accentColor: [0.1, 0.5, 0.5],
      showBorders: true,
      borderType: 'corner-accents',
    },
  },
  {
    templateId: 'professional',
    name: 'Professional',
    description: 'Polished executive aesthetic for capstone projects, thesis papers, and internships.',
    style: {
      primaryColor: [0.1, 0.15, 0.25],
      accentColor: [0.3, 0.4, 0.6],
      showBorders: true,
      borderType: 'frame',
    },
  },
  {
    templateId: 'clean-monochrome',
    name: 'Clean Monochrome',
    description: 'Zero-color high-contrast design optimized for crisp laser printing and archiving.',
    style: {
      primaryColor: [0, 0, 0],
      accentColor: [0.3, 0.3, 0.3],
      showBorders: true,
      borderType: 'minimal',
    },
  },
];

// Pre-seeded generic universities database
const INITIAL_UNIVERSITIES = [
  {
    code: 'DIU',
    name: 'Daffodil International University',
    departments: [
      { name: 'Computer Science and Engineering', code: 'CSE', programs: ['B.Sc in CSE', 'M.Sc in CSE'] },
      { name: 'Software Engineering', code: 'SWE', programs: ['B.Sc in SWE'] },
      { name: 'Electrical and Electronic Engineering', code: 'EEE', programs: ['B.Sc in EEE'] },
      { name: 'Business Administration', code: 'BBA', programs: ['BBA', 'MBA'] },
      { name: 'English', code: 'ENG', programs: ['BA in English', 'MA in English'] },
    ],
    formattingRules: {
      preferredFont: 'Helvetica',
      primaryColor: '#00A651',
    },
  },
  {
    code: 'HARVARD',
    name: 'Harvard University',
    departments: [
      { name: 'School of Engineering and Applied Sciences', code: 'SEAS', programs: ['Computer Science', 'Applied Math'] },
      { name: 'Faculty of Arts and Sciences', code: 'FAS', programs: ['Economics', 'Government', 'Physics'] },
      { name: 'Harvard Business School', code: 'HBS', programs: ['MBA', 'Executive Education'] },
    ],
    formattingRules: {
      preferredFont: 'Times-Roman',
      primaryColor: '#A51C30', // Crimson
    },
  },
  {
    code: 'MIT',
    name: 'Massachusetts Institute of Technology',
    departments: [
      { name: 'Electrical Engineering and Computer Science', code: 'EECS', programs: ['Course 6-3', 'Course 6-2'] },
      { name: 'Mechanical Engineering', code: 'MECHE', programs: ['Course 2'] },
      { name: 'Physics', code: 'PHYS', programs: ['Course 8'] },
    ],
    formattingRules: {
      preferredFont: 'Helvetica',
      primaryColor: '#750014',
    },
  },
  {
    code: 'OXFORD',
    name: 'University of Oxford',
    departments: [
      { name: 'Department of Computer Science', code: 'CS', programs: ['MSc in Advanced CS', 'BA Computer Science'] },
      { name: 'Mathematical Institute', code: 'MATH', programs: ['MMath', 'MSc Mathematical Modelling'] },
      { name: 'Saïd Business School', code: 'SBS', programs: ['MBA'] },
    ],
    formattingRules: {
      preferredFont: 'Times-Roman',
      primaryColor: '#002147', // Oxford Blue
    },
  },
  {
    code: 'DU',
    name: 'University of Dhaka',
    departments: [
      { name: 'Computer Science and Engineering', code: 'CSE', programs: ['B.Sc in CSE', 'M.S in CSE'] },
      { name: 'Physics', code: 'PHYS', programs: ['B.Sc in Physics'] },
      { name: 'Finance', code: 'FIN', programs: ['BBA in Finance', 'MBA'] },
    ],
    formattingRules: {
      preferredFont: 'Helvetica',
      primaryColor: '#0047AB',
    },
  },
];

/**
 * Generate a single Cover Page PDF using pdf-lib vector drawing
 */
const generateCoverPdf = async (data = {}) => {
  const {
    templateId = 'minimal-academic',
    courseInfo = {},
    instructorInfo = {},
    studentInfo = {},
    submissionInfo = {},
    institution = 'Academic Institution',
  } = data;

  const doc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89 points
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Dedicated Authentic DIU Official Cover Page Vector Generation
  if (templateId === 'diu-official') {
    const diuGreen = rgb(0.0, 0.651, 0.318); // #00A651
    const textBlack = rgb(0.05, 0.05, 0.05);

    // 1. Embed and Draw Authentic DIU Crest Emblem
    let embeddedImg = null;
    if (data.logoBase64 && typeof data.logoBase64 === 'string' && data.logoBase64.length > 50) {
      try {
        const cleanBase64 = data.logoBase64.replace(/^data:image\/\w+;base64,/, '');
        embeddedImg = await doc.embedPng(Buffer.from(cleanBase64, 'base64'));
      } catch (e) {
        try {
          const cleanBase64 = data.logoBase64.replace(/^data:image\/\w+;base64,/, '');
          embeddedImg = await doc.embedJpg(Buffer.from(cleanBase64, 'base64'));
        } catch (e2) {}
      }
    }
    if (!embeddedImg) {
      const defaultLogoPath = path.join(__dirname, '../../client/src/assets/diu_crest_logo.png');
      if (fs.existsSync(defaultLogoPath)) {
        try {
          embeddedImg = await doc.embedPng(fs.readFileSync(defaultLogoPath));
        } catch (e) {}
      }
    }

    if (embeddedImg) {
      const targetH = 100;
      const aspect = embeddedImg.width / embeddedImg.height;
      const drawW = targetH * aspect;
      page.drawImage(embeddedImg, {
        x: (width - drawW) / 2,
        y: height - 150,
        width: drawW,
        height: targetH,
      });
    }

    // 2. University Name in Emerald Green
    const uniText = institution || 'Daffodil International University';
    const uniWidth = fontBold.widthOfTextAtSize(uniText, 21);
    page.drawText(uniText, {
      x: (width - uniWidth) / 2,
      y: height - 190,
      size: 21,
      font: fontBold,
      color: diuGreen,
    });

    // 3. Document Type (Assignment / Lab Report) in Emerald Green
    const docType = courseInfo.documentType || courseInfo.assignmentType || 'Assignment';
    const docTypeWidth = fontBold.widthOfTextAtSize(docType, 16);
    page.drawText(docType, {
      x: (width - docTypeWidth) / 2,
      y: height - 235,
      size: 16,
      font: fontBold,
      color: diuGreen,
    });

    // 4. Course Details
    const cName = `Course name: ${courseInfo.courseName || courseInfo.courseTitle || 'Working capital Management'}`;
    const cNameW = fontRegular.widthOfTextAtSize(cName, 12);
    page.drawText(cName, {
      x: (width - cNameW) / 2,
      y: height - 275,
      size: 12,
      font: fontRegular,
      color: textBlack,
    });

    const cCode = `Course Code: ${courseInfo.courseCode || 'FIN-408'}`;
    const cCodeW = fontRegular.widthOfTextAtSize(cCode, 12);
    page.drawText(cCode, {
      x: (width - cCodeW) / 2,
      y: height - 298,
      size: 12,
      font: fontRegular,
      color: textBlack,
    });

    // 5. Submitted To
    const subToText = 'Submitted To';
    const subToW = fontBold.widthOfTextAtSize(subToText, 14);
    page.drawText(subToText, {
      x: (width - subToW) / 2,
      y: height - 400,
      size: 14,
      font: fontBold,
      color: diuGreen,
    });

    const tName = instructorInfo.teacherName || 'Sabrina Akter';
    const tNameW = fontBold.widthOfTextAtSize(tName, 12);
    page.drawText(tName, {
      x: (width - tNameW) / 2,
      y: height - 428,
      size: 12,
      font: fontBold,
      color: textBlack,
    });

    const tDesig = instructorInfo.designation || 'Assistant Professor';
    const tDesigW = fontRegular.widthOfTextAtSize(tDesig, 11);
    page.drawText(tDesig, {
      x: (width - tDesigW) / 2,
      y: height - 448,
      size: 11,
      font: fontRegular,
      color: textBlack,
    });

    const tDept = instructorInfo.department || 'Department of Business Administration';
    const tDeptW = fontRegular.widthOfTextAtSize(tDept, 11);
    page.drawText(tDept, {
      x: (width - tDeptW) / 2,
      y: height - 466,
      size: 11,
      font: fontRegular,
      color: textBlack,
    });

    // 6. Submitted By
    const subByText = 'Submitted By';
    const subByW = fontBold.widthOfTextAtSize(subByText, 14);
    page.drawText(subByText, {
      x: (width - subByW) / 2,
      y: height - 565,
      size: 14,
      font: fontBold,
      color: diuGreen,
    });

    // Group or Single Student Table
    const isGroup = data.submissionMode === 'group' || (data.groupMembers && data.groupMembers.length > 0);
    const members = isGroup
      ? (data.groupMembers && data.groupMembers.length > 0
          ? data.groupMembers
          : [
              { name: 'Md Motiur Rahman Emon', id: '171-11-5477' },
              { name: 'Md Nasim Ali', id: '171-11-5435' },
            ])
      : [
          {
            name: studentInfo.studentName || 'Md Motiur Rahman Emon',
            id: studentInfo.studentId || '171-11-5477',
          },
        ];

    if (!isGroup && data.singleFormat === 'details') {
      const sName = studentInfo.studentName || 'Md Motiur Rahman Emon';
      const sNameW = fontBold.widthOfTextAtSize(sName, 12);
      page.drawText(sName, {
        x: (width - sNameW) / 2,
        y: height - 595,
        size: 12,
        font: fontBold,
        color: textBlack,
      });
      const sId = `ID: ${studentInfo.studentId || '171-11-5477'}`;
      const sIdW = fontRegular.widthOfTextAtSize(sId, 11);
      page.drawText(sId, {
        x: (width - sIdW) / 2,
        y: height - 613,
        size: 11,
        font: fontRegular,
        color: textBlack,
      });
      if (studentInfo.department) {
        const sDeptW = fontRegular.widthOfTextAtSize(studentInfo.department, 10.5);
        page.drawText(studentInfo.department, {
          x: (width - sDeptW) / 2,
          y: height - 631,
          size: 10.5,
          font: fontRegular,
          color: textBlack,
        });
      }
    } else {
      // Draw Table with Black Borders matching sample image
      const tblWidth = 440;
      const tblX = (width - tblWidth) / 2;
      const rowHeight = 24;
      let curY = height - 600;

      // Table Header: Name | ID
      page.drawRectangle({
        x: tblX,
        y: curY - rowHeight,
        width: tblWidth,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1.5,
      });
      page.drawLine({
        start: { x: tblX + tblWidth / 2, y: curY },
        end: { x: tblX + tblWidth / 2, y: curY - rowHeight },
        thickness: 1.5,
        color: rgb(0, 0, 0),
      });

      const nameHdrW = fontBold.widthOfTextAtSize('Name', 11);
      page.drawText('Name', {
        x: tblX + tblWidth / 4 - nameHdrW / 2,
        y: curY - 16,
        size: 11,
        font: fontBold,
        color: textBlack,
      });

      const idHdrW = fontBold.widthOfTextAtSize('ID', 11);
      page.drawText('ID', {
        x: tblX + (3 * tblWidth) / 4 - idHdrW / 2,
        y: curY - 16,
        size: 11,
        font: fontBold,
        color: textBlack,
      });

      curY -= rowHeight;

      // Table Rows
      for (const m of members) {
        page.drawRectangle({
          x: tblX,
          y: curY - rowHeight,
          width: tblWidth,
          height: rowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1.5,
        });
        page.drawLine({
          start: { x: tblX + tblWidth / 2, y: curY },
          end: { x: tblX + tblWidth / 2, y: curY - rowHeight },
          thickness: 1.5,
          color: rgb(0, 0, 0),
        });

        const mName = m.name || '';
        const mNameW = fontRegular.widthOfTextAtSize(mName, 10.5);
        page.drawText(mName, {
          x: tblX + tblWidth / 4 - mNameW / 2,
          y: curY - 16,
          size: 10.5,
          font: fontRegular,
          color: textBlack,
        });

        const mId = m.id || '';
        const mIdW = fontRegular.widthOfTextAtSize(mId, 10.5);
        page.drawText(mId, {
          x: tblX + (3 * tblWidth) / 4 - mIdW / 2,
          y: curY - 16,
          size: 10.5,
          font: fontRegular,
          color: textBlack,
        });

        curY -= rowHeight;
      }
    }

    const pdfBytes = await doc.save();
    const filename = `cover_${uuidv4()}.pdf`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, pdfBytes);

    return { filename, filepath, pdfBytes };
  }

  const tpl = BUILTIN_TEMPLATES.find((t) => t.templateId === templateId) || BUILTIN_TEMPLATES[0];
  const pColor = rgb(tpl.style.primaryColor[0], tpl.style.primaryColor[1], tpl.style.primaryColor[2]);
  const aColor = rgb(tpl.style.accentColor[0], tpl.style.accentColor[1], tpl.style.accentColor[2]);
  const slateText = rgb(0.1, 0.15, 0.22);
  const mutedText = rgb(0.4, 0.45, 0.52);

  // Decorative border / frame based on template style
  if (tpl.style.borderType === 'top-bar') {
    page.drawRectangle({
      x: 0,
      y: height - 16,
      width,
      height: 16,
      color: pColor,
    });
    page.drawRectangle({
      x: 0,
      y: height - 20,
      width,
      height: 4,
      color: aColor,
    });
  } else if (tpl.style.borderType === 'frame' || tpl.style.borderType === 'single-thin') {
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1.5,
    });
    page.drawRectangle({
      x: 34,
      y: 34,
      width: width - 68,
      height: height - 68,
      borderColor: rgb(0.92, 0.94, 0.96),
      borderWidth: 0.8,
    });
  } else if (tpl.style.borderType === 'double-rule') {
    page.drawLine({
      start: { x: 40, y: height - 40 },
      end: { x: width - 40, y: height - 40 },
      thickness: 2,
      color: pColor,
    });
    page.drawLine({
      start: { x: 40, y: height - 44 },
      end: { x: width - 40, y: height - 44 },
      thickness: 0.7,
      color: aColor,
    });
  }

  // 1. Institution Name (Top Header)
  const instText = (institution || studentInfo.institution || 'ACADEMIC INSTITUTION').toUpperCase();
  const instWidth = fontBold.widthOfTextAtSize(instText, 15);
  page.drawText(instText, {
    x: (width - instWidth) / 2,
    y: height - 75,
    size: 15,
    font: fontBold,
    color: pColor,
  });

  const deptText = studentInfo.department || courseInfo.department || 'Department of Computer Science & Engineering';
  const deptWidth = fontRegular.widthOfTextAtSize(deptText, 11);
  page.drawText(deptText, {
    x: (width - deptWidth) / 2,
    y: height - 95,
    size: 11,
    font: fontRegular,
    color: mutedText,
  });

  // Center Logo or Heraldic Emblem
  let logoDrawn = false;
  if (data.logoBase64 && typeof data.logoBase64 === 'string' && data.logoBase64.length > 20) {
    try {
      const cleanBase64 = data.logoBase64.replace(/^data:image\/\w+;base64,/, '');
      const imgBuffer = Buffer.from(cleanBase64, 'base64');
      let embeddedImg = null;
      try {
        embeddedImg = await doc.embedPng(imgBuffer);
      } catch (pngErr) {
        try {
          embeddedImg = await doc.embedJpg(imgBuffer);
        } catch (jpgErr) {
          console.warn('Could not embed custom logo as PNG or JPG:', jpgErr.message);
        }
      }

      if (embeddedImg) {
        const targetDim = data.logoSize || 70;
        const aspect = embeddedImg.width / embeddedImg.height;
        let drawW = targetDim;
        let drawH = targetDim / aspect;
        if (drawH > targetDim) {
          drawH = targetDim;
          drawW = targetDim * aspect;
        }
        const logoY = height - 165;
        page.drawImage(embeddedImg, {
          x: width / 2 - drawW / 2,
          y: logoY - drawH / 2,
          width: drawW,
          height: drawH,
        });
        logoDrawn = true;
      }
    } catch (err) {
      console.warn('Error processing logo image in generateCoverPdf:', err.message);
    }
  }

  if (!logoDrawn) {
    // Center Emblem Placeholder Box
    page.drawCircle({
      x: width / 2,
      y: height - 150,
      size: 28,
      borderColor: rgb(0.8, 0.85, 0.9),
      borderWidth: 1.5,
      color: rgb(0.96, 0.98, 1),
    });
    const sealInitials = (institution.split(' ').map((w) => w[0]).slice(0, 3).join('') || 'DIU').toUpperCase();
    const sealWidth = fontBold.widthOfTextAtSize(sealInitials, 12);
    page.drawText(sealInitials, {
      x: width / 2 - sealWidth / 2,
      y: height - 154,
      size: 12,
      font: fontBold,
      color: pColor,
    });
  }

  // 2. Assignment / Project Badge
  const docTypeStr = courseInfo.documentType || courseInfo.assignmentType || 'ASSIGNMENT';
  const numStr = courseInfo.assignmentNo ? ` #${courseInfo.assignmentNo}` : '';
  const assignType = `${docTypeStr}${numStr}`.toUpperCase();
  const badgeWidth = fontBold.widthOfTextAtSize(assignType, 10);
  const badgeX = (width - badgeWidth - 24) / 2;
  page.drawRectangle({
    x: badgeX,
    y: height - 235,
    width: badgeWidth + 24,
    height: 22,
    color: rgb(0.93, 0.96, 0.99),
    borderColor: rgb(0.8, 0.88, 0.96),
    borderWidth: 1,
  });
  page.drawText(assignType, {
    x: badgeX + 12,
    y: height - 229,
    size: 10,
    font: fontBold,
    color: pColor,
  });

  // 3. Assignment Topic / Title (Hero center)
  const topicText = courseInfo.assignmentTitle || courseInfo.assignmentTopic || 'Analysis and Architectural Design of Distributed Systems';
  const topicFontSize = topicText.length > 50 ? 16 : 19;
  // Word wrap for long titles
  const words = topicText.split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach((w) => {
    const testLine = currentLine ? `${currentLine} ${w}` : w;
    if (fontBold.widthOfTextAtSize(testLine, topicFontSize) > width - 120) {
      lines.push(currentLine);
      currentLine = w;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);

  let titleY = height - 280;
  lines.forEach((line) => {
    const lineWidth = fontBold.widthOfTextAtSize(line, topicFontSize);
    page.drawText(line, {
      x: (width - lineWidth) / 2,
      y: titleY,
      size: topicFontSize,
      font: fontBold,
      color: slateText,
    });
    titleY -= topicFontSize + 6;
  });

  // 4. Course Details
  const courseCode = courseInfo.courseCode ? `[${courseInfo.courseCode}] ` : '';
  const courseNameVal = courseInfo.courseName || courseInfo.courseTitle || 'Computer Science Principles';
  const courseFull = `${courseCode}${courseNameVal}`;
  const courseWidth = fontOblique.widthOfTextAtSize(courseFull, 12);
  page.drawText(courseFull, {
    x: (width - courseWidth) / 2,
    y: titleY - 10,
    size: 12,
    font: fontOblique,
    color: aColor,
  });

  // Dividing Divider line
  page.drawLine({
    start: { x: 100, y: titleY - 30 },
    end: { x: width - 100, y: titleY - 30 },
    thickness: 1,
    color: rgb(0.88, 0.9, 0.94),
  });

  // 5. Two-column Info Panels: "Submitted To" & "Submitted By"
  const colY = titleY - 70;
  const leftColX = 70;
  const rightColX = width / 2 + 25;

  // Submitted To
  page.drawText('SUBMITTED TO', {
    x: leftColX,
    y: colY,
    size: 10,
    font: fontBold,
    color: mutedText,
  });
  page.drawLine({
    start: { x: leftColX, y: colY - 5 },
    end: { x: leftColX + 110, y: colY - 5 },
    thickness: 1.5,
    color: pColor,
  });

  const teacherName = instructorInfo.teacherName || 'Prof. Dr. Sarah Jenkins';
  page.drawText(teacherName, {
    x: leftColX,
    y: colY - 26,
    size: 13,
    font: fontBold,
    color: slateText,
  });
  page.drawText(instructorInfo.designation || 'Associate Professor', {
    x: leftColX,
    y: colY - 42,
    size: 10,
    font: fontRegular,
    color: mutedText,
  });
  page.drawText(instructorInfo.department || 'Department of CSE', {
    x: leftColX,
    y: colY - 56,
    size: 10,
    font: fontRegular,
    color: mutedText,
  });
  page.drawText(instructorInfo.institution || institution || '', {
    x: leftColX,
    y: colY - 70,
    size: 9.5,
    font: fontRegular,
    color: mutedText,
  });

  // Submitted By
  page.drawText('SUBMITTED BY', {
    x: rightColX,
    y: colY,
    size: 10,
    font: fontBold,
    color: mutedText,
  });
  page.drawLine({
    start: { x: rightColX, y: colY - 5 },
    end: { x: rightColX + 110, y: colY - 5 },
    thickness: 1.5,
    color: pColor,
  });

  const studentName = studentInfo.studentName || 'Alex M. Turner';
  page.drawText(studentName, {
    x: rightColX,
    y: colY - 26,
    size: 13,
    font: fontBold,
    color: slateText,
  });
  const idText = `Student ID: ${studentInfo.studentId || '211-15-4098'}`;
  page.drawText(idText, {
    x: rightColX,
    y: colY - 42,
    size: 10,
    font: fontBold,
    color: aColor,
  });
  const secSem = `Section: ${studentInfo.section || 'A'}  |  Semester: ${studentInfo.semester || 'Spring 2026'}`;
  page.drawText(secSem, {
    x: rightColX,
    y: colY - 56,
    size: 10,
    font: fontRegular,
    color: mutedText,
  });
  page.drawText(studentInfo.department || 'Computer Science & Engineering', {
    x: rightColX,
    y: colY - 70,
    size: 9.5,
    font: fontRegular,
    color: mutedText,
  });

  // 6. Submission Date Box at bottom
  const subDate = submissionInfo.submissionDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dateCardY = 75;
  page.drawRectangle({
    x: width / 2 - 130,
    y: dateCardY,
    width: 260,
    height: 34,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.88, 0.9, 0.94),
    borderWidth: 1,
  });
  const dateLabel = `Date of Submission: ${subDate}`;
  const dateLabelWidth = fontRegular.widthOfTextAtSize(dateLabel, 10);
  page.drawText(dateLabel, {
    x: (width - dateLabelWidth) / 2,
    y: dateCardY + 12,
    size: 10,
    font: fontBold,
    color: slateText,
  });

  // Footer Tagline
  const footerNote = 'Generated via PDFnerd Academic Studio';
  const footerWidth = fontRegular.widthOfTextAtSize(footerNote, 7.5);
  page.drawText(footerNote, {
    x: (width - footerWidth) / 2,
    y: 35,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.65, 0.7, 0.76),
  });

  const pdfBytes = await doc.save();
  const filename = `cover_${uuidv4()}.pdf`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, pdfBytes);

  return { filename, filepath, pdfBytes };
};

/**
 * Multi-page Academic Document Builder:
 * Assembles Cover + Student Info + Declaration + Acknowledgement + Certificate + Table of Contents + References
 */
const buildAcademicDocument = async (spec = {}) => {
  const {
    coverData = {},
    sections = {
      cover: true,
      declaration: true,
      acknowledgement: true,
      certificate: true,
      toc: true,
      references: true,
    },
    declarationText,
    acknowledgementText,
    certificateText,
    referencesList = [],
  } = spec;

  const doc = await PDFDocument.create();
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Helper to add standard formatted text page
  const addTextPage = (pageTitle, paragraphs = [], pageNumber = 2) => {
    const page = doc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    // Top Header line
    page.drawText(coverData.institution || 'ACADEMIC INSTITUTION', {
      x: 50,
      y: height - 40,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6),
    });
    page.drawLine({
      start: { x: 50, y: height - 48 },
      end: { x: width - 50, y: height - 48 },
      thickness: 0.8,
      color: rgb(0.85, 0.88, 0.92),
    });

    // Page Title
    page.drawText(pageTitle.toUpperCase(), {
      x: 50,
      y: height - 90,
      size: 16,
      font: fontBold,
      color: rgb(0.08, 0.12, 0.18),
    });
    page.drawLine({
      start: { x: 50, y: height - 100 },
      end: { x: 130, y: height - 100 },
      thickness: 2,
      color: rgb(0.15, 0.4, 0.8),
    });

    let textY = height - 135;
    paragraphs.forEach((rawP) => {
      const subLines = String(rawP).split('\n');
      subLines.forEach((p) => {
        const trimmed = p.trim();
        if (!trimmed) {
          textY -= 14;
          return;
        }
        const words = trimmed.split(/\s+/);
        let line = '';
        words.forEach((w) => {
          const test = line ? `${line} ${w}` : w;
          if (fontRegular.widthOfTextAtSize(test, 10.5) > width - 100) {
            page.drawText(line, { x: 50, y: textY, size: 10.5, font: fontRegular, color: rgb(0.15, 0.18, 0.22) });
            textY -= 17;
            line = w;
          } else {
            line = test;
          }
        });
        if (line) {
          page.drawText(line, { x: 50, y: textY, size: 10.5, font: fontRegular, color: rgb(0.15, 0.18, 0.22) });
          textY -= 18;
        }
      });
      textY -= 8; // Paragraph spacing
    });

    // Page number in footer
    const pageNumText = `${pageNumber}`;
    page.drawText(pageNumText, {
      x: width / 2,
      y: 35,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.5),
    });
  };

  // 1. Cover Page
  if (sections.cover !== false) {
    const coverRes = await generateCoverPdf(coverData);
    const coverDoc = await PDFDocument.load(coverRes.pdfBytes);
    const [copiedCover] = await doc.copyPages(coverDoc, [0]);
    doc.addPage(copiedCover);
  }

  let pageCounter = 2;

  // 2. Declaration Page
  if (sections.declaration) {
    const student = coverData.studentInfo?.studentName || 'The Student';
    const topic = coverData.courseInfo?.assignmentTopic || 'this project';
    const defaultDecl = declarationText || [
      `I hereby declare that this assignment / report titled "${topic}" is entirely my own original academic work carried out under proper guidance.`,
      `Any material that has been taken from other sources or authors has been duly recognized and formally cited in the references section according to university academic integrity guidelines.`,
      `This report has not been submitted previously in whole or in part for any other degree, diploma, or academic award at any other institution.`,
      `Date: ${new Date().toLocaleDateString()} \n\n_______________________\nSignature of the Student\n${student}`,
    ];
    addTextPage('Declaration', Array.isArray(defaultDecl) ? defaultDecl : [defaultDecl], pageCounter++);
  }

  // 3. Acknowledgement Page
  if (sections.acknowledgement) {
    const teacher = coverData.instructorInfo?.teacherName || 'our honorable course instructor';
    const defaultAck = acknowledgementText || [
      `First and foremost, I express my sincere gratitude to the Almighty for the grace and perseverance required to complete this academic report.`,
      `I would like to convey my deep appreciation to ${teacher} for providing valuable counsel, insightful feedback, and continuous encouragement throughout the semester.`,
      `I also extend my warm thanks to my department faculty, classmates, and family for their unwavering support and resources during the research and writing process.`,
    ];
    addTextPage('Acknowledgement', Array.isArray(defaultAck) ? defaultAck : [defaultAck], pageCounter++);
  }

  // 4. Certificate Page
  if (sections.certificate) {
    const teacher = coverData.instructorInfo?.teacherName || 'Supervisor';
    const defaultCert = certificateText || [
      `This is to certify that the assignment / project report entitled "${coverData.courseInfo?.assignmentTopic || 'Academic Report'}" submitted by ${coverData.studentInfo?.studentName || 'Student'} (ID: ${coverData.studentInfo?.studentId || 'N/A'}) has been conducted and prepared under my academic supervision.`,
      `To the best of my knowledge, this report embodies genuine work and adheres to the standards of the department.`,
      `\n\n_______________________\n${teacher}\n${coverData.instructorInfo?.designation || 'Faculty Member'}\nDepartment of ${coverData.studentInfo?.department || 'CSE'}`,
    ];
    addTextPage('Certificate of Approval', Array.isArray(defaultCert) ? defaultCert : [defaultCert], pageCounter++);
  }

  // 5. Table of Contents
  if (sections.toc) {
    const tocEntries = [
      '1. Introduction & Background .................................................... Page 5',
      '2. Theoretical Foundations & Literature ..................................... Page 8',
      '3. Methodology & System Architecture ....................................... Page 12',
      '4. Implementation & Analysis ..................................................... Page 18',
      '5. Experimental Results & Discussion ........................................ Page 24',
      '6. Conclusion & Future Perspectives .......................................... Page 28',
      '7. References & Bibliography ..................................................... Page 30',
    ];
    addTextPage('Table of Contents', tocEntries, pageCounter++);
  }

  // 6. References Page
  if (sections.references) {
    const defaultRefs = referencesList.length > 0 ? referencesList : [
      '[1] Smith, J. & Taylor, M. (2024). Principles of Modern Computational Architecture. Journal of Computing, 18(3), 112-128.',
      '[2] Vaswani, A., et al. (2017). Attention Is All You Need. Advances in Neural Information Processing Systems, 30, 5998-6008.',
      '[3] IEEE Standards Association. (2022). IEEE Standard for Software Quality Assurance Processes. IEEE Std 730-2022.',
      '[4] ISO/IEC. (2020). Information technology — Document description and processing languages. ISO/IEC 19005-4.',
    ];
    addTextPage('References & Bibliography', defaultRefs, pageCounter++);
  }

  const pdfBytes = await doc.save();
  const filename = `academic_doc_${uuidv4()}.pdf`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, pdfBytes);

  return { filename, filepath, pageCount: doc.getPageCount(), pdfBytes };
};

module.exports = {
  BUILTIN_TEMPLATES,
  INITIAL_UNIVERSITIES,
  generateCoverPdf,
  buildAcademicDocument,
};
