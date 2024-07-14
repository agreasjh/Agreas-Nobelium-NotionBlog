const BLOG = {
  title: '题序等君归 | 玻璃晴朗 橘子辉煌',
  author: '晴空Agreas',
  email: '577844432@qq.com',
  link: 'https://link3.cc/agreas', //https://nobelium.vercel.app
  description: "Agreas'Blog",
  lang: 'zh-CN', // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES']
  timezone: 'Asia/Shanghai', // 您的notion帖子的日期将被解释为这个时区。参见https://en.Wikipedia.org/wiki/List_of_tz_database_time_zones所有选项。
  appearance: 'auto', // ['light', 'dark', 'auto'],
  font: 'sans-serif', // ['sans-serif', 'serif']
  lightBackground: '#ffffff', // 使用十六进制值，不要忘记'#'
  darkBackground: '#18181B', // 使用十六进制值，不要忘记'#'
  path: '', // 将此字段留空，除非您想在文件夹中部署Nobody
  since: 2024, // 如果留空，将使用当前年份。
  postsPerPage: 7,
  sortByDate: true,
  showAbout: true,
  showArchive: true,
  autoCollapsedNavBar: false, // 自动折叠的导航栏
  ogImageGenerateURL: 'https://og-image-craigary.vercel.app', // 生成 OG 图像的链接，不要以斜线结尾
  socialLink: 'https://space.bilibili.com/192437494',
  seo: {
    keywords: ['Blog', 'Website', 'Notion'],
    googleSiteVerification: '' // 删除该值或替换为您自己的谷歌网站验证码
  },
  notionPageId: process.env.NOTION_PAGE_ID, // 不要动这个！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN, // 如果您不想公开您的数据库，该功能很有用
  analytics: {
    provider: '', //目前我们支持Google Analytics和Ackee，请填写“ga”或“ackee”，留空以禁用它。
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.craigary.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.craigary.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    },
    gaConfig: {
      measurementId: '' // e.g: G-XXXXXXXXXX
    }
  },
  comment: {
    // 赞助商：gitalk，utterances，cusdis
    provider: '', // 如果您不需要任何评论插件，请将其留空
    gitalkConfig: {
      repo: '', // 商店评论的存储库
      owner: '',
      admin: [],
      clientID: '',
      clientSecret: '',
      distractionFreeMode: false
    },
    utterancesConfig: {
      repo: ''
    },
    cusdisConfig: {
      appId: '', // data-app-id
      host: 'https://cusdis.com', // data-host，如果您使用的是自托管版本，请更改此选项
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js' // 如果您使用的是自托管版本，请更改此设置
    }
  },
  isProd: process.env.VERCEL_ENV === 'production' // 区分开发环境和生产环境 (参考: https://vercel.com/docs/environment-variables#system-environment-variables)
}
// export default BLOG
module.exports = BLOG
