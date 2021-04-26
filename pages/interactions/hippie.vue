<template>
    <div>
        <WebGL />
    </div>
</template>

<script lang="ts">

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AnimationMixer, AxesHelper, LoopOnce, Object3D, PointLight } from 'three'

export default {
    components: {
        WebGL
    },

    data: () => ({
        gl: GL as any,
        scenery: null as any,
        customInteractionManager: null as any,
        animation: null as any,
        target: Object3D as any,
        tool: Object3D as any,
        selectedObjects: [] as any,
        isAboveGun: false,
    }),

    mounted () {
        this.gl = GL.getInstance()

        const gltfLoader = new GLTFLoader()

        gltfLoader.load('https://florianblandin.fr/assets/scenery_planet_hippie.glb', (gltf) => {
            this.scenery = gltf.scene
            this.scenery.rotation.set(0, Math.PI, 0)
            this.scenery.position.set(0, 0, 0)
            this.scenery.scale.set(0.02, 0.02, 0.02)
            this.gl.scene.add(this.scenery)
            this.createLight()

            // _____________________________________________________________

            this.gl.mixer = new AnimationMixer(this.scenery) // x
            this.animation = this.gl.mixer.clipAction(gltf.animations[0]) // x
            // NOTE :  Why do we need to specify number of repetitions ?
            this.animation.setLoop(LoopOnce, 1) // x 

            // NOTE : Maybe we should dynamise the string depending on the planet we're on, adding a key tool & a key target in the scenery object ?
            this.scenery.traverse((child: any) => {
                if (child.name === 'flowerbandana') {
                    this.tool = child
                }
                if (child.name === 'gun') {
                    this.target = child
                }
            }) // x

            if (this.tool && this.target) {
                // NOTE : We indicate that scissors are an interactive & draggable object$
                this.gl.dragControls.transformGroup = true
                this.gl.objects.push(this.tool) // Draggable
                this.addSelectedObject(this.tool) // Highlighted

                // NOTE : Would be cool to rename selectedObjects to highlightedObjects
                this.gl.highlightManager.outlinePass.selectedObjects = this.selectedObjects

                this.tool.addEventListener('mouseover', (e: any) => {
                    // NOTE : We will able to fire an event to Custom Cursor 
                    document.body.style.cursor = 'pointer';
                })

                this.gl.dragControls.addEventListener('dragstart', this.onDragStart)
                this.gl.dragControls.addEventListener('dragend', this.onDragEnd)

                this.gl.interactionManager.add(this.tool)
                this.gl.interactionManager.add(this.target)
            } else {
                console.error("Tool or Target undefined : ", this.tool, this.target)
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
        // NOTE : Maybe we should call a createSceneryLights that would take params such as position
        createLight() {
            const themeLight = new PointLight('#ffffff', 3, 8)
            themeLight.position.set(this.scenery.position.x, this.scenery.position.y + 2, this.scenery.position.z)
            this.gl.scene.add(themeLight)
        },
        // NOTE : Maybe we should rename that function to addHighlightedObject and she would be in the HighlightManager given the fact it's a Singleton
        addSelectedObject(object: any) {
            this.selectedObjects = [];
            this.selectedObjects.push(object);
        },
        // NOTE : A function in the AnimationManager that takes an animation as param ? 
        launchAnimation() {
            this.animation.play()
            this.animation.clampWhenFinished = true
        },

        toggleTargetState() {
            this.isAboveGun = !this.isAboveGun
            console.log(this.isAboveGun ? "LE FUSI LO" : "PA LE FUSI LO")
        },

        onDragStart() {
            this.target.addEventListener('mouseover', this.toggleTargetState)
            this.target.addEventListener('mouseout', this.toggleTargetState)
        },

        onDragEnd() {
            this.target.removeEventListener('mouseover', this.toggleTargetState)
            this.target.removeEventListener('mouseout', this.toggleTargetState)

            if (this.isAboveGun) {
                // NOTE : Should be there that we make possible to open the PlanetModal displaying course once animation is over
                this.tool.visible = false
                this.launchAnimation()
            }
        },
    }
}
</script>

<style>
</style>