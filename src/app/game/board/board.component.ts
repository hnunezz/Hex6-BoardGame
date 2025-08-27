import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, input, signal } from '@angular/core';
import { axialToPixel, colorToFill, hexPolygonPath, pixelToAxial } from '../hex-utils';
import { Axial, Cell } from '../type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [NgClass],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  grid = input<Record<string, Cell>>({});
  groupSizes = input<Record<string, number>>({});
  hexSize = input(28);
  padding = input(24);
  phase = input('');

  @Output() cellSelected = new EventEmitter<Axial>();

  hexPath = hexPolygonPath(this.hexSize());

  cells = computed(() => {
    const g = this.grid();
    const gs = this.groupSizes();
    const out: Array<{ x: number; y: number; label: string; fill: string; stroke: string; opacity: number, stackColor?: string }> = [];
    for (const c of Object.values(g)) {
      const { x, y } = axialToPixel(c.coord, this.hexSize());
      const fill = c.stackColor ? colorToFill(c.stackColor) : '#3e5c76';
      const stackColor = c.stackColor;
      const stroke = '#1d2d44';
      const label = c.stackColor ? String(gs[c.id] ?? 0) : '';
      const opacity = c.blocked ? 0.35 : 1;
      out.push({ x, y, label, fill, stroke, opacity, stackColor });
    }
    return out;
  });

  viewBox = computed(() => {
    const pts = Object.values(this.grid()).map(c => axialToPixel(c.coord, this.hexSize()));
    if (!pts.length) return `0 0 300 150`;
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const minX = Math.min(...xs) - this.hexSize() - this.padding();
    const maxX = Math.max(...xs) + this.hexSize() + this.padding();
    const minY = Math.min(...ys) - this.hexSize() - this.padding();
    const maxY = Math.max(...ys) + this.hexSize() + this.padding();
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  });

  offsetX = signal(0);
  offsetY = signal(0);

  onSvgClick(ev: MouseEvent) {
    const svg = ev.currentTarget as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const inv = ctm.inverse();
    const svgP = pt.matrixTransform(inv);
    const axial = pixelToAxial(svgP.x - this.offsetX(), svgP.y - this.offsetY(), this.hexSize());
    this.cellSelected.emit(axial);
  }
}
