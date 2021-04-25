<template>
    <div>
        <WebGL />
        <PlanetModal />
        <DialogModal />
    </div>
</template>

<script lang="ts">

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventBusManager from '../../assets/js/managers/EventBusManager'
import CustomInteractionManager from '../../assets/js/managers/CustomInteractionManager'
import { BoxHelper, BufferGeometryUtils, Group, Mesh, Object3D, Vector3 } from 'three'

export default {
    components: {
        WebGL
    },

    data: () => ({
        gl: null as unknown as GL,
        scenery: null as any,
        customInteractionManager: null as any,
        animation: null as any,
        scissors: null as any,
        skirt: null as any,
        selectedObjects: [] as any,
        initialPosition: new Vector3(0, 0, 0) as Vector3,
        isAboveSkirt: false,

        scissorsHelper: BoxHelper,
        scissorsGroup: Group,
        scissorsDragBox: Mesh
    }),

    mounted () {
        this.gl = GL.getInstance()
        
        const axesHelper = new THREE.AxesHelper( 5 )
        this.gl.scene.add( axesHelper )
        

        const gltfLoader = new GLTFLoader()
        gltfLoader.load('https://florianblandin.fr/assets/scenery_planet_skirt.glb', (gltf) => {
            this.scenery = gltf.scene
            this.scenery.rotation.set(0, Math.PI, 0)
            this.scenery.position.set(0, 0, 0)
            this.scenery.scale.set(0.02, 0.02, 0.02)
            this.gl.scene.add(this.scenery)

            this.gl.mixer = new THREE.AnimationMixer(this.scenery)
            this.animation = this.gl.mixer.clipAction(gltf.animations[0])
            // NOTE :  Why do we need to specify number of repetitions ?
            this.animation.setLoop(THREE.LoopOnce, 1)

            this.createLight()

            this.scenery.traverse((child: any) => {
                if (child.name === 'scissors') {
                    this.scissors = child
                }
                if (child.name === 'skirt') {
                    this.skirt = child
                }
            })

            if (this.scissors) {
                // NOTE : We indicate that scissors are an interactive & draggable object
                this.gl.objects.push(this.scissors) // Draggable
                this.gl.dragControls.transformGroup = true

                this.addSelectedObject(this.scissors) // Interactive
                this.gl.highlightManager.outlinePass.selectedObjects = this.selectedObjects

                this.initialPosition = this.scissors.position

                this.scissors.addEventListener('mouseover', (e: any) => {
                    // NOTE : We will able to fire an event to Custom Cursor 
                    document.body.style.cursor = 'pointer';
                })

                this.gl.dragControls.addEventListener('dragstart', this.onDragStart)
                this.gl.dragControls.addEventListener('dragend', this.onDragEnd)

                this.gl.interactionManager.add(this.scissors)
                this.gl.interactionManager.add(this.skirt)
            }
        }, 
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        (error) => {
            console.log(error);
        })
    }, 
    methods : {
        createLight() {
            const themeLight = new THREE.PointLight('#ffffff', 3, 8)
            themeLight.position.set(this.scenery.position.x, this.scenery.position.y + 2, this.scenery.position.z)
            this.gl.scene.add(themeLight)
        },
        addSelectedObject(object: any) {
            this.selectedObjects = [];
            this.selectedObjects.push(object);
        },
        playAnimation() {
            this.animation.play()
            this.animation.clampWhenFinished = true
        },
        skirtHovered() {
            this.isAboveSkirt = true
        },

        // ---------------- DRAGCONTROLS
        onDragStart() {
            this.skirt.addEventListener('mouseover', this.skirtHovered)
        },
        onDragEnd() {
            if (this.isAboveSkirt) {
                // EventBusManager.getInstance().emitter.emit("ui:display_planet_modal")
                this.playAnimation()
            }
            this.skirt.removeEventListener('mouseover', this.skirtHovered)
        },
    }
}
</script>

<style>
</style>