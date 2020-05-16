module.exports = {
  themeConfig: {
    plugins: [ 'vuepress-plugin-smooth-scroll' ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Preact', link: '/preact' },
      { text: 'Github', link: 'https://github.com/jpodwys/unifire' }
    ],
    sidebar: [
      {
        title: 'Intro',
        collapsable: false,
        children: [
          '/intro/quick-start/',
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
          '/core/subscribers/'
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
          [ '/integrations/preact/', 'Preact' ]
        ]
      },
      '/api/'
    ]
  }
}
