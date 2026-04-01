/**
 * PDF export - dynamic import of jsPDF to avoid SSR issues
 */

import type { SavedDiet } from './types';

export async function exportResultsAsPDF(savedDiet: SavedDiet | null, username: string): Promise<void> {
  if (!savedDiet) return;

  // Dynamic import to avoid SSR crash
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  const lineH = 7;
  const sectionGap = 10;

  // Helper: add text with word wrap
  function addLine(text: string, fontSize = 11, style: 'normal' | 'bold' = 'normal') {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    const lines = doc.splitTextToSize(text, pageW - margin * 2);
    lines.forEach((line: string) => {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += lineH;
    });
  }

  function addSection(title: string) {
    y += sectionGap / 2;
    if (y > 260) { doc.addPage(); y = margin; }
    doc.setDrawColor(29, 185, 84);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 4;
    addLine(title, 13, 'bold');
    y += 2;
  }

  // Header
  doc.setFillColor(19, 17, 14);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setTextColor(29, 185, 84);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Ancestral Diet Explorer', margin, 18);
  doc.setTextColor(200, 169, 110);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report for: ${username}  |  ${new Date(savedDiet.calculatedAt).toLocaleDateString()}`, margin, 26);
  doc.setTextColor(50, 50, 50);
  y = 40;

  const { blended, mendelianGenetics } = savedDiet.data;

  // Ancestry Mix
  addSection('Your Ancestry Mix');
  blended.geos.forEach((geo, i) => {
    const pct = Math.round(blended.weights[i] * 100);
    addLine(`• ${geo.name}: ${pct}%`);
  });

  // Macros
  addSection('Blended Macro Profile');
  const m = blended.blendedMacros;
  addLine(`Carbohydrates: ${m.carbs_pct}%`);
  addLine(`Protein: ${m.protein_pct}%`);
  addLine(`Fat: ${m.fat_pct}%`);

  // Foods
  if (blended.commonFoods.length) {
    addSection('Foundation Foods');
    addLine(blended.commonFoods.slice(0, 20).join(', '));
  }

  if (blended.allProteins.length) {
    addSection('Protein Sources');
    addLine(blended.allProteins.slice(0, 15).join(', '));
  }

  if (blended.allFats.length) {
    addSection('Healthy Fats');
    addLine(blended.allFats.slice(0, 10).join(', '));
  }

  // Genetics summary
  if (mendelianGenetics) {
    const { analyzeGeneticTraits } = await import('./genetics');
    const analysis = analyzeGeneticTraits(mendelianGenetics);

    if (analysis.strengths.length) {
      addSection('Genetic Strengths');
      analysis.strengths.forEach(s => {
        addLine(`${s.icon} ${s.title}`, 11, 'bold');
        addLine(s.detail, 10);
      });
    }

    if (analysis.watchItems.length) {
      addSection('Things to Watch');
      analysis.watchItems.forEach(w => {
        addLine(`${w.icon} ${w.title}`, 11, 'bold');
        addLine(w.detail, 10);
      });
    }
  }

  // Disclaimer
  y += sectionGap;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const disclaimer = 'EDUCATIONAL PURPOSE ONLY: This report is not medical advice. Consult a healthcare provider before making significant dietary changes. Genetic predictions are probabilistic estimates based on population statistics.';
  const dLines = doc.splitTextToSize(disclaimer, pageW - margin * 2);
  dLines.forEach((line: string) => {
    if (y > 280) { doc.addPage(); y = margin; }
    doc.text(line, margin, y);
    y += 5;
  });

  doc.save(`ancestral-diet-${username}.pdf`);
}
