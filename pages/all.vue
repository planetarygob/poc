<template>
    <div class="relative">
        <div class="container justify-center text-center p-4 min-w-full absolute text-white bg-black-500 mx-auto">
            <h1 class="font-extrabold text-md">PRESS ESCAPE TO RETURN</h1>
        </div>
        <WebGL />
    </div>
</template>

<script>

import WebGL from '../components/WebGL.vue'
import GL from '../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { themes } from '../assets/js/datas/themes.js'
import { gsap } from 'gsap'
import Proton from 'three.proton.js';
import dot from "../static/images/dot";

export default {
    components: {
        WebGL
    },
    data: () => ({
        gl: GL,
        selectedObjects: [],
        emitter: null,
        bubbleModel: null,
        themeSelected: null,
        bubbleSelected: null,
        themeLight: null,
        themes: themes,
        canClick: true,
        canMouseOver: true
    }),

    mounted() {
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        this.themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(this.themeLight)

        this.emitter = new Proton.Emitter();

        this.gl.camera.position.set(0, 15, -35)

        this.gl.proton = new Proton()

        this.initProton()

        let self = this

        gltfLoader.load('/models/bubble_skirt_v1.gltf', (gltf) => {
            this.bubbleModel = gltf.scene.children[0]
        })

        gltfLoader.load('/models/sun_mode_v2.gltf', (gltf) => {
           for (let theme of this.themes) {
                theme.model = gltf.scene.children[0].clone()
                theme.model.position.set(0, 0, 0)
                theme.model.scale.set(0.04, 0.04, 0.04)
                theme.light = this.themeLight
                theme.model.visible = false

                this.launchBigBangAnimation(theme)

                theme.model.addEventListener('click', this.themeClicked.bind(event, theme))
                theme.model.addEventListener('mouseover', this.themeHovered.bind(event, theme));
                theme.model.addEventListener('mouseout', this.themeMouseOut.bind(event, theme));

                this.gl.scene.add(theme.model)
                this.gl.interactionManager.add(theme.model);
            }
        })

        this.listenBackEvents()
    },

    methods: {
        initProton () {
            this.createEmitter()
            this.gl.proton.addEmitter(this.emitter);
            this.gl.proton.addRender(new Proton.SpriteRender(this.gl.scene));
        },

        createEmitter () {
            this.emitter.rate = new Proton.Rate(new Proton.Span(10, 15), 0.1);

            this.emitter.addInitialize(new Proton.Mass(1));
            this.emitter.addInitialize(new Proton.Body(this.createSprite()));
            this.emitter.addInitialize(new Proton.Radius(0.4));
            this.emitter.addInitialize(new Proton.Life(1, 1.5));
            this.emitter.addInitialize(new Proton.Position(new Proton.BoxZone(5)));

            this.emitter.addBehaviour(new Proton.Scale(0, new Proton.Span(5, 10)));
            this.emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));
            this.emitter.addBehaviour(new Proton.Color("#C97024", "#290000"));

            this.emitter.p.x = 0;
            this.emitter.p.y = 1;
            this.emitter.p.z = 0;
            this.emitter.emit();
        },

        createSprite() {
            let map = new THREE.TextureLoader().load(dot);
            let material = new THREE.SpriteMaterial({
                map: map,
                color: 0xff0000,
                blending: THREE.AdditiveBlending,
                fog: true
            });

            return new THREE.Sprite(material);
        },

        launchBigBangAnimation (theme) {
            let self = this
            let bingBangTimeline = gsap.timeline()
            bingBangTimeline.set(theme.model, {
                visible: true,
                delay: 0.5
            }).to(theme.model.position, {
                delay: 1,
                duration: 2,
                x: theme.position.x,
                y: theme.position.y,
                z: theme.position.z,
                onUpdate: function () {
                    self.gl.camera.updateProjectionMatrix();
                }
            }).call(this.hideSun, null, "+1")
        },

        hideSun () {
            if (this.emitter) {
                this.emitter.destroy()
                this.emitter = null
            }
        },

        themeClicked (theme, event) {
            if (this.canClick) {
                this.themeSelected = theme

                this.triggerThemes(false, true)
                this.zoomCameraOnTheme(theme)
                this.canMouseOver = false

                this.gl.controls.target.set(theme.position.x, theme.position.y, theme.position.z)
                this.canClick = false
            }
        },

        zoomCameraOnTheme (theme) {
            let self = this

            gsap.to(this.gl.camera.position, {
                duration: 2,
                x: theme.position.x,
                y: theme.position.y + 3,
                z: theme.position.z - 10,
                onUpdate: function () {
                    self.gl.camera.updateProjectionMatrix();
                }
            })
            
            var timeline = gsap.timeline();

            timeline.to(this.gl.controls.target, {
                duration: 2,
                x: theme.position.x,
                y: theme.position.y,
                z: theme.position.z,
                onUpdate: function () {
                    self.gl.controls.update()
                }
            }).call(this.addThemeBubblesOnScene)
        },

        themeHovered (theme, event) {
            if (this.canMouseOver) {
                document.body.style.cursor = 'pointer';

                gsap.to(theme.model.scale, {
                    duration: 1,
                    x: 0.06,
                    y: 0.06,
                    z: 0.06
                })
                theme.light.position.set(theme.model.position.x, theme.model.position.y + 4, theme.model.position.z)
                this.gl.scene.add(theme.light)
            }
        },

        themeMouseOut (theme, event) {
            document.body.style.cursor = 'default';

            gsap.to(theme.model.scale, {
                duration: 1,
                x: 0.04,
                y: 0.04,
                z: 0.04
            })
            this.gl.scene.remove(theme.light)
        },

        bubbleHovered (bubble, event) {
            document.body.style.cursor = 'pointer';

            gsap.to(bubble.model.scale, {
                duration: 1,
                x: 0.015,
                y: 0.015,
                z: 0.015
            })
            bubble.light.position.set(bubble.model.position.x, bubble.model.position.y + 4, bubble.model.position.z)
            this.gl.scene.add(bubble.light)
        },

        bubbleMouseOut (bubble, event) {
            document.body.style.cursor = 'default';

            gsap.to(bubble.model.scale, {
                duration: 1,
                x: 0.01,
                y: 0.01,
                z: 0.01
            })
            this.gl.scene.remove(bubble.light)
        },

        addThemeBubblesOnScene (theme) {
            for (let bubble of this.themeSelected.bubbles) {
                bubble.model = this.bubbleModel.clone()
                bubble.model.scale.set(0.01, 0.01, 0.01)
                bubble.light = this.themeLight
                bubble.model.position.set(bubble.position.x, bubble.position.y, bubble.position.z)

                bubble.model.addEventListener('click', this.bubbleClicked.bind(event, bubble))
                bubble.model.addEventListener('mouseover', this.bubbleHovered.bind(event, bubble));
                bubble.model.addEventListener('mouseout', this.bubbleMouseOut.bind(event, bubble));

                this.gl.scene.add(bubble.model)
                this.gl.interactionManager.add(bubble.model);
            }
        },

        bubbleClicked (bubble, event) {
            this.bubbleSelected = bubble

            this.themeSelected.model.visible = false

            let self = this

            gsap.to(this.gl.camera.position, {
                duration: 2,
                x: bubble.position.x,
                y: bubble.position.y + 1,
                z: bubble.position.z - 2,
                onUpdate: function () {
                    self.gl.camera.updateProjectionMatrix();
                }
            })

            var timeline = gsap.timeline();
            timeline.to(this.gl.controls.target, {
                duration: 2,
                x: bubble.position.x,
                y: bubble.position.y,
                z: bubble.position.z,
                onUpdate: function () {
                    self.gl.controls.update()
                }
            }).call(this.triggerBubbles, [false, true], "+1.5")

            this.gl.controls.target.set(bubble.position.x, bubble.position.y, bubble.position.z)
        },

        triggerBubbles (visible, others = false) {
            for (let bubble of this.themeSelected.bubbles) {
                if (others) {
                     if (this.bubbleSelected.name !== bubble.name) {
                        bubble.model.visible = visible
                    }
                } else {
                    bubble.model.visible = visible
                }
            }
        },

        triggerThemes (visible, others = false) {
            for (let theme of this.themes) {
                if (others) {
                    if (this.themeSelected.name !== theme.name) {
                        theme.model.visible = visible
                    }
                } else {
                    theme.model.visible = visible
                }
            }
        },

        backOnSelectedTheme () {
            this.gl.controls.enableZoom = false
            this.triggerBubbles(true, true)
            this.themeSelected.model.visible = true
            this.bubbleSelected = null

            let self = this

            gsap.to(this.gl.camera.position, {
                duration: 2,
                x: this.themeSelected.position.x,
                y: this.themeSelected.position.y + 3,
                z: this.themeSelected.position.z - 10,
                onUpdate: function () {
                    self.gl.camera.updateProjectionMatrix();
                }
            })
            gsap.to(this.gl.controls.target, {
                duration: 2,
                x: this.themeSelected.position.x,
                y: this.themeSelected.position.y,
                z: this.themeSelected.position.z,
                onUpdate: function () {
                    self.gl.controls.update()
                }
            })
        },

        backOnThemesChoice () {
            this.canClick = true
            this.triggerThemes(true, true)
            this.triggerBubbles(false)
            this.themeSelected = null

            let self = this

            gsap.to(this.gl.camera.position, {
                duration: 2,
                x: 0,
                y: 15,
                z: -35,
                onUpdate: function () {
                    self.gl.camera.updateProjectionMatrix();
                }
            })
            gsap.to(this.gl.controls.target, {
                duration: 2,
                x: 0,
                y: 0.075,
                z: 0,
                onUpdate: function () {
                    self.gl.controls.update()
                }
            })
            this.canMouseOver = true
        },

        listenBackEvents () {
            document.addEventListener('keyup', (event) => {
                var key = event.keyCode || event.charCode;
                // press back
                if (key == 8) {
                    this.gl.controls.target.set(0, 0.75, 0)
                    this.canClick = true

                    if (this.bubbleSelected) {
                        this.backOnSelectedTheme()
                    } else {
                        this.backOnThemesChoice()
                    }
                }
            })
        }
    }
}
</script>

<style>
</style>