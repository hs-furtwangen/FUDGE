#version 300 es
/**
* Renders for Raycasting
* @authors Jirka Dell'Oro-Friedl, HFU, 2019
*/
precision mediump float;
precision highp int;

uniform int u_id;
uniform int u_size;
uniform vec4 u_vctColor;
out ivec4 vctFrag;

#if defined(TEXTURE)

  uniform sampler2D u_texColor;
  in vec2 v_vctTexture;

#endif

void main() {
  int pixel = int(gl_FragCoord.x) + u_size * int(gl_FragCoord.y);

  if (pixel != u_id)
    discard;
  
  vec4 vctColor = u_vctColor;
  
  #if defined(TEXTURE)

    vctColor *= texture(u_texColor, v_vctTexture);

  #endif

  uint icolor = uint(vctColor.r * 255.0) << 24 | uint(vctColor.g * 255.0) << 16 | uint(vctColor.b * 255.0) << 8 | uint(vctColor.a * 255.0);
  
  vctFrag = ivec4(floatBitsToInt(gl_FragCoord.z), icolor, 0, 0);

  #if defined(TEXTURE)

    vctFrag.b = floatBitsToInt(v_vctTexture.x);
    vctFrag.a = floatBitsToInt(v_vctTexture.y);

  #endif
}