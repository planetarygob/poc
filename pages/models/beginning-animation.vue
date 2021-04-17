<template>
    <WebGL />
</template>

<script>

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { themes } from '../../assets/js/datas/themes.js'
import { gsap } from 'gsap'
import Proton from 'three.proton.js';
import dot from "../../static/images/dot";

export default {
    components: {
        WebGL
    },
    data: () => ({
        gl: GL,
        selectedObjects: [],
        emitter: null
    }),

    mounted() {
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(themeLight)

        this.emitter = new Proton.Emitter();

        this.gl.camera.position.set(0, 15, -35)

        this.gl.proton = new Proton()

        this.initProton()

        let self = this

        gltfLoader.load('/models/sun_mode_v2.gltf', (gltf) => {
           for (let theme of themes) {
                theme.model = gltf.scene.children[0].clone()
                theme.model.position.set(0, 0, 0)
                theme.model.scale.set(0.04, 0.04, 0.04)
                theme.light = themeLight
                theme.model.visible = false

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

                var timeline = gsap.timeline();

                theme.model.addEventListener('mouseover', function onHover () {
                    document.body.style.cursor = 'pointer';
                });

                theme.model.addEventListener('mouseout', () => {
                    document.body.style.cursor = 'default';
                });

                this.gl.scene.add(theme.model)
                this.gl.interactionManager.add(theme.model);
            }
        })
    },

    methods: {
        hideSun () {
            if (this.emitter) {
                this.emitter.destroy()
                this.emitter = null
            }
        },

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
        }
    }
}
</script>

<style>
</style>