#version 300 es
/**
* Universal Shader as base for many others. Controlled by compiler directives
* @authors 2021, Luis Keck, HFU, 2021 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2023
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

layout(location = 0) in vec3 a_vctPosition;
layout(location = 3) in vec4 a_vctColor; // TODO: think about making vertex color optional

out vec3 v_vctPosition;
out vec4 v_vctColor;

#if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

  layout(location = 1) in vec3 a_vctNormal;
  out vec3 v_vctNormal;

#endif

#if defined(FLAT)

  flat out vec3 v_vctPositionFlat;

#endif

#if defined(GOURAUD)

  out vec3 v_vctDiffuse;
  out vec3 v_vctSpecular;

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

  void illuminateDirected(vec3 _vctDirection, vec3 _vctView, vec3 _vctNormal, vec3 _vctColor, inout vec3 _vctDiffuse, inout vec3 _vctSpecular) {
    vec3 vctDirection = normalize(_vctDirection);
    float fIllumination = -dot(_vctNormal, vctDirection);
    if(fIllumination > 0.0) {
      _vctDiffuse += u_fDiffuse * fIllumination * _vctColor;

      if(u_fSpecular <= 0.0)
        return;

      //BLINN
      vec3 halfwayDir = normalize(-vctDirection - _vctView);
      float factor = max(dot(-vctDirection, _vctNormal), 0.0); //Factor for smoothing out transition from surface facing the lightsource to surface facing away from the lightsource
      factor = 1.0 - (pow(factor - 1.0, 8.0));                 //The factor is altered in order to clearly see the specular highlight even at steep angles, while still preventing artifacts

      _vctSpecular += pow(max(dot(_vctNormal, halfwayDir), 0.0), exp2(u_fSpecular * 5.0)) * u_fSpecular * u_fIntensity * factor * _vctColor;

      //PHONG (old)
      // vec3 vctReflection = normalize(reflect(-vctDirection, _vctNormal));
      // float fHitCamera = dot(vctReflection, _vctView);
      // _vctSpecular += pow(max(fHitCamera, 0.0), u_fSpecular * 10.0) * u_fSpecular * _vctColor; // 10.0 = magic number, looks good... 
    }
  }

#endif

#if defined(TEXTURE) || defined(NORMALMAP)

  layout(location = 2) in vec2 a_vctTexture;
  out vec2 v_vctTexture;

#endif

#if defined(NORMALMAP)

  layout(location = 4) in vec4 a_vctTangent;
  out vec3 v_vctTangent;
  out vec3 v_vctBitangent;

#endif

// MATCAP: offer buffers for UVs and pivot matrix
#if defined(MATCAP) // MatCap-shader generates texture coordinates from surface normals

  layout(location = 1) in vec3 a_vctNormal;
  out vec2 v_vctTexture;

#endif

#if defined(SKIN)

  // Bones https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl.js
  layout(location = 5) in uvec4 a_vctBones;
  layout(location = 6) in vec4 a_vctWeights;

  const uint MAX_BONES = 256u; // CAUTION: this number must be the same as in RenderInjectorSkeletonInstance where the corresponding buffers are created
  layout(std140) uniform Skin {
    mat4 u_mtxBones[MAX_BONES];
  };

#endif

#if defined(PARTICLE)

  uniform sampler2D u_particleSystemRandomNumbers;

  float fetchRandomNumber(int _iOffset, int _iParticleSystemRandomNumbersSize, int _iParticleSystemRandomNumbersLength) {
    _iOffset = gl_InstanceID + _iOffset % _iParticleSystemRandomNumbersLength;
    return texelFetch(u_particleSystemRandomNumbers, ivec2(_iOffset % _iParticleSystemRandomNumbersSize, _iOffset / _iParticleSystemRandomNumbersSize), 0).r;
  }

#endif

mat4 lookAtCamera(mat4 _mtxWorld, bool _bRestrict) {
  vec3 vctUp = vec3(0.0, 1.0, 0.0);

  vec3 vctPosition = _mtxWorld[3].xyz;

  // vec3 zAxis = normalize(u_vctCamera - vctPosition); // look at camera position
  vec3 zAxis = normalize(-vec3(u_mtxWorldToCamera[0].z, u_mtxWorldToCamera[1].z, u_mtxWorldToCamera[2].z)); // look in camera direction

  vec3 xAxis = normalize(cross(vctUp, zAxis));
  vec3 yAxis = _bRestrict ? vctUp : normalize(cross(zAxis, xAxis));
  zAxis = _bRestrict ? normalize(cross(xAxis, vctUp)) : zAxis;

  vec3 vctScale = vec3(length(_mtxWorld[0].xyz), length(_mtxWorld[1].xyz), length(_mtxWorld[2].xyz));

  mat4 billboardMatrix = mat4(
    vec4(xAxis * vctScale.x, 0.0),
    vec4(yAxis * vctScale.y, 0.0),
    vec4(zAxis * vctScale.z, 0.0),
    vec4(vctPosition, 1.0)
  );

  return billboardMatrix;
}

void main() {

  vec4 vctPosition = vec4(a_vctPosition, 1.0);
  mat4 mtxMeshToWorld = u_mtxMeshToWorld;

  // if (u_bBillboardActive) 
  //   mtxMeshToWorld = lookAtCamera(mtxMeshToWorld, u_bBillboardRestrict);

  #if defined(PARTICLE)
  
    float fParticleId = float(gl_InstanceID);
    int iParticleSystemRandomNumbersSize = textureSize(u_particleSystemRandomNumbers, 0).x; // the dimension of the quadratic texture
    int iParticleSystemRandomNumbersLength = iParticleSystemRandomNumbersSize * iParticleSystemRandomNumbersSize; // the total number of texels in the texture
    /*$variables*/
    /*$mtxLocal*/
    /*$mtxWorld*/
    mtxMeshToWorld = /*$mtxWorld*/ mtxMeshToWorld /*$mtxLocal*/;
    if(u_bFaceCameraActive) 
      mtxMeshToWorld = lookAtCamera(mtxMeshToWorld, u_bFaceCameraRestrict);

  #endif

  #if defined(SKIN)

    mtxMeshToWorld = a_vctWeights.x * u_mtxBones[a_vctBones.x] +
      a_vctWeights.y * u_mtxBones[a_vctBones.y] +
      a_vctWeights.z * u_mtxBones[a_vctBones.z] +
      a_vctWeights.w * u_mtxBones[a_vctBones.w];

  #endif

  mat4 mtxMeshToView = u_mtxWorldToView * mtxMeshToWorld;

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG) || defined(MATCAP) // only these work with particle and skinning

    mat4 mtxNormalMeshToWorld = transpose(inverse(mtxMeshToWorld));

  #endif

  gl_Position = mtxMeshToView * vctPosition; 
  vctPosition = mtxMeshToWorld * vctPosition;

  v_vctColor = a_vctColor;
  v_vctPosition = vctPosition.xyz;

  #if defined(PARTICLE_COLOR)

    v_vctColor *= /*$color*/;

  #endif

  #if defined(FLAT)

    v_vctPositionFlat = v_vctPosition;
    
  #endif

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

    v_vctNormal = mat3(mtxNormalMeshToWorld) * a_vctNormal; // unnormalized as it must be normalized in the fragment shader anyway

  #endif 

  #if defined(NORMALMAP)

    v_vctTangent = mat3(mtxNormalMeshToWorld) * a_vctTangent.xyz;
    v_vctBitangent = cross(v_vctNormal, v_vctTangent) * a_vctTangent.w;

  #endif

  #if defined(GOURAUD)
  
    vec3 vctView = normalize(vctPosition.xyz - u_vctCamera);
    vec3 vctNormal = normalize(v_vctNormal);
    v_vctDiffuse = u_fDiffuse * u_vctAmbientColor.rgb;
    v_vctSpecular = vec3(0, 0, 0);

    // calculate directional light effect
    for(uint i = 0u; i < u_nLightsDirectional; i ++) {
      vec3 vctDirection = vec3(u_directional[i].mtxShape * vec4(0.0, 0.0, 1.0, 1.0));
      illuminateDirected(vctDirection, vctView, vctNormal, u_directional[i].vctColor.rgb, v_vctDiffuse, v_vctSpecular);
    }

    // calculate point light effect
    for(uint i = 0u;i < u_nLightsPoint;i ++) {
      vec3 vctPositionLight = vec3(u_point[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctDirection = vctPosition.xyz - vctPositionLight;
      float fIntensity = 1.0 - length(mat3(u_point[i].mtxShapeInverse) * vctDirection);
      if(fIntensity < 0.0) continue;

      illuminateDirected(vctDirection, vctView, vctNormal, u_point[i].vctColor.rgb * fIntensity, v_vctDiffuse, v_vctSpecular);
    }

    // calculate spot light effect
    for(uint i = 0u;i < u_nLightsSpot;i ++) {
      vec3 vctPositionLight = vec3(u_spot[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctDirection = vctPosition.xyz - vctPositionLight;
      vec3 vctDirectionInverted = mat3(u_spot[i].mtxShapeInverse) * vctDirection;
      if(vctDirectionInverted.z <= 0.0) continue;

      float fIntensity = 1.0 - min(1.0, 2.0 * length(vctDirectionInverted.xy) / vctDirectionInverted.z);    //Coneshape that is brightest in the center. Possible TODO: "Variable Spotlightsoftness"
      fIntensity *= 1.0 - pow(vctDirectionInverted.z, 2.0);                                                 //Prevents harsh lighting artifacts at boundary of the given spotlight
      if(fIntensity < 0.0) continue;

      illuminateDirected(vctDirection, vctView, vctNormal, u_spot[i].vctColor.rgb * fIntensity, v_vctDiffuse, v_vctSpecular);
    }

  #endif

    // TEXTURE: transform UVs
  #if defined(TEXTURE) || defined(NORMALMAP)

    v_vctTexture = vec2(u_mtxPivot * vec3(a_vctTexture, 1.0)).xy;

  #endif

  #if defined(MATCAP)

    vec4 vctVertexInCamera = normalize(u_mtxWorldToCamera * vctPosition);
    vctVertexInCamera.xy *= - 1.0;
    mat4 mtx_RotX = mat4(1, 0, 0, 0, 0, vctVertexInCamera.z, vctVertexInCamera.y, 0, 0, - vctVertexInCamera.y, vctVertexInCamera.z, 0, 0, 0, 0, 1);
    mat4 mtx_RotY = mat4(vctVertexInCamera.z, 0, - vctVertexInCamera.x, 0, 0, 1, 0, 0, vctVertexInCamera.x, 0, vctVertexInCamera.z, 0, 0, 0, 0, 1);

    vec3 vctNormal = mat3(mtxNormalMeshToWorld) * a_vctNormal;

    // adds correction for things being far and to the side, but distortion for things being close
    vctNormal = mat3(mtx_RotX * mtx_RotY) * vctNormal;

    vec3 vctReflection = normalize(mat3(u_mtxWorldToCamera) * normalize(vctNormal));
    vctReflection.y = - vctReflection.y;

    v_vctTexture = 0.5 * vctReflection.xy + 0.5;

  #endif
}