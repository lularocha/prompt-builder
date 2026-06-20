import {
  AlignmentType,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from "docx";

const BODY_FONT = "Arial";
const CODE_FONT = "Courier New";

// Half-point sizes (docx uses half-points). 22 = 11pt.
const BODY_SIZE = 22;
const CODE_SIZE = 20;
const HEADING_SIZE: Record<number, number> = {
  1: 32,
  2: 28,
  3: 26,
  4: 24,
  5: 24,
  6: 24,
};

// Parse inline **bold** and `code` into styled runs (everything else Arial).
function parseInline(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), font: BODY_FONT, size: BODY_SIZE }));
    }
    if (m[1] != null) {
      runs.push(new TextRun({ text: m[1], bold: true, font: BODY_FONT, size: BODY_SIZE }));
    } else if (m[2] != null) {
      runs.push(new TextRun({ text: m[2], font: CODE_FONT, size: CODE_SIZE }));
    }
    last = re.lastIndex;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), font: BODY_FONT, size: BODY_SIZE }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text: "", font: BODY_FONT, size: BODY_SIZE }));
  }
  return runs;
}

function markdownToParagraphs(markdown: string): Paragraph[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const paragraphs: Paragraph[] = [];
  let inCode = false;

  for (const line of lines) {
    // Code fence toggle
    if (/^\s*```/.test(line)) {
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      paragraphs.push(
        new Paragraph({
          shading: { type: ShadingType.CLEAR, color: "auto", fill: "F2F2F2" },
          spacing: { after: 0 },
          children: [new TextRun({ text: line || " ", font: CODE_FONT, size: CODE_SIZE })],
        }),
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      paragraphs.push(
        new Paragraph({
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: heading[2].trim(),
              bold: true,
              font: BODY_FONT,
              size: HEADING_SIZE[level],
            }),
          ],
        }),
      );
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 60 },
          children: parseInline(bullet[1]),
        }),
      );
      continue;
    }

    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (numbered) {
      paragraphs.push(
        new Paragraph({
          numbering: { reference: "ordered", level: 0 },
          spacing: { after: 60 },
          children: parseInline(numbered[1]),
        }),
      );
      continue;
    }

    if (line.trim() === "") {
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    paragraphs.push(
      new Paragraph({ spacing: { after: 120 }, children: parseInline(line) }),
    );
  }

  return paragraphs;
}

/** Convert markdown to a formatted .docx Blob (Arial body, monospace code). */
export async function markdownToDocxBlob(markdown: string): Promise<Blob> {
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "ordered",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [{ children: markdownToParagraphs(markdown) }],
  });

  return Packer.toBlob(doc);
}
