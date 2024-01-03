/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.discordapp.com", "i.imgur.com"],
  },
};

module.exports = {
  ...nextConfig,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};