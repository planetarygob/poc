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
    SphereBufferGeometry
} from 'three'

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import { themes } from '../../assets/js/datas/themes.js'
import Sky from '../../assets/js/webgl/custom/Sky'

export default {
    components: {
        WebGL
    },
    data: () => ({
        gl: GL
    }),

    mounted() {
        this.gl = GL.getInstance()

        const sky = new Sky( this.gl.canvas.width, this.gl.canvas.height )
        this.gl.scene.add( sky.mesh )

        const cubeRenderTarget = new WebGLCubeRenderTarget( 5, { format: RGBFormat, generateMipmaps: true, minFilter: LinearMipmapLinearFilter } )

        // TODO : 30 is worldSize
        this.gl.sphereCamera = new CubeCamera( 1, 30, cubeRenderTarget )
        this.gl.scene.add( this.gl.sphereCamera )

        const boxGeometry = new BoxBufferGeometry(1, 1, 1)
        const boxMaterial = new MeshBasicMaterial( { color: 0xff0000 } )
        const box = new Mesh( boxGeometry, boxMaterial )
        this.gl.scene.add( box )

        const pmremGenerator = new PMREMGenerator( this.gl.renderer )
        // this.hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(this.hdrEquirect)
        this.gl.hdrCubeRenderTarget = pmremGenerator.fromScene(this.gl.scene)

        // Raw texture of scene used as gradient
        // const sphereMaterial = new MeshBasicMaterial( { envMap: cubeRenderTarget.texture } )

        const bubbleTexture = new CanvasTexture(this.gl.generateTexture());
        bubbleTexture.repeat.set(1, 0);
        
        const bubbleMaterial = new MeshPhysicalMaterial ({
            color: 0xffffff,
            metalness: 0,
            roughness: 0,
            alphaMap: bubbleTexture,
            alphaTest: 0.5,
            envMap: this.gl.hdrCubeRenderTarget.texture,
            envMapIntensity: 8,
            depthWrite: false,
            transmission: 0.9,
            opacity: 1,
            transparent: true
        })

        const bubbleMaterial1b = bubbleMaterial.clone()
        bubbleMaterial1b.side = BackSide

        const bubbleGeometry1 = new SphereBufferGeometry(3, 64, 32);

        const sphere = new Mesh( bubbleGeometry1, bubbleMaterial1b )
        this.gl.scene.add( sphere )

        this.gl.createLights()
    },

    methods: {

    }
}
</script>

<style>
</style>