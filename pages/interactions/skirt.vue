<template>
    <WebGL />
</template>

<script lang="ts">

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventBusManager from '../../assets/js/managers/EventBusManager'
import CustomInteractionManager from '../../assets/js/managers/CustomInteractionManager'
import { Vector3 } from 'three'

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
        selectedObjects: [] as any,
        initialPosition: new Vector3(0, 0, 0) as Vector3
    }),

    mounted () {
        this.gl = GL.getInstance()
        
        const axesHelper = new THREE.AxesHelper( 5 );
        this.gl.scene.add( axesHelper );

        const gltfLoader = new GLTFLoader()
        gltfLoader.load('/models/planet_skirt_v2--animation--chara.glb', (gltf) => {
            this.scenery = gltf.scene
            this.scenery.position.set(0, 0, 0)
            this.scenery.scale.set(0.02, 0.02, 0.02)
            this.gl.scene.add(this.scenery)

            this.customInteractionManager = CustomInteractionManager.getInstance(this.gl.renderer, this.gl.camera)
            this.customInteractionManager.add(this.scenery)

            this.gl.mixer = new THREE.AnimationMixer(this.scenery)
            this.animation = this.gl.mixer.clipAction(gltf.animations[0])
            this.animation.setLoop(THREE.LoopOnce, 2)

            this.createLight()

            this.scenery.traverse((child: any) => {
                if (child.name === 'scissors') {
                    this.scissors = child
                }
            })

            if (this.scissors) {
                // NOTE : We indicate that scissors are an interactive object
                this.addSelectedObject(this.scissors)
                this.gl.highlightManager.outlinePass.selectedObjects = this.selectedObjects
                this.initialPosition = this.scissors.position

                this.scissors.addEventListener('mouseover', () => {
                    document.body.style.cursor = 'pointer';
                })
                this.scissors.addEventListener('mouseout', () => {
                    document.body.style.cursor = 'default';
                })

                // NOTE : We take the scissors
                this.scissors.addEventListener('click', (e: any) => {
                    this.scissors.rotation.x = 45

                    // NOTE : Now scissors should follow the mouse
                    window.addEventListener('mousemove', (e: any) => {

                        e.preventDefault()

                        const mousex = (e.clientX / this.gl.canvas.width) * 2 - 1
                        const mousey = - (e.clientY / this.gl.canvas.height) * 2 + 1
                        
                        this.scissors.position.x -= mousex * 2 * 10
                        this.scissors.position.z += mousex * 10

                        // NOTE : Are we near the skirt ?
                        if ((this.scissors.position.x <= -18) && (this.scissors.position.x >= -28)) {
                            this.cutSkirtAnimation()

                            this.scissors.position.x = this.initialPosition.x
                            this.scissors.position.z = this.initialPosition.z
                        }
                    })
                })
                this.gl.interactionManager.add(this.scissors);
            }   
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
        cutSkirtAnimation() {
            this.animation.play()
            this.customInteractionManager.remove(this.scenery)
            this.scenery.removeEventListener('click', this.cutSkirtAnimation)
            this.animation.clampWhenFinished
            
            if (this.gl.mixer) {
                this.gl.mixer.addEventListener('finished', () => {
                // NOTE : cleanMethods on the doc doesnt work...
                    this.gl.mixer = null
                })
            }
        }
    }
}
</script>

<style>
</style>