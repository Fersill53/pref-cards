import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

export interface ParsedInstrument {
  name: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class OcrService {

  async scanImage(imageFile: File): Promise<ParsedInstrument[]> {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return this.parseCountSheet(text);
  }

  private parseCountSheet(text: string): ParsedInstrument[] {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
    const results: ParsedInstrument[] = [];

    for (const line of lines) {
      // Skip lines that look like headers or totals
      if (/^(item|instrument|description|qty|quantity|count|total|set name|tray)/i.test(line)) continue;
      if (/^[-=_#*]{2,}/.test(line)) continue;

      // Try to extract a number from the line (quantity)
      // Count sheets typically have: "Instrument Name   2" or "2   Instrument Name" or "Instrument x2"
      const trailingNum = line.match(/^(.+?)\s+(\d{1,3})\s*$/);
      const leadingNum = line.match(/^(\d{1,3})\s+(.+)$/);
      const xPattern = line.match(/^(.+?)\s*[xX×]\s*(\d{1,3})\s*$/);

      let name = '';
      let quantity = 1;

      if (xPattern) {
        name = xPattern[1].trim();
        quantity = parseInt(xPattern[2]);
      } else if (trailingNum) {
        name = trailingNum[1].trim();
        quantity = parseInt(trailingNum[2]);
      } else if (leadingNum) {
        name = leadingNum[2].trim();
        quantity = parseInt(leadingNum[1]);
      } else {
        // No number found — include as qty 1 if it looks like an instrument name
        if (line.length > 3 && line.length < 60 && /[a-zA-Z]{3,}/.test(line)) {
          name = line;
          quantity = 1;
        }
      }

      if (name && name.length > 2 && quantity > 0 && quantity < 100) {
        // Clean up OCR artifacts
        name = name.replace(/[|\\]/g, '').replace(/\s{2,}/g, ' ').trim();
        if (name.length > 2) {
          results.push({ name, quantity });
        }
      }
    }

    return results;
  }
}
