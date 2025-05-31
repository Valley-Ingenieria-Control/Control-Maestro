const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "virtualvalley-backend-fsenhqcylxhbdpha.chilecentral-01.azurewebsites.net",
        pathname: "/images/**"
      }
    ]
  }
};

export default nextConfig;
