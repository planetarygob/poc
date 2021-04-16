import { BackSide, CanvasTexture, Mesh, MeshBasicMaterial, Object3D, SphereGeometry } from 'three'
import SkyTexture from '../textures/SkyTexture'

class Sky extends Object3D {
    width: number
    height: number
    mesh: Mesh

    constructor(width: number, height: number) {
        super()

        // TODO : maybe set a maximum dezoom on camera of the scene to avoid texture to be too tiny

        this.width = width
        this.height = height
        
        const i = new SkyTexture(this.width, this.height)
        const t = new CanvasTexture(i.context.canvas);

        const geometry = new SphereGeometry(100, 32);
        const material = new MeshBasicMaterial({
            side: BackSide,
            map: t,
            fog: false
        });

        this.mesh = new Mesh(geometry, material)
    }
    
    /**
     * Turns out all you need to do is set an update flag. You don't need to build a new material etc.
     */
    updateSkySphere() {
        // this.mesh.material.map.needsUpdate = true;
    }
  
    scaleToWindow() {
        let widthScale = 1;
        const aspect = this.width / this.height;
    
        // IF Landscape
        if (aspect > 1) {
          widthScale = aspect * 1.1;
        } 
        // IF Portrait
        else {
          widthScale = ( widthScale / aspect ) * 1.1;
        }
    
        this.mesh.scale.x = widthScale;
        this.mesh.scale.y = widthScale;
        this.mesh.scale.z = widthScale;
    }
}

export default Sky
