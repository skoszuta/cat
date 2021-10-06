export default async function loadImageAsync(url) {
  return new Promise((resolve) => {
    const image = new Image()

    image.addEventListener('load', () => {
      resolve(image)
    })

    image.src = url
  })
}
