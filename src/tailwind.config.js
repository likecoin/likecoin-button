/* eslint-disable prettier/prettier */

/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.

|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// const defaultConfig = require('tailwindcss/defaultConfig')()

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
*/

const colors = {
  'inherit-color': 'inherit',
  transparent: 'transparent',

  black: '#000000',
  'gray-31': '#313131',
  'gray-4a': '#4a4a4a',
  'gray-9b': '#9b9b9b',
  'gray-c': '#cccccc',
  'gray-d8': '#d8d8d8',
  'gray-e6': '#e6e6e6',
  'gray-f7': '#f7f7f7',
  white: '#ffffff',
  current: 'currentColor',

  danger: '#e35050',
  success: '#36de00',

  'like-green': '#28646e',
  'like-green-dark': '#235760',
  'like-green-darker': '#1e4a51',
  'like-brown': '#462814',
  'like-cyan-gray': '#a9c1c5',
  'like-cyan-pale': '#d7ecec',
  'like-cyan-light': '#aaf1e7',
  'like-cyan': '#50e3c2',
  'like-cyan-dark': '#22d6ad',
  'like-cyan-darker': '#1aa384',
  'like-cyan-translucent': 'rgba(80, 227, 194, 0.15)',
  'like-cyan-translucent-dark': 'rgba(26, 163, 132, 0.15)',

  'like-dark-green': '#245b64',
  'like-cyan-extralight': '#D7ECEC',
  'dark-gray': '#4A4A4A',
  'medium-gray': '#9B9B9B',
  'shade-gray': '#EBEBEB',
  'light-gray': '#F7F7F7',
  'airdrop-gold': '#D1AB79',
  'twitter-blue': '#4696F1',
};

module.exports = {
  mode: 'jit',
  theme: {
    colors,

    /*
    |-----------------------------------------------------------------------------
    | Screens                      https://tailwindcss.com/docs/responsive-design
    |-----------------------------------------------------------------------------
    |
    | Screens in Tailwind are translated to CSS media queries. They define the
    | responsive breakpoints for your project. By default Tailwind takes a
    | "mobile first" approach, where each screen size represents a minimum
    | viewport width. Feel free to have as few or as many screens as you
    | want, naming them in whatever way you'd prefer for your project.
    |
    | Tailwind also allows for more complex screen definitions, which can be
    | useful in certain situations. Be sure to see the full responsive
    | documentation for a complete list of options.
    |
    | Class name: .{screen}:{utility}
    |
    */

    screens: {
      phone: { max: '527px' },
      tablet: { min: '528px', max: '768px' },
      laptop: { min: '769px' },
      desktop: { min: '992px' },
    },

    /*
    |-----------------------------------------------------------------------------
    | Fonts                                    https://tailwindcss.com/docs/fonts
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your project's font stack, or font families.
    | Keep in mind that Tailwind doesn't actually load any fonts for you.
    | If you're using custom fonts you'll need to import them prior to
    | defining them here.
    |
    | By default we provide a native font stack that works remarkably well on
    | any device or OS you're using, since it just uses the default fonts
    | provided by the platform.
    |
    | Class name: .font-{name}
    | CSS property: font-family
    |
    */

    fontFamily: {
      proxima: ['proxima-nova', 'sans-serif'],
      sans: ['open-sans', 'sans-serif'],
      serif: ['serif'],
      mono: ['monospace'],
      emoji: ['emoji'],
    },

    /*
    |-----------------------------------------------------------------------------
    | Text sizes                         https://tailwindcss.com/docs/text-sizing
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your text sizes. Name these in whatever way
    | makes the most sense to you. We use size names by default, but
    | you're welcome to use a numeric scale or even something else
    | entirely.
    |
    | By default Tailwind uses the "rem" unit type for most measurements.
    | This allows you to set a root font size which all other sizes are
    | then based on. That said, you are free to use whatever units you
    | prefer, be it rems, ems, pixels or other.
    |
    | Class name: .text-{size}
    | CSS property: font-size
    |
    */

    fontSize: {
      10: '.625rem', // xxs
      12: '.75rem', // xs
      14: '.875rem', // sm
      16: '1rem', // base
      18: '1.125rem', // lg
      20: '1.25rem', // xl
      24: '1.5rem', // 2xl
      30: '1.875rem', // 3xl
      32: '2rem',
      36: '2.25rem', // 4xl
      40: '2.5rem',
      48: '3rem', // 5xl
      56: '3.5rem', // 6xl
    },

    /*
    |-----------------------------------------------------------------------------
    | Font weights                       https://tailwindcss.com/docs/font-weight
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your font weights. We've provided a list of
    | common font weight names with their respective numeric scale values
    | to get you started. It's unlikely that your project will require
    | all of these, so we recommend removing those you don't need.
    |
    | Class name: .font-{weight}
    | CSS property: font-weight
    |
    */

    fontWeight: {
      200: 200,
      400: 400,
      500: 500,
      600: 600,
    },

    /*
    |-----------------------------------------------------------------------------
    | Leading (line height)              https://tailwindcss.com/docs/line-height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your line height values, or as we call
    | them in Tailwind, leadings.
    |
    | Class name: .leading-{size}
    | CSS property: line-height
    |
    */

    lineHeight: {
      0: 0,
      1: 1,
      '1_25': 1.25,
      '1_5': 1.5,
      2: 2,
    },

    /*
    |-----------------------------------------------------------------------------
    | Tracking (letter spacing)       https://tailwindcss.com/docs/letter-spacing
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your letter spacing values, or as we call
    | them in Tailwind, tracking.
    |
    | Class name: .tracking-{size}
    | CSS property: letter-spacing
    |
    */

    tracking: {
      tight: '-0.05em',
      normal: '0',
      wide: '0.05em',
    },

    /*
    |-----------------------------------------------------------------------------
    | Text colors                         https://tailwindcss.com/docs/text-color
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your text colors. By default these use the
    | color palette we defined above, however you're welcome to set these
    | independently if that makes sense for your project.
    |
    | Class name: .text-{color}
    | CSS property: color
    |
    */

    textColors: {
      ...colors,
      current: 'currentColor',
    },

    /*
    |-----------------------------------------------------------------------------
    | Background sizes               https://tailwindcss.com/docs/background-size
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your background sizes. We provide some common
    | values that are useful in most projects, but feel free to add other sizes
    | that are specific to your project here as well.
    |
    | Class name: .bg-{size}
    | CSS property: background-size
    |
    */

    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    },

    /*
    |-----------------------------------------------------------------------------
    | Border widths                     https://tailwindcss.com/docs/border-width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your border widths. Take note that border
    | widths require a special "default" value set as well. This is the
    | width that will be used when you do not specify a border width.
    |
    | Class name: .border{-side?}{-width?}
    | CSS property: border-width
    |
    */

    borderWidths: {
      default: '1px',
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },

    /*
    |-----------------------------------------------------------------------------
    | Border colors                     https://tailwindcss.com/docs/border-color
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your border colors. By default these use the
    | color palette we defined above, however you're welcome to set these
    | independently if that makes sense for your project.
    |
    | Take note that border colors require a special "default" value set
    | as well. This is the color that will be used when you do not
    | specify a border color.
    |
    | Class name: .border-{color}
    | CSS property: border-color
    |
    */

    borderColors: {
      default: colors['gray-e6'],
      current: 'currentColor',
      ...colors,
    },

    /*
    |-----------------------------------------------------------------------------
    | Border radius                    https://tailwindcss.com/docs/border-radius
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your border radius values. If a `default` radius
    | is provided, it will be made available as the non-suffixed `.rounded`
    | utility.
    |
    | If your scale includes a `0` value to reset already rounded corners, it's
    | a good idea to put it first so other values are able to override it.
    |
    | Class name: .rounded{-side?}{-size?}
    | CSS property: border-radius
    |
    */

    borderRadius: {
      none: '0',
      2: '.125rem',
      4: '.25rem',
      default: '.5em',
      8: '.5rem',
      12: '.75rem',
      14: '.875rem',
      full: '9999px',
    },

    /*
    |-----------------------------------------------------------------------------
    | Width                                    https://tailwindcss.com/docs/width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your width utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default
    | we provide a sensible rem based numeric scale, a percentage
    | based fraction scale, plus some other common use-cases. You
    | can, of course, modify these values as needed.
    |
    |
    | It's also worth mentioning that Tailwind automatically escapes
    | invalid CSS class name characters, which allows you to have
    | awesome classes like .w-2/3.
    |
    | Class name: .w-{size}
    | CSS property: width
    |
    */

    width: {
      auto: 'auto',
      px: '1px',
      2: '0.125rem',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      14: '0.875rem',
      16: '1rem',
      20: '1.25rem',
      24: '1.5rem',
      28: '1.75rem',
      32: '2rem',
      36: '2.25rem',
      40: '2.5rem',
      48: '3rem',
      56: '3.5rem',
      64: '4rem',
      72: '4.5rem',
      80: '5rem',
      96: '6rem',
      '1/2': '50%',
      '1/3': '33.33333%',
      '2/3': '66.66667%',
      '1/4': '25%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.66667%',
      '5/6': '83.33333%',
      full: '100%',
      screen: '100vw',
    },

    /*
    |-----------------------------------------------------------------------------
    | Height                                  https://tailwindcss.com/docs/height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your height utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default
    | we provide a sensible rem based numeric scale plus some other
    | common use-cases. You can, of course, modify these values as
    | needed.
    |
    | Class name: .h-{size}
    | CSS property: height
    |
    */

    height: {
      auto: 'auto',
      px: '1px',
      2: '0.125rem',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      14: '0.875rem',
      16: '1rem',
      20: '1.25rem',
      24: '1.5rem',
      32: '2rem',
      36: '2.25rem',
      40: '2.5rem',
      48: '3rem',
      60: '3.75rem',
      64: '4rem',
      72: '4.5rem',
      80: '5rem',
      96: '6rem',
      full: '100%',
      screen: '100vh',
    },

    /*
    |-----------------------------------------------------------------------------
    | Minimum width                        https://tailwindcss.com/docs/min-width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your minimum width utility sizes. These can
    | be percentage based, pixels, rems, or any other units. We provide a
    | couple common use-cases by default. You can, of course, modify
    | these values as needed.
    |
    | Class name: .min-w-{size}
    | CSS property: min-width
    |
    */

    minWidth: {
      0: '0',
      full: '100%',
    },

    /*
    |-----------------------------------------------------------------------------
    | Minimum height                      https://tailwindcss.com/docs/min-height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your minimum height utility sizes. These can
    | be percentage based, pixels, rems, or any other units. We provide a
    | few common use-cases by default. You can, of course, modify these
    | values as needed.
    |
    | Class name: .min-h-{size}
    | CSS property: min-height
    |
    */

    minHeight: {
      0: '0',
      full: '100%',
      screen: '100vh',
    },

    /*
    |-----------------------------------------------------------------------------
    | Maximum width                        https://tailwindcss.com/docs/max-width
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your maximum width utility sizes. These can
    | be percentage based, pixels, rems, or any other units. By default
    | we provide a sensible rem based scale and a "full width" size,
    | which is basically a reset utility. You can, of course,
    | modify these values as needed.
    |
    | Class name: .max-w-{size}
    | CSS property: max-width
    |
    */

    maxWidth: {
      'phone-min': '320px',
      300: '300px',
      480: '480px',
      phone: '528px',
      desktop: '1024px',
      full: '100%',
    },

    /*
    |-----------------------------------------------------------------------------
    | Maximum height                      https://tailwindcss.com/docs/max-height
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your maximum height utility sizes. These can
    | be percentage based, pixels, rems, or any other units. We provide a
    | couple common use-cases by default. You can, of course, modify
    | these values as needed.
    |
    | Class name: .max-h-{size}
    | CSS property: max-height
    |
    */

    maxHeight: {
      full: '100%',
      screen: '100vh',
    },

    /*
    |-----------------------------------------------------------------------------
    | Padding                                https://tailwindcss.com/docs/padding
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your padding utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default we
    | provide a sensible rem based numeric scale plus a couple other
    | common use-cases like "1px". You can, of course, modify these
    | values as needed.
    |
    | Class name: .p{side?}-{size}
    | CSS property: padding
    |
    */

    padding: {
      px: '1px',
      0: '0',
      2: '0.125rem',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
      20: '1.25rem',
      24: '1.5rem',
      28: '1.75rem',
      32: '2rem',
      40: '2.5rem',
      48: '3rem',
      52: '3.25rem',
      64: '4rem',
      72: '4.5rem',
      80: '5rem',
      96: '6rem',
      128: '8rem',
    },

    /*
    |-----------------------------------------------------------------------------
    | Margin                                  https://tailwindcss.com/docs/margin
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your margin utility sizes. These can be
    | percentage based, pixels, rems, or any other units. By default we
    | provide a sensible rem based numeric scale plus a couple other
    | common use-cases like "1px". You can, of course, modify these
    | values as needed.
    |
    | Class name: .m{side?}-{size}
    | CSS property: margin
    |
    */

    margin: {
      auto: 'auto',
      px: '1px',
      0: '0',
      2: '0.125rem',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
      20: '1.25rem',
      24: '1.5rem',
      32: '2rem',
      40: '2.5rem',
      48: '3rem',
      52: '3.25rem',
      64: '4rem',
      72: '4.5rem',
      80: '5rem',
      96: '6rem',
      128: '8rem',
    },

    /*
    |-----------------------------------------------------------------------------
    | Negative margin                https://tailwindcss.com/docs/negative-margin
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your negative margin utility sizes. These can
    | be percentage based, pixels, rems, or any other units. By default we
    | provide matching values to the padding scale since these utilities
    | generally get used together. You can, of course, modify these
    | values as needed.
    |
    | Class name: .-m{side?}-{size}
    | CSS property: margin
    |
    */

    negativeMargin: {
      px: '1px',
      0: '0',
      2: '0.125rem',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
      20: '1.25rem',
      24: '1.5rem',
      32: '2rem',
      40: '2.5rem',
      48: '3rem',
      64: '4rem',
      80: '5rem',
      96: '6rem',
      128: '8rem',
    },

    /*
    |-----------------------------------------------------------------------------
    | Z-index                                https://tailwindcss.com/docs/z-index
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your z-index utility values. By default we
    | provide a sensible numeric scale. You can, of course, modify these
    | values as needed.
    |
    | Class name: .z-{index}
    | CSS property: z-index
    |
    */

    zIndex: {
      auto: 'auto',
      0: 0,
      1: 1,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
    },

    /*
    |-----------------------------------------------------------------------------
    | Opacity                                https://tailwindcss.com/docs/opacity
    |-----------------------------------------------------------------------------
    |
    | Here is where you define your opacity utility values. By default we
    | provide a sensible numeric scale. You can, of course, modify these
    | values as needed.
    |
    | Class name: .opacity-{name}
    | CSS property: opacity
    |
    */

    opacity: {
      0: '0',
      25: '.25',
      50: '.5',
      75: '.75',
      100: '1',
    },
  },

  /*
  |-----------------------------------------------------------------------------
  | Plugins                                https://tailwindcss.com/docs/plugins
  |-----------------------------------------------------------------------------
  |
  | Here is where you can register any plugins you'd like to use in your
  | project.
  |
  | Be sure to view the complete plugin documentation to learn more about how
  | the plugin system works.
  |
  */

  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.bg-like-gradient': {
          'background-image': 'linear-gradient(78deg, #d2f0f0, #f0e6b4)',
        },
        '.bg-error-gradient': {
          'background-image': 'linear-gradient(78deg, #f0d2d2, #f0e6b4)',
        },
      });
    },
  ],
};
