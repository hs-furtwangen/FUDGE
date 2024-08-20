namespace Fudge {
  import ƒ = FudgeCore;

  export function inGraphInstance(_node: ƒ.Node): ƒ.GraphInstance {
    console.log(_node.getPath().reverse());
    for (let ancestor of _node.getPath().reverse())
      if (ancestor instanceof ƒ.GraphInstance) {
        return ancestor;
      }
    return null;
  }
}