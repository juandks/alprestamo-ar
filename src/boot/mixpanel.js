import mixpanel from 'mixpanel-browser'
// "async" is optional
export default async ({ Vue }) => {
  mixpanel.init('2e59fbb62cef4196f9d694b2afea8f31')
  Vue.prototype.$mixpanel = mixpanel
}
