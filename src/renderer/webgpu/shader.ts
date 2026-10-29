/**
 * WebGPU Shader — WGSL shader modules for WebGPU rendering.
 */

/** Vertex shader for basic 2D rendering */
export const BASIC_VERTEX_SHADER = /* wgsl */ `
struct VertexInput {
  @location(0) position: vec2<f32>,
  @location(1) color: vec4<f32>,
  @location(2) opacity: f32,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>,
  @location(1) opacity: f32,
}

struct Uniforms {
  resolution: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  // Convert normalized [0,1] coords to clip space [-1,1]
  let pixelPos = input.position * uniforms.resolution;
  let clipPos = vec2<f32>(
    (pixelPos.x / uniforms.resolution.x) * 2.0 - 1.0,
    1.0 - (pixelPos.y / uniforms.resolution.y) * 2.0
  );
  output.position = vec4<f32>(clipPos, 0.0, 1.0);
  output.color = input.color;
  output.opacity = input.opacity;
  return output;
}
`

/** Fragment shader for basic rendering */
export const BASIC_FRAGMENT_SHADER = /* wgsl */ `
struct FragmentInput {
  @location(0) color: vec4<f32>,
  @location(1) opacity: f32,
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  return vec4<f32>(input.color.rgb, input.color.a * input.opacity);
}
`

/** Gradient vertex shader with UV */
export const GRADIENT_VERTEX_SHADER = /* wgsl */ `
struct VertexInput {
  @location(0) position: vec2<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) color: vec4<f32>,
  @location(3) opacity: f32,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @location(2) opacity: f32,
}

struct Uniforms {
  resolution: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  let pixelPos = input.position * uniforms.resolution;
  let clipPos = vec2<f32>(
    (pixelPos.x / uniforms.resolution.x) * 2.0 - 1.0,
    1.0 - (pixelPos.y / uniforms.resolution.y) * 2.0
  );
  output.position = vec4<f32>(clipPos, 0.0, 1.0);
  output.uv = input.uv;
  output.color = input.color;
  output.opacity = input.opacity;
  return output;
}
`

/** Gradient fragment shader */
export const GRADIENT_FRAGMENT_SHADER = /* wgsl */ `
struct FragmentInput {
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @location(2) opacity: f32,
}

struct GradientUniforms {
  color0: vec4<f32>,
  color1: vec4<f32>,
  angle: f32,
  gradientType: f32, // 0=linear, 1=radial
}

@group(1) @binding(0) var<uniform> gradient: GradientUniforms;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  var t: f32;
  if (gradient.gradientType > 0.5) {
    // Radial
    let dist = distance(input.uv, vec2<f32>(0.5, 0.5));
    t = clamp(dist * 2.0, 0.0, 1.0);
  } else {
    // Linear
    let cosA = cos(gradient.angle);
    let sinA = sin(gradient.angle);
    t = clamp(input.uv.x * cosA + input.uv.y * sinA, 0.0, 1.0);
  }
  let gradColor = mix(gradient.color0, gradient.color1, t);
  return vec4<f32>(gradColor.rgb, gradColor.a * input.opacity);
}
`

/** Load a WGSL shader module */
export function loadShaderModule(
  device: GPUDevice,
  code: string,
): GPUShaderModule {
  return device.createShaderModule({ code })
}
