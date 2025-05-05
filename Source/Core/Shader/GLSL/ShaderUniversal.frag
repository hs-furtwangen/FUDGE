#version 300 es
/**
* Universal Shader as base for many others. Controlled by compiler directives
* @authors Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2023
*/
precision mediump float;
precision highp int;

layout(std140) uniform Node {
  uniform mat4 u_mtxMeshToWorld; // u_mtxModel
  uniform mat3 u_mtxPivot; // texture pivot matrix
  uniform vec4 u_vctColorPrimary; // component material color

  uniform uint u_iBlendMode;
  uniform float u_fParticleSystemDuration;
  uniform float u_fParticleSystemSize;
  uniform float u_fParticleSystemTime;

  uniform bool u_bFaceCameraActive;
  uniform bool u_bFaceCameraRestrict;
};

layout(std140) uniform Camera {
  mat4 u_mtxWorldToCamera; // u_mtxView
  mat4 u_mtxProjection; 
  mat4 u_mtxWorldToView; // u_mtxViewProjection
  vec3 u_vctCamera;
};

layout(std140) uniform Material {
  uniform vec4 u_vctColor;

  uniform float u_fDiffuse;
  uniform float u_fSpecular;
  uniform float u_fIntensity;
  uniform float u_fMetallic;

  uniform float u_fAlphaClip;
};

layout(std140) uniform Fog {
  bool u_bFogActive;
  float u_fFogNear;
  float u_fFogFar;
  float fogPadding; // add padding to align to 16 bytes
  vec4 u_vctFogColor;
};

in vec3 v_vctPosition;
in vec4 v_vctColor;

layout(location = 0) out vec4 vctFrag;
layout(location = 1) out vec4 vctFragPosition; // TODO: make these optional?
layout(location = 2) out vec4 vctFragNormal;

#if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

  in vec3 v_vctNormal;

#endif

#if defined(FLAT)

  flat in vec3 v_vctPositionFlat;

#endif

#if defined(GOURAUD)

  in vec3 v_vctDiffuse;
  in vec3 v_vctSpecular;

#endif

#if defined(TOON)

  uniform sampler2D u_texToon;

#endif

#if defined(PHONG) || defined(FLAT)

  struct Light {
    vec4 vctColor;
    mat4 mtxShape;
    mat4 mtxShapeInverse;
  };

  #define MAX_LIGHTS_DIRECTIONAL 15u
  #define MAX_LIGHTS_POINT 100u
  #define MAX_LIGHTS_SPOT 100u

  layout(std140) uniform Lights { // TODO: put ambient color in header
    uint u_nLightsDirectional;
    uint u_nLightsPoint;
    uint u_nLightsSpot;
    vec4 u_vctAmbientColor; 

    Light u_directional[MAX_LIGHTS_DIRECTIONAL];
    Light u_point[MAX_LIGHTS_POINT];
    Light u_spot[MAX_LIGHTS_SPOT];
  };

  /**
   * _vctLight: direction from position to light
   * _vctView: direction from position to camera
   * _vctNormal: surface normal at position
   * _vctColor: color of the light
   */
  void illuminateDirected(vec3 _vctLightDirection, vec3 _vctViewDirection, vec3 _vctNormal, vec3 _vctColor, inout vec3 _vctDiffuse, inout vec3 _vctSpecular) {
    vec3 vctLightDirection = normalize(_vctLightDirection);

    float fDiffuse = dot(_vctNormal, vctLightDirection);

    if(fDiffuse > 0.0) {

      #if defined(TOON)
      
        fDiffuse = texture(u_texToon, vec2(fDiffuse, 0)).r;

      #endif

      _vctDiffuse += u_fDiffuse * fDiffuse * _vctColor;

      if(u_fSpecular <= 0.0 || u_fIntensity <= 0.0)
        return;
      
      //BLINN-Phong Shading
      vec3 halfwayDir = normalize(vctLightDirection + _vctViewDirection);
      float factor = fDiffuse;                  // Factor for smoothing out transition from surface facing the lightsource to surface facing away from the lightsource
      factor = 1.0 - (pow(factor - 1.0, 8.0));  // The factor is altered in order to clearly see the specular highlight even at steep angles, while still preventing artifacts

      float fSpecular = pow(max(dot(_vctNormal, halfwayDir), 0.0), exp2(u_fSpecular * 5.0)) * factor; // TODO: remove magic numbers?

      #if defined(TOON)
        
        fSpecular = texture(u_texToon, vec2(fSpecular, 0.0)).g * fDiffuse;

      #endif

      _vctSpecular += fSpecular * u_fIntensity * _vctColor;
    }
  }

#endif

#if defined(TEXTURE) || defined(MATCAP)

  uniform sampler2D u_texColor;
  in vec2 v_vctTexture;

#endif

#if defined(NORMALMAP)

  uniform sampler2D u_texNormal;
  in vec3 v_vctTangent;
  in vec3 v_vctBitangent;

#endif

float getFog(vec3 _vctPosition) {
  float fDistance = length(_vctPosition - u_vctCamera); // maybe use z-depth instead of euclidean depth
  float fFog = clamp((fDistance - u_fFogNear) / (u_fFogFar - u_fFogNear), 0.0, 1.0);
  fFog = -pow(fFog, 2.0) + (2.0 * fFog); // lets fog appear quicker and fall off slower results in a more gradual falloff
  return fFog * u_vctFogColor.a;
}

void main() {

  #if defined(FLAT)

    vec3 vctFdx = dFdx(v_vctPosition);
    vec3 vctFdy = dFdy(v_vctPosition);
    vec3 vctNormal = normalize(cross(vctFdx, vctFdy));
    vec3 vctViewDirection = normalize(u_vctCamera - v_vctPositionFlat);
    vec3 vctPosition = v_vctPositionFlat;

  #endif

  #if (defined(PHONG) || defined(GOURAUD)) && !defined(NORMALMAP)

    vec3 vctNormal = normalize(v_vctNormal);

  #endif

  #if defined(PHONG)

    vec3 vctViewDirection = normalize(u_vctCamera - v_vctPosition);
    vec3 vctPosition = v_vctPosition;

  #endif

  #if defined(NORMALMAP)

    mat3 mtxTBN = mat3(normalize(v_vctTangent), normalize(v_vctBitangent), normalize(v_vctNormal));
    vec3 vctNormal = texture(u_texNormal, v_vctTexture).xyz * 2.0 - 1.0;
    vctNormal = normalize(mtxTBN * vctNormal);

  #endif
  
  #if defined(FLAT) || defined(PHONG)

    vec3 vctDiffuse = u_fDiffuse * u_vctAmbientColor.rgb;
    vec3 vctSpecular = vec3(0, 0, 0);

    // directional lights
    for(uint i = 0u; i < u_nLightsDirectional; i++) {
      vec3 vctLightDirection = vec3(u_directional[i].mtxShape * vec4(0.0, 0.0, -1.0, 1.0));
      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_directional[i].vctColor.rgb, vctDiffuse, vctSpecular);
    }

    // point lights
    for(uint i = 0u; i < u_nLightsPoint; i++) {
      vec3 vctLightPosition = vec3(u_point[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctLightDirection = vctLightPosition - vctPosition;
      float fIntensity = 1.0 - length(mat3(u_point[i].mtxShapeInverse) * vctLightDirection);
      if(fIntensity < 0.0)
        continue;

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_point[i].vctColor.rgb * fIntensity, vctDiffuse, vctSpecular);
    }

    // spot lights
    for(uint i = 0u; i < u_nLightsSpot; i++) {
      vec3 vctLightPosition = vec3(u_spot[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctLightDirection = vctLightPosition - vctPosition;
      vec3 vctLightDirectionInverted = mat3(u_spot[i].mtxShapeInverse) * -vctLightDirection;
      if(vctLightDirectionInverted.z <= 0.0)
        continue;

      float fIntensity = 1.0 - min(1.0, 2.0 * length(vctLightDirectionInverted.xy) / vctLightDirectionInverted.z);    // Coneshape that is brightest in the center. Possible TODO: "Variable Spotlightsoftness"
      fIntensity *= 1.0 - pow(vctLightDirectionInverted.z, 2.0);                                                      // Prevents harsh lighting artifacts at boundary of the given spotlight
      if(fIntensity < 0.0)
        continue;

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_spot[i].vctColor.rgb * fIntensity, vctDiffuse, vctSpecular);
    }

  #endif

  vec4 vctColor = u_vctColor * u_vctColorPrimary * v_vctColor;

  #if defined(GOURAUD)

    vec3 vctDiffuse = v_vctDiffuse;
    vec3 vctSpecular = v_vctSpecular;

  #endif

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

    vctFrag.rgb = vctDiffuse + vctSpecular * u_fMetallic;
    vctFrag.a = 1.0;

  #else

    // MINIMAL: set the base color
    vctFrag = vctColor;

  #endif

  #if defined(TEXTURE) || defined(MATCAP)
    
    // TEXTURE: multiply with texel color
    vec4 vctColorTexture = texture(u_texColor, v_vctTexture); // has premultiplied alpha by webgl for correct filtering
    if (vctColorTexture.a > 0.0) // unpremultiply alpha
      vctColorTexture.rgb /= vctColorTexture.a; 
    vctFrag *= vctColorTexture;

  #endif

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

    vctFrag *= vctColor;
    vctFrag.rgb += vctSpecular * (1.0 - u_fMetallic);

    vctFragPosition = vec4(v_vctPosition, 1.0);
    vctFragNormal = vec4(vctNormal, 1.0);
  
  #endif

  #if !defined(PHONG) && !defined(FLAT) && !defined(GOURAUD) // MINIMAL

    vctFragPosition = vec4(0.0, 0.0, 0.0, 1.0); // (0, 0, 0) will treat occluders as non existing in ssao
    vctFragNormal = vec4(0.0, 0.0, 0.0, 1.0); // (0, 0, 0) normal will yield not occlusion in ssao
  
  #endif

  // discard pixel alltogether when transparent: don't show in Z-Buffer
  if(vctFrag.a < u_fAlphaClip)
    discard;

  if (u_bFogActive) {
    float fFog = getFog(v_vctPosition);
    vctFrag.rgb = mix(vctFrag.rgb, u_vctFogColor.rgb, fFog);

    #if defined(PARTICLE)

      if (u_iBlendMode == 2u || u_iBlendMode == 3u || u_iBlendMode == 4u)  // for blend additive, subtractive, modulate
        vctFrag.a = mix(vctFrag.a, 0.0, fFog);                          // fade out particle when in fog to make it disappear completely

    #endif
  }
}