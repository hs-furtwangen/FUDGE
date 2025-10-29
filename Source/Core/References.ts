/// <reference types="webxr" preserve="true" />
/// <reference path="../../Distribution/OimoPhysics.d.ts" preserve="true"/>
/// <reference path="Debug/DebugTarget.ts"/>
/// <reference path="Debug/Debug.ts"/>
// / <reference path="Time/Time.ts"/>
/// <reference path="Math/ArrayConvertible.ts"/>
/// <reference path="Event/Event.ts"/>
/// <reference path="Recycle/RecyclableEvent.ts"/>
/// <reference path="Serialization/Mutable.ts"/>
/// <reference path="Serialization/Serializer.ts"/> 
/// <reference path="Render/RenderWebGL.ts"/>
/// <reference path="Render/RenderInjectorTexture.ts"/>
/// <reference path="Graph/Node.ts"/>
/// <reference path="Component/Component.ts"/>
/// <reference path="Recycle/RecycableArray.ts"/>
/// <reference path="Physics/HelpersPhysics.ts"/>
/// <reference path="Physics/Joint.ts"/>
/// <reference path="Physics/JointAxial.ts"/>
/// <reference path="Serialization/Project.ts"/>
/// <reference path="Texture/Texture.ts"/>
/// <reference path="Mesh/Mesh.ts"/>
/// <reference path="Material/Material.ts"/>
/// <reference path="ParticleSystem/ParticleSystem.ts"/>
/// <reference path="Component/ComponentSkeleton.ts"/>


//global functions
function ifNumber(_check: number, _default: number): number {
  return typeof _check == "undefined" ? _default : _check;
}