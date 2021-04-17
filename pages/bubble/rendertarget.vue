<template>
    <WebGL />
</template>

<script>

import {
    CanvasTexture,
    MeshBasicMaterial,
    BackSide,
    Mesh,
    WebGLCubeRenderTarget,
    RGBFormat,
    LinearMipmapLinearFilter,
    CubeCamera,
    BoxBufferGeometry,
    MeshPhysicalMaterial,
    PMREMGenerator,
    SphereGeometry
} from 'three'

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import { themes } from '../../assets/js/datas/themes.js'
import Sky from '../../assets/js/webgl/custom/Sky'
import SkyTexture from '~/assets/js/webgl/textures/SkyTexture'

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
        this.gl.scene.background = new SkyTexture( this.gl.canvas.width, this.gl.canvas.height )

        const sky = new Sky( this.gl.canvas.width, this.gl.canvas.height )
        this.gl.scene.add( sky.mesh )

        const sphereGeometry = new SphereGeometry(1, 32)
        const sphereMaterial = new MeshBasicMaterial( { envMap: this.gl.cubeRenderTarget.renderTarget } )
        const sphere = new Mesh( sphereGeometry, sphereMaterial )
        this.gl.scene.add( sphere )
    },

    methods: {

    }
}
</script>

<style>
</style>