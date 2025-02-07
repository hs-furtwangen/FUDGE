#version 300 es
/**
 * @authors Jonas Plotzky, HFU, 2025
 */
precision mediump float;
precision highp int;

uniform vec2 u_vctTexel;
uniform vec4 u_vctColor;
uniform vec4 u_vctColorOccluded;

uniform sampler2D u_texDepthOutline;
uniform sampler2D u_texDepthScene;

in vec2 v_vctTexture;
out vec4 vctFrag;

float getDepth(vec2 _vctTexture) {
  return texture(u_texDepthOutline, _vctTexture).r;
}

void main() {
  float fDepth = getDepth(v_vctTexture);

  if (fDepth != 1.0)
    discard;

  float fDepthTop = getDepth(v_vctTexture + vec2(0, u_vctTexel.y));
  float fDepthRight = getDepth(v_vctTexture + vec2(u_vctTexel.x, 0));
  float fDepthBottom = getDepth(v_vctTexture + vec2(0, -u_vctTexel.y));
  float fDepthLeft = getDepth(v_vctTexture + vec2(-u_vctTexel.x, 0));

  float fDepthMin = min(min(fDepthTop, fDepthRight), min(fDepthBottom, fDepthLeft));
  float fDepthDelta = abs(fDepth - fDepthMin);

  if (fDepthDelta == 0.0)
    discard;

  float fDepthScene = texture(u_texDepthScene, v_vctTexture).r;
  if (fDepthMin < fDepthScene)
    vctFrag = u_vctColor;
  else
    vctFrag = u_vctColorOccluded;
}