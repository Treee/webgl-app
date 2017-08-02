///<reference path="../../webgl.d.ts" />

import { Component, OnInit } from '@angular/core';
import { makePerspective, Matrix, Vector } from 'sylvester-es6';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit {

  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  width: number = 640;
  height: number = 480;

  shaderProgram: WebGLProgram;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;

  squareVerticesBuffer: WebGLBuffer;

  vertexPositionAttribute: number;

  perspectiveMatrix;
  modelViewMatrix;
  constructor() { }

  ngOnInit() {
    this.initializeCanvas();
    this.initializeShaders();
    this.initializeDebugBuffers();
    this.drawScene();
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

  initializeShaders() {
    this.vertexShader = this.getShader('vertex-shader');
    this.fragmentShader = this.getShader('fragment-shader');

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, this.vertexShader);
    this.gl.attachShader(this.shaderProgram, this.fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.log(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(this.shaderProgram)}`);
      this.gl.deleteProgram(this.shaderProgram);
    }

    this.gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

  }

  initializeDebugBuffers() {
    let aspectRatio = this.height / this.width;
    this.squareVerticesBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);

    const vertices = [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  }

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.perspectiveMatrix = makePerspective(45, this.width / this.height, 0.1, 100.0);
    this.modelViewMatrix = Matrix.I(4).multiply(new Vector([-0.0, 0.0, -6.0, 1.0]));
    let translate = Matrix.I(4);
    translate.elements[0] = [0.0, 0.0, 6.0, 0.0];
    // let vector = new Vector([-0.0, 0.0, -6.0, 1.0]);
    // let identity = Matrix.I(4);
    // console.log(identity.multiply(vector));

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);
    this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
    var pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

    var mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    // this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.modelViewMatrix.flatten()));
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(translate.flatten()));
  }

  getShader(elementId: string): WebGLShader {
    let shaderElement = document.querySelector(`#${elementId}`);
    let shader, shaderText, shaderType;
    if (shaderElement) {
      shaderText = shaderElement.textContent;
      if (elementId.indexOf('vertex') > -1) {
        shaderType = this.gl.VERTEX_SHADER;
      } else if (elementId.indexOf('fragment') > -1) {
        shaderType = this.gl.FRAGMENT_SHADER;
      }
    }
    shader = this.gl.createShader(shaderType);

    this.gl.shaderSource(shader, shaderText);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(`An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`);
      this.gl.deleteShader(shader);
      shader = null;
    }
    return shader;
  }

  resizeGLViewPort(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
  }
}
