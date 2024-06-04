// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
        }
      ]
    },
  },
  site: {
    url: 'https://audiobooktrove.com',
    name: 'Audiobooktrove',
    title: 'Join Audiobooktrove: Enjoy a 5% Discount on Thousands of Audiobooks',
    description: 'Register as a member at Audiobooktrove and get a 5% discount on your audiobook purchases. Discover and enjoy thousands of high-quality audiobooks, including novels, self-help guides, and educational materials. Listen to your favorite audiobooks anytime, anywhere. Sign up today and start saving!',
    defaultLocale: 'en',
    trailingSlash: true,
  },
  css: [
    './assets/scss/main.scss',
    'primevue/resources/themes/aura-light-amber/theme.css',
    'primeicons/primeicons.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
    { src: '~/plugins/slug' },
  ],
  modules: [
    'nuxt-primevue',
    '@unlok-co/nuxt-stripe',
    '@ant-design-vue/nuxt',
    'nuxt-swiper',
    '@nuxtjs/supabase',
    '@nuxtjs/turnstile',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    'nuxt-time',
    "@nuxtjs/seo",
  ],
  security: {
    csrf: false,
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: true,
      driver: {
        name: 'lruCache'
      },
      throwError: true
    },
    headers: {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    },
  },
  supabase: {
    redirect: false
  },
  runtimeConfig: {
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
    addValidateEndpoint: true,
  },
  primevue: {
    options: {
      ripple: true,
    },
    components: {
      include: [
        'Button',
        'InputGroup',
        'InputText',
        'Avatar',
        'TabMenu',
        'Accordion',
        'AccordionTab',
        'Dialog',
        'Breadcrumb',
        'FloatLabel',
        'TreeSelect',
        'Listbox',
        'MegaMenu',
        'Sidebar',
        'Tooltip',
        'Paginator',
        'PanelMenu',
        'TieredMenu',
        'ProgressSpinner',
        'Steps',
        'Stepper',
        'StepperPanel',
        'Fieldset',
        'Skeleton',
        'Rating',
        'IconField',
        'InputIcon',
        'Textarea'
      ]
    }
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY_SK,
      options: {
      },
    },
    client: {
      key: process.env.STRIPE_SECRET_KEY_PK,
      options: {},
    },
  },
})