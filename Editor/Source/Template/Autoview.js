/**
 * Startup script to display a graph given with the resource file referred to from the html document, 
 * play its sound and add an interactive orbit camera.
 * 
 * It is highly recommended to use TypeScript for further coding. 
 * Your recommended structure for coding and some starter code is already set up for you in the folder "Script".
 * However, the code below is written in Javascript, so no compilation is required to get started.
 * The types are annotated as comments here and may become regular Javascript-code as this TC39-Proposal progresses {@link https://github.com/tc39/proposal-type-annotations}
 * 
 * Do not extend this file, but use it as a template to transfer some of its functionality to your own code. 
 * This file will should disappear as you progress...
 * 
 * Have fun creating with FUDGE!
 * @author: Jirka Dell'Oro-Friedl, HFU, 2022
 */


var ƒ = FudgeCore;
var ƒAid = FudgeAid;
window.addEventListener("load", init);

// show dialog for startup, user interaction required e.g. for starting audio
function init(_event)/* : void */ {
  let dialog/* : HTMLDialogElement */ = document.querySelector("dialog");
  dialog.querySelector("h1").textContent = document.title;
  dialog.addEventListener("click", function (_event) {
    dialog.close();
    startInteractiveViewport();
  });
  dialog.showModal();
}

// setup and start interactive viewport
async function startInteractiveViewport()/* : void */ {
  // load resources and settings referenced in the link-tags
  const mainGraph/* : ƒ.Graph */ = await ƒ.Project.loadFromHTML();
  ƒ.Debug.log("Project:", ƒ.Project.resources);

  ƒ.Debug.log("Graph:", mainGraph);
  if (!mainGraph) {
    alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
    return;
  }

  // setup the viewport
  let cmpCamera/* : ƒ.ComponentCamera */ = new ƒ.ComponentCamera();
  let canvas/* : HTMLCanvasElement */ = document.querySelector("canvas");
  let viewport/* : ƒ.Viewport */ = new ƒ.Viewport();
  viewport.initialize("InteractiveViewport", mainGraph, cmpCamera, canvas);
  ƒ.Debug.log("Viewport:", viewport);  
  // make the camera interactive (complex method in FudgeAid)
  let cameraOrbit/* : ƒ.Node */ = ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);

  // hide the cursor when interacting, also suppressing right-click menu
  canvas.addEventListener("mousedown", canvas.requestPointerLock);
  canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });

  // setup audio
  let cmpListener/* : ƒ.ComponentAudioListener */ = new ƒ.ComponentAudioListener();
  cmpCamera.node.addComponent(cmpListener);
  ƒ.AudioManager.default.listenWith(cmpListener);
  ƒ.AudioManager.default.listenTo(mainGraph);
  ƒ.Debug.log("Audio:", ƒ.AudioManager.default);

  // draw viewport once for immediate feedback
  ƒ.Render.prepare(cameraOrbit);
  viewport.draw();

  // dispatch event to signal startup done
  canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
}