import './styles.scss'
import 'image-capture'
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm'
import * as blazeface from '@tensorflow-models/blazeface'
import Scene from './components/scene/scene'
import loadImageAsync from './services/loadImageAsync'

const CAMERA_CONFIG = {
  audio: false,
  video: { width: 320, height: 240 }
}

const state = {
  detector: null,
  stream: null,
  imageCapture: null,
  predictions: null,
  images: {
    head: null,
    pupil: null,
  },
}

async function run() {
  requestAnimationFrame(run)

  const imageBitmap = await state.imageCapture.grabFrame()
  const predictions = await state.detector.estimateFaces(imageBitmap)
  state.predictions = predictions

  Scene.draw(state)
}

async function main() {
  state.images.head = await loadImageAsync('head.svg')
  state.images.pupil = await loadImageAsync('pupil.svg')

  Scene.init(state)

  const detector = await blazeface.load()
  const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG)
  const imageCapture = new ImageCapture(stream.getVideoTracks()[0])

  state.detector = detector
  state.stream = stream
  state.imageCapture = imageCapture

  requestAnimationFrame(run)
}

tf.setBackend('wasm').then(() => main());
