///<reference path="../../webgl.d.ts" />

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit {

  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  constructor() { }

  ngOnInit() {
    this.initializeCanvas();
  }

  initializeCanvas() {
    this.canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;

    this.initializeWebGL();

    if (this.gl) {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.depthFunc(this.gl.LEQUAL);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
  }

  initializeWebGL() {
    this.gl = null;

    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    if (!this.gl) {
      alert('Browser doesnt support webgl.');
    }
  }

}
