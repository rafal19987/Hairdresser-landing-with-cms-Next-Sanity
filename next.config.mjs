/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server for the Docker image
  output: "standalone",
  images: {
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
