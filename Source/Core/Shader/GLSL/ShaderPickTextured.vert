#version 300 es
/**
* Renders for Raycasting
* @authors Jirka Dell'Oro-Friedl, HFU, 2019
*/
in vec3 a_vctPosition;       
in vec2 a_vctTexture;
uniform mat4 u_mtxMeshToWorld; // u_mtxModel
uniform mat4 u_mtxWorldToView; // u_mtxViewProjection
uniform mat3 u_mtxPivot;

out vec2 v_vctTexture;

void main() {   
  gl_Position = u_mtxWorldToView * u_mtxMeshToWorld * vec4(a_vctPosition, 1.0);
  v_vctTexture = (u_mtxPivot * vec3(a_vctTexture, 1.0)).xy;
}