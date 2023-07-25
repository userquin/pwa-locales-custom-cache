const locales = import.meta.glob('./locales/*.json', { eager: false })
Object.values(locales).forEach((locale) => locale().then((locale: any) => {
    console.log(locale.default)
}))

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Excalidraw PWA Test</h1>
  </div>
`
