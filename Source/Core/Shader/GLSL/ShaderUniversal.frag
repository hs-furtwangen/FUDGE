#version 300 es
/**
* Universal Shader as base for many others. Controlled by compiler directives
* @authors Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2023
*/
precision mediump float;
precision highp int;

layout(std140) uniform Object {
  // transform data
  uniform mat4 u_mtxModel;

  // surface instance data
  uniform mat3 u_mtxPivot; // texture pivot matrix
  uniform vec4 u_vctObjectColor; // component material color

  // particle system data
  uniform uint u_iBlendMode;
  uniform float u_fParticleSystemDuration;
  uniform float u_fParticleSystemSize;
  uniform float u_fParticleSystemTime;

  uniform bool u_bFaceCameraActive;
  uniform bool u_bFaceCameraRestrict;
};

layout(std140) uniform View {
  mat4 u_mtxView;
  mat4 u_mtxProjection; 
  mat4 u_mtxViewProjection;
  vec3 u_vctCamera;
};

layout(std140) uniform Material {
  uniform vec4 u_vctMaterialColor;

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
    float fShadowLayer; // -1 = no shadow, otherwise index in shadow array
  };

  #define MAX_LIGHTS_DIRECTIONAL 15u
  #define MAX_LIGHTS_POINT 100u
  #define MAX_LIGHTS_SPOT 100u
  #define MAX_SHADOW_SLOTS 20u // dir/spot = 1 slot, point = 6 slots

  layout(std140) uniform Lights { // TODO: put ambient color in header
    uint u_nLightsDirectional;
    uint u_nLightsPoint;
    uint u_nLightsSpot;
    vec4 u_vctAmbientColor; 

    Light u_directional[MAX_LIGHTS_DIRECTIONAL];
    Light u_point[MAX_LIGHTS_POINT];
    Light u_spot[MAX_LIGHTS_SPOT];
  };

  layout(std140) uniform Shadows {
    float u_fShadowTexelSize; // used for biasing
    uint u_iSoftShadowSampleCount; // used for pcf sampling
    vec4 u_fSoftShadowKernel[32];

    mat4 u_mtxShadows[MAX_SHADOW_SLOTS]; // light space view projection matrices
    vec4 u_shadowParameters[MAX_SHADOW_SLOTS]; // x bias, y normalBias, z blur
  };

  /**
   * _vctLight: direction from position to light
   * _vctView: direction from position to camera
   * _vctNormal: surface normal at position
   * _vctColor: color of the light
   */
  void illuminateDirected(vec3 _vctLightDirection, vec3 _vctViewDirection, vec3 _vctNormal, vec3 _vctColor, float _attenuation, inout vec3 _vctDiffuse, inout vec3 _vctSpecular) {
    float fDiffuse = dot(_vctNormal, _vctLightDirection);

    if(fDiffuse > 0.0) {

      #if defined(TOON)
      
        fDiffuse = texture(u_texToon, vec2(fDiffuse, 0)).r;

      #endif

      _vctDiffuse += u_fDiffuse * fDiffuse * _vctColor * _attenuation;

      if(u_fSpecular <= 0.0 || u_fIntensity <= 0.0)
        return;
      
      //BLINN-Phong Shading
      vec3 halfwayDir = normalize(_vctLightDirection + _vctViewDirection);
      float factor = fDiffuse;                  // Factor for smoothing out transition from surface facing the lightsource to surface facing away from the lightsource
      factor = 1.0 - (pow(factor - 1.0, 8.0));  // The factor is altered in order to clearly see the specular highlight even at steep angles, while still preventing artifacts

      float fSpecular = pow(max(dot(_vctNormal, halfwayDir), 0.0), exp2(u_fSpecular * 5.0)) * factor; // TODO: remove magic numbers?

      #if defined(TOON)
        
        fSpecular = texture(u_texToon, vec2(fSpecular, 0.0)).g * fDiffuse;

      #endif

      _vctSpecular += fSpecular * u_fIntensity * _vctColor * _attenuation;
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

#if defined(SHADOW)

  uniform mediump sampler2DArrayShadow u_texShadowMap;

  int getCubeFace(vec3 _dirFromLight) {
    vec3 a = abs(_dirFromLight);

    if (a.x >= a.y && a.x >= a.z)
      return _dirFromLight.x > 0.0 ? 0 : 1; // +X, -X

    if (a.y >= a.z)
      return _dirFromLight.y > 0.0 ? 2 : 3; // +Y, -Y

    return _dirFromLight.z > 0.0 ? 4 : 5;   // +Z, -Z
  }

  // float offsetLookup(mediump sampler2DArrayShadow _sampler, int _layer, float _texelSize, vec3 _shadowCoord, vec2 offset) {
  //   return texture(_sampler, vec4(_shadowCoord.xy + offset * _texelSize, float(_layer), _shadowCoord.z));
  // }

  float quickHash(vec2 _pos) {
	  const vec3 magic = vec3(0.06711056f, 0.00583715f, 52.9829189f);
	  return fract(magic.z * fract(dot(_pos, magic.xy)));
  }

  float sampleShadow(mediump sampler2DArrayShadow _sampler, int _layer, mat4 _mtxShadow, vec4 _shadowParameters, vec3 _position, vec3 _normal, vec3 _lightDirection) { // TODO: the biasing in this function might only be applicable to directional lights, check point and spot shadows
    // biasing from godot directional shadow
    // vec3 baseNormalBias = _normal * (1.0 - max(0.0, -dot(_lightDirection, _normal)));
    // vec3 normalBias = _normal * (1.0 - max(0.0, -dot(_lightDirection, _normal))) * _shadowParameters.y;

    vec3 bias = _normal * _shadowParameters.y; // calculate normal bias
    bias -= _lightDirection * dot(_lightDirection, bias); // remove component of normal bias in the direction of the light
    bias += _lightDirection * _shadowParameters.x; // add constant bias in the direction to the light

    vec4 position = _mtxShadow * vec4(_position + bias, 1.0);
    vec3 shadowCoord = position.xyz / position.w;

    // filtering from godot shadow

    if (u_iSoftShadowSampleCount == 0u) 
      return texture(_sampler, vec4(shadowCoord.xy, float(_layer), shadowCoord.z));

    mat2 diskRotation;
    {
      float r = quickHash(gl_FragCoord.xy) * 2.0 * 3.14159265; // random rotation based on screen position to reduce banding artifacts
      float sr = sin(r);
      float cr = cos(r);
      diskRotation = mat2(vec2(cr, -sr), vec2(sr, cr));
    }

    float avg = 0.0;
    for (uint i = 0u; i < u_iSoftShadowSampleCount; i++) 
      avg += texture(_sampler, vec4(shadowCoord.xy + u_fShadowTexelSize * _shadowParameters.z * (diskRotation * u_fSoftShadowKernel[i].xy), float(_layer), shadowCoord.z));

    return avg / float(u_iSoftShadowSampleCount);
  }

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

    vec3 vctDiffuse = vec3(0, 0, 0);
    vec3 vctSpecular = vec3(0, 0, 0);

    // directional lights
    for(uint i = 0u; i < u_nLightsDirectional; i++) {
      vec3 vctLightDirection = normalize(-u_directional[i].mtxShape[2].xyz); // directional light direction is the inverted forward vector of the light's transform

      float fAttenuation = 1.0;

      #if defined(SHADOW)

        int iShadow = int(u_directional[i].fShadowLayer);
        if (iShadow > -1) {
          fAttenuation *= sampleShadow(u_texShadowMap, iShadow, u_mtxShadows[iShadow], u_shadowParameters[iShadow], v_vctPosition, v_vctNormal, vctLightDirection);
        }

      #endif

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_directional[i].vctColor.rgb, fAttenuation, vctDiffuse, vctSpecular);
    }

    // point lights
    for(uint i = 0u; i < u_nLightsPoint; i++) {
      vec3 vctLightPosition = u_point[i].mtxShape[3].xyz; // light position is the translation component of the light's transform
      vec3 vctLight = vctLightPosition - vctPosition;
      float fAttenuation = 1.0 - length(mat3(u_point[i].mtxShapeInverse) * vctLight);
      if(fAttenuation < 0.0)
        continue;

      vec3 vctLightDirection = normalize(vctLight);

      #if defined(SHADOW)

        int iShadowBase = int(u_point[i].fShadowLayer);
        if (iShadowBase > -1) {
          int iShadow = iShadowBase + getCubeFace(-vctLight);
          fAttenuation *= sampleShadow(u_texShadowMap, iShadow, u_mtxShadows[iShadow], u_shadowParameters[iShadowBase], v_vctPosition, v_vctNormal, vctLightDirection);
        }
        
      #endif

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_point[i].vctColor.rgb, fAttenuation, vctDiffuse, vctSpecular);
    }

    // spot lights
    for(uint i = 0u; i < u_nLightsSpot; i++) {
      Light spotLight = u_spot[i];
      vec3 vctLightPosition = spotLight.mtxShape[3].xyz; // position is the translation component of the light's transform
      vec3 vctLight = vctLightPosition - vctPosition;
      vec3 vctLightLocal = mat3(spotLight.mtxShapeInverse) * -vctLight;
      if(vctLightLocal.z <= 0.0)
        continue;

      float fAttenuation = 1.0 - min(1.0, 2.0 * length(vctLightLocal.xy) / vctLightLocal.z);    // Coneshape that is brightest in the center. Possible TODO: "Variable Spotlightsoftness"
      fAttenuation *= 1.0 - pow(vctLightLocal.z, 2.0);                                                   // Prevents harsh lighting artifacts at boundary of the given spotlight
      
      if(fAttenuation < 0.0)
        continue;

      vec3 vctLightDirection = normalize(vctLight);

      #if defined(SHADOW)

        int iShadow = int(u_spot[i].fShadowLayer);
        if (iShadow > -1) {
          fAttenuation *= sampleShadow(u_texShadowMap, iShadow, u_mtxShadows[iShadow], u_shadowParameters[iShadow], v_vctPosition, v_vctNormal, vctLightDirection);
        }

      #endif

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_spot[i].vctColor.rgb, fAttenuation, vctDiffuse, vctSpecular);
    }

    vctDiffuse = vctDiffuse + u_fDiffuse * u_vctAmbientColor.rgb;

  #endif

  vec4 vctColor = u_vctMaterialColor * u_vctObjectColor * v_vctColor;

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