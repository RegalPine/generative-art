/**
 * WebGL Shader management — vertex/fragment shader compilation and program linking.
 */

/** Compile a single WebGL shader */
export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    console.error(`Shader compile error: ${info}`)
    return null
  }

  return shader
}

/** Link a WebGL program from vertex + fragment shaders */
export function linkProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    console.error(`Program link error: ${info}`)
    return null
  }

  return program
}

/** Create a complete WebGL program from source strings */
export function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vs || !fs) return null

  const program = linkProgram(gl, vs, fs)

  // Shaders are linked, can delete them now
  gl.deleteShader(vs)
  gl.deleteShader(fs)

  return program
}

/** Get uniform location with caching */
export function getUniformLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
): WebGLUniformLocation | null {
  return gl.getUniformLocation(program, name)
}

/** Default vertex shader — 2D position + color + opacity */
export const DEFAULT_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec4 a_color;
  attribute float a_opacity;

  uniform vec2 u_resolution;
  uniform float u_globalOpacity;

  varying vec4 v_color;
  varying float v_opacity;

  void main() {
    // Convert pixel coords to clip space
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_color = a_color;
    v_opacity = a_opacity * u_globalOpacity;
  }
`

/** Default fragment shader — solid color with opacity */
export const DEFAULT_FRAGMENT_SHADER = `
  precision mediump float;

  varying vec4 v_color;
  varying float v_opacity;

  void main() {
    gl_FragColor = v_color * v_opacity;
  }
`

/** Gradient vertex shader — passes UV coords */
export const GRADIENT_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_uv;
  attribute vec4 a_color;
  attribute float a_opacity;

  uniform vec2 u_resolution;
  uniform float u_globalOpacity;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying float v_opacity;

  void main() {
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_uv = a_uv;
    v_color = a_color;
    v_opacity = a_opacity * u_globalOpacity;
  }
`

/** Gradient fragment shader — interpolates between color stops */
export const GRADIENT_FRAGMENT_SHADER = `
  precision mediump float;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying float v_opacity;

  uniform vec4 u_color0;
  uniform vec4 u_color1;
  uniform float u_gradientAngle;
  uniform int u_gradientType; // 0 = linear, 1 = radial

  void main() {
    float t;
    if (u_gradientType == 0) {
      // Linear gradient
      float angle = u_gradientAngle * 3.14159265 / 180.0;
      vec2 dir = vec2(cos(angle), sin(angle));
      t = dot(v_uv - 0.5, dir) + 0.5;
    } else {
      // Radial gradient
      vec2 d = v_uv - 0.5;
      t = length(d) * 2.0;
    }
    t = clamp(t, 0.0, 1.0);
    vec4 color = mix(u_color0, u_color1, t);
    gl_FragColor = color * v_opacity;
  }
`

/** Instanced vertex shader — for batch rendering */
export const INSTANCED_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec4 a_color;
  attribute float a_opacity;
  attribute vec2 a_offset;
  attribute float a_scale;
  attribute float a_rotation;

  uniform vec2 u_resolution;
  uniform float u_globalOpacity;

  varying vec4 v_color;
  varying float v_opacity;

  void main() {
    // Apply rotation
    float c = cos(a_rotation);
    float s = sin(a_rotation);
    vec2 rotated = vec2(
      a_position.x * c - a_position.y * s,
      a_position.x * s + a_position.y * c
    );

    // Apply scale and offset
    vec2 finalPos = rotated * a_scale + a_offset;

    vec2 clipSpace = (finalPos / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_color = a_color;
    v_opacity = a_opacity * u_globalOpacity;
  }
`
