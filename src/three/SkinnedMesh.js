import { Bone, Skeleton, SkinnedMesh as _SkinnedMesh } from 'three';

export class SkinnedMesh extends _SkinnedMesh {
  constructor (geometry, material) {
    super(geometry, material);
    // r98 code
    var bones = this.initBones();
    var skeleton = new Skeleton(bones);
    this.bind(skeleton, this.matrixWorld);
    this.normalizeSkinWeights();
  }

  initBones () {
    var bones = []; var bone; var gbone;
    var i, il;
    if (this.geometry && this.geometry.bones !== undefined) {
      // first, create array of 'Bone' objects from geometry data
      for (i = 0, il = this.geometry.bones.length; i < il; i++) {
        gbone = this.geometry.bones[ i ];
        // create new 'Bone' object
        bone = new Bone();
        bones.push(bone);
        // apply values
        bone.name = gbone.name;
        bone.position.fromArray(gbone.pos);
        bone.quaternion.fromArray(gbone.rotq);
        if (gbone.scl !== undefined) bone.scale.fromArray(gbone.scl);
      }

      // second, create bone hierarchy
      for (i = 0, il = this.geometry.bones.length; i < il; i++) {
        gbone = this.geometry.bones[ i ];
        if ((gbone.parent !== -1) && (gbone.parent !== null) && (bones[ gbone.parent ] !== undefined)) {
          // subsequent bones in the hierarchy
          bones[ gbone.parent ].add(bones[ i ]);
        } else {
          // topmost bone, immediate child of the skinned mesh
          this.add(bones[ i ]);
        }
      }
    }

    // now the bones are part of the scene graph and children of the skinned mesh.
    // let's update the corresponding matrices
    this.updateMatrixWorld(true);
    return bones;
  }
}
