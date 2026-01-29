#version 300 es
precision mediump float;
precision highp int;
/**
 * Creates a fullscreen triangle which cotains the screen quad and sets the texture coordinates accordingly.
 * @authors Roland Heer, HFU, 2023 | Jirka Dell'Oro-Friedl, HFU, 2023 | Jonas Plotzky, HFU, 2023-2026
 *
 *  2  3 .
 *       .  .
 *       .     .  
 *       .        .
 *  1  1 ..........  .
 *       . screen .     .
 *       .  quad  .        .
 *  0 -1 ..........  .  .  .  .
 *    p -1        1           3
 *  t    0        1           2
 *  
 *  p == postion
 *  t == texture coordinate
 */

// uniform vec2 u_vctResolution;
uniform vec2 u_vctFramebufferSize; // the size of the bound framebuffer
uniform vec4 u_vctViewport; // the portion of the buffer to render to (x, y, width, height)

out vec2 v_vctTexture;

// #ifdef SAMPLE

//   flat out vec2[9] v_vctOffsets;

// #endif

void main() {
  float x = float((gl_VertexID % 2) * 4); // 0, 4, 0
  float y = float((gl_VertexID / 2) * 4); // 0, 0, 4
  gl_Position = vec4(x - 1.0, y - 1.0, 0.0, 1.0); // (-1, -1), (3, -1), (-1, 3)
  v_vctTexture = vec2(x / 2.0, y / 2.0);  // (0, 0), (2, 0), (0, 2) -> interpolation will yield (0, 0), (1, 0), (0, 1) as the positions are double the size of the screen
  v_vctTexture = (v_vctTexture * u_vctViewport.zw + u_vctViewport.xy) / u_vctFramebufferSize; // adjust texture coordinates to viewport within the buffer
  // TODO: using a sub-region of the framebuffer we need to clamp uvs to the edges of the viewport when sampling neighboring pixels in the fragment shaders, if this causes artifacts we need to manually clamp to the viewport bounds.

  // #ifdef SAMPLE

  //   vec2 offset = vec2(1.0 / u_vctResolution.x, 1.0 / u_vctResolution.y);
  //   v_vctOffsets = vec2[](
  //     vec2(-offset.x, offset.y),  vec2(0.0, offset.y),  vec2(offset.x, offset.y),
  //     vec2(-offset.x, 0.0),       vec2(0.0, 0.0),       vec2(offset.x, 0.0),
  //     vec2(-offset.x, -offset.y), vec2(0.0, -offset.y),  vec2(offset.x, -offset.y)
  //   );

  // #endif
}