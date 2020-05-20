module.exports = {
  base: '/unifire/',
  themeConfig: {
    logo: '/unifire-logo.png',
    plugins: [ 'vuepress-plugin-smooth-scroll' ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Github', link: 'https://github.com/jpodwys/unifire' }
    ],
    sidebar: [
      {
        title: 'Intro',
        collapsable: false,
        children: [
          [ '/', 'What\'s Unifire?' ],
          '/intro/installation/'
        ]
      },
      {
        title: 'Core Concepts',
        collapsable: false,
        children: [
          '/core/state/',
          '/core/derived/',
          '/core/actions/',
          '/core/subscribers/',
          '/core/lazy/',
          '/core/composition/'
        ]
      },
      {
        title: 'Demos',
        collapsable: false,
        children: [
          '/demos/counter/',
          '/demos/todos/'
        ]
      },
      {
        title: 'Integrations',
        collapsable: false,
        children: [
          [ '/integrations/preact/', 'Preact' ],
          [ '/integrations/react/', 'React' ]
        ]
      },
      '/api/'
    ]
  }
}
