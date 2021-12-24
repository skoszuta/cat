import './styles.scss'
import '@tensorflow/tfjs-backend-webgl'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Scene from './components/scene/scene'
import loadImageAsync from './services/loadImageAsync'

const CAMERA_CONFIG = {
  audio: false,
  video: true
}

const state = {
  detector: null,
  stream: null,
  imageCapture: null,
  poses: null,
  images: {
    head: null,
    pupil: null,
  },
}

async function run() {
  requestAnimationFrame(run)

  const imageBitmap = await state.imageCapture.grabFrame()
  const poses = await state.detector.estimatePoses(imageBitmap)
  state.poses = poses

  Scene.draw(state)
}

async function main() {
  const model = poseDetection.SupportedModels.MoveNet
  const detector = await poseDetection.createDetector(model)
  const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONFIG)
  const imageCapture = new ImageCapture(stream.getVideoTracks()[0])

  state.detector = detector
  state.stream = stream
  state.imageCapture = imageCapture
  state.images.head = await loadImageAsync('head.svg')
  state.images.pupil = await loadImageAsync('pupil.svg')

  Scene.init(state)

  requestAnimationFrame(run)
}

main()
