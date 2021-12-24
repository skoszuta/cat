const LEFT_PUPIL_INITIAL_OFFSET_X_PERCENT = 0.315
const RIGHT_PUPIL_INITIAL_OFFSET_X_PERCENT = 0.665
const PUPIL_INITIAL_OFFSET_Y_PERCENT = 0.455
const PUPIL_TO_HEAD_WIDTH_RATIO = 0.05
const NOSE_POSE_CODE = 2
const LEFT_EAR_POSE_CODE = 5
const RIGHT_EAR_POSE_CODE = 4
const MAX_GAZE_OFFSET_X = 0.05
const MAX_GAZE_OFFSET_Y = 0.03

const Scene = {
  headContainer: document.createElement('div'),
  head: null,
  leftPupil: null,
  rightPupil: null,
  currentState: null,
  draw(state = Scene.currentState) {
    Scene.currentState = state

    if (!state.predictions || !state.predictions.length) {
      positionPupils()
      return
    }

    const nosePosition = state.predictions[0].landmarks[NOSE_POSE_CODE]

    console.log(nosePosition[0]);

    const noseXVsCenter = (nosePosition[0] - 160) / 320
    // const signumX = noseXVsCenter > 0 ? 1 : -1
    const gazeOffsetX =
      noseXVsCenter * MAX_GAZE_OFFSET_X

    const noseYVsCenter = (nosePosition[1] - 120) / 240
    // const signumY = noseYVsCenter > 0 ? 1 : -1
    const gazeOffsetY =
      noseYVsCenter * MAX_GAZE_OFFSET_Y

    positionPupils(-gazeOffsetX, gazeOffsetY)

    if (Math.abs(noseXVsCenter) <= 0.3) {
      const leftEarPosition = state.predictions[0].landmarks[LEFT_EAR_POSE_CODE]
      const rightEarPosition = state.predictions[0].landmarks[RIGHT_EAR_POSE_CODE]
      const headAngle =
        (Math.atan2(
          leftEarPosition[1] - rightEarPosition[1],
          leftEarPosition[0] - rightEarPosition[0]
        ) *
          180) /
        Math.PI * -1
      rotateHead(headAngle)
    } else {
      rotateHead()
    }
  },
  init(state) {
    Scene.currentState = state

    Scene.headContainer.classList.add('head-container')
    document.body.appendChild(Scene.headContainer)

    Object.assign(Scene, {
      head: state.images.head.cloneNode(true),
      leftPupil: state.images.pupil.cloneNode(true),
      rightPupil: state.images.pupil.cloneNode(true),
    })

    Scene.head.classList.add('svg-head')
    Scene.leftPupil.classList.add('svg-left-pupil')
    Scene.rightPupil.classList.add('svg-right-pupil')

    Scene.headContainer.appendChild(Scene.head)
    Scene.headContainer.appendChild(Scene.leftPupil)
    Scene.headContainer.appendChild(Scene.rightPupil)

    positionPupils()

    window.addEventListener('resize', () => requestAnimationFrame(Scene.draw))
  },
}

function positionPupils(offsetX = 0, offsetY = 0) {
  Scene.leftPupil.style.left = `${
    Scene.head.offsetLeft +
    Scene.head.width * (LEFT_PUPIL_INITIAL_OFFSET_X_PERCENT + offsetX)
  }px`
  Scene.leftPupil.style.top = `${
    Scene.head.offsetTop +
    Scene.head.height * (PUPIL_INITIAL_OFFSET_Y_PERCENT + offsetY)
  }px`
  Scene.leftPupil.style.width = `${
    Scene.head.width * PUPIL_TO_HEAD_WIDTH_RATIO
  }px`

  Scene.rightPupil.style.left = `${
    Scene.head.offsetLeft +
    Scene.head.width * (RIGHT_PUPIL_INITIAL_OFFSET_X_PERCENT + offsetX)
  }px`
  Scene.rightPupil.style.top = `${
    Scene.head.offsetTop +
    Scene.head.height * (PUPIL_INITIAL_OFFSET_Y_PERCENT + offsetY)
  }px`
  Scene.rightPupil.style.width = `${
    Scene.head.width * PUPIL_TO_HEAD_WIDTH_RATIO
  }px`
}

function rotateHead(angle = 0) {
  if (angle > 20 || angle < -20) {
    Scene.headContainer.style.transform = `rotate(${angle}deg)`
  } else {
    Scene.headContainer.style.transform = `rotate(0deg)`
  }
}

export default Scene
