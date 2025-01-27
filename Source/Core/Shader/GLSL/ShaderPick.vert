#version 300 es
/**
* Renders for Raycasting
* @authors Jirka Dell'Oro-Friedl, HFU, 2019
*/
uniform mat4 u_mtxMeshToWorld; // u_mtxModel

layout(std140) uniform Camera {
  mat4 u_mtxWorldToCamera; // u_mtxView
  mat4 u_mtxProjection; 
  mat4 u_mtxWorldToView; // u_mtxViewProjection
  vec3 u_vctCamera;
};

layout(location = 0) in vec3 a_vctPosition;

#if defined(TEXTURE)

  layout(location = 2) in vec2 a_vctTexture;
  out vec2 v_vctTexture;

#endif

void main() {
  gl_Position = u_mtxWorldToView * u_mtxMeshToWorld * vec4(a_vctPosition, 1.0);

  #if defined(TEXTURE)

    v_vctTexture = a_vctTexture;

  #endif
}