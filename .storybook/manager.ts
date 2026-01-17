import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'

const theme = create({
  base: 'light',
  brandTitle: 'Handy Uploader',
  brandUrl: 'https://github.com/alijahanpak/handy-uploader',
  brandTarget: '_blank'
})

addons.setConfig({
  theme
})
