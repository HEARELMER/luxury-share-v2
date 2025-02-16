import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: '',
})
export class SvgIconComponent implements OnChanges {
  @Input() iconName: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconName']) {
      this.loadSvgIcon();
    }
  }

  private loadSvgIcon(): void {
    const iconUrl = `assets/icons/${this.iconName}.svg`;
    fetch(iconUrl)
      .then(response => response.text())
      .then(svg => {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', svg);
        this.applyStyles();
      })
      .catch(error => console.error('Error loading SVG:', error));
  }

  private applyStyles(): void {
    const svgElement = this.el.nativeElement.querySelector('svg');
    if (svgElement) {
      this.renderer.addClass(svgElement, 'svg-icon');
    }
  }
}