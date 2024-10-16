/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["example.com"], // Domínios permitidos para otimização de imagens
  },
  i18n: {
    locales: ["en", "pt-BR"],
    defaultLocale: "pt-BR",
  },
};

export default nextConfig;
