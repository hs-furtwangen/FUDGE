#version 300 es
/**
* Renders for Raycasting
* @authors Jirka Dell'Oro-Friedl, HFU, 2019
*/
in vec3 a_vctPosition;       
uniform mat4 u_mtxMeshToWorld; // u_mtxModel
uniform mat4 u_mtxWorldToView; // u_mtxViewProjection

void main() {   
  gl_Position = u_mtxWorldToView * u_mtxMeshToWorld * vec4(a_vctPosition, 1.0);
}