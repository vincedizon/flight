import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css'
})
export class SplashComponent implements OnInit, AfterViewInit {
  isExiting = false;

  private statusMessages = [
    'INITIALIZING FLIGHT SYSTEMS',
    'CALIBRATING NAVIGATION ARRAY',
    'SCANNING FLIGHT CORRIDORS',
    'SYNCING SKYPASS NETWORK',
    'CLEARED FOR DEPARTURE',
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.isExiting = true;
      setTimeout(() => {
        this.router.navigate(['/event-register']);
      }, 1200);
    }, 6500);
  }

  ngAfterViewInit() {
    this.generateStars();
    this.generateParticles();
    this.cycleStatusText();
  }

  private generateStars() {
    const layer = document.getElementById('starsLayer');
    if (!layer) return;

    const starCount = 80;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 70; // Stars only in upper 70% of screen
      const dur = (Math.random() * 3 + 2).toFixed(1);
      const delay = (Math.random() * 5).toFixed(1);
      const minOp = (Math.random() * 0.3 + 0.1).toFixed(2);
      const maxOp = (Math.random() * 0.5 + 0.4).toFixed(2);

      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --dur: ${dur}s;
        --delay: -${delay}s;
        --min-op: ${minOp};
        --max-op: ${maxOp};
      `;
      layer.appendChild(star);
    }
  }

  private generateParticles() {
    const layer = document.getElementById('particlesLayer');
    if (!layer) return;

    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 2 + 0.5;
      const x = Math.random() * 100;
      const dur = (Math.random() * 8 + 6).toFixed(1);
      const delay = (Math.random() * 10).toFixed(1);
      const xStart = `${(Math.random() - 0.5) * 40}px`;
      const xEnd = `${(Math.random() - 0.5) * 80}px`;
      const maxOp = (Math.random() * 0.3 + 0.1).toFixed(2);

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        --dur: ${dur}s;
        --delay: -${delay}s;
        --x-start: ${xStart};
        --x-end: ${xEnd};
        --max-op: ${maxOp};
      `;
      layer.appendChild(p);
    }
  }

  private cycleStatusText() {
    const el = document.getElementById('statusText');
    if (!el) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % this.statusMessages.length;
      if (el) {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          if (el) {
            el.textContent = this.statusMessages[index];
            el.style.opacity = '1';
          }
        }, 300);
      }
      if (index === this.statusMessages.length - 1) {
        clearInterval(interval);
      }
    }, 1200);
  }
}