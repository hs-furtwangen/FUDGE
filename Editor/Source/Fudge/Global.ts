namespace Fudge {
  import ƒ = FudgeCore;

  export function inGraphInstance(_node: ƒ.Node, _excludeNode: boolean = true): ƒ.GraphInstance {
    let path: ƒ.Node[] = _node.getPath().reverse();
    if (_excludeNode)
      path.shift();

    for (let ancestor of path)
      if (ancestor instanceof ƒ.GraphInstance) {
        return ancestor;
      }
    return null;
  }
}