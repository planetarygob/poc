import { InteractionManager } from "three.interactive"
import { WebGLRenderer, PerspectiveCamera, Object3D, Mesh } from "three";

class CustomInteractionManager {
    private static instance: CustomInteractionManager
    interactionManager: InteractionManager

    constructor (renderer: WebGLRenderer, camera: PerspectiveCamera) {
        this.interactionManager = new InteractionManager(renderer, camera, renderer.domElement)
    }

    // TODO : Do not need to pass renderer & camera since they're passed on constructor
    public static getInstance (renderer: WebGLRenderer, camera: PerspectiveCamera): CustomInteractionManager {
        if (!CustomInteractionManager.instance) {
            CustomInteractionManager.instance = new CustomInteractionManager(renderer, camera);
        }
 
        return CustomInteractionManager.instance;
    }

    public add (object: Object3D|Mesh) {
        this.interactionManager.add(object)
    }

    public remove (object: Object3D|Mesh) {
        this.interactionManager.remove(object)
    }

    public update () {
        this.interactionManager.update()
    }

    public dispose () {
        this.interactionManager.dispose()
    }

    public checkIntersection (object: Object3D|Mesh) {
        this.interactionManager.checkIntersection(object)
    }
}

export default CustomInteractionManager