import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightOpenAPI, { openAPISidebarGroups } from "starlight-openapi";

export default defineConfig({
  site: "https://docs.air-iq.net",
  integrations: [
    starlight({
      title: "Open AIQ",
      description:
        "Build, provision, and operate an open air-quality monitoring system.",
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
      editLink: { baseUrl: "https://github.com/open-aiq/docs/edit/main/" },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/open-aiq",
        },
      ],
      plugins: [
        starlightOpenAPI([
          {
            base: "api",
            schema: "./src/assets/openapi/swagger.yaml",
            sidebar: { label: "API reference", collapsed: true },
          },
        ]),
      ],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Overview", link: "/overview/" },
            { label: "Quick start", link: "/quick-start/" },
            { label: "Architecture", link: "/architecture/" },
            { label: "Project status", link: "/project-status/" },
          ],
        },
        {
          label: "Use the dashboard",
          items: [
            { label: "Dashboard guide", link: "/dashboard/" },
            { label: "Register a device", link: "/dashboard/register-device/" },
            { label: "Privacy and public map", link: "/dashboard/privacy/" },
            { label: "Troubleshooting", link: "/dashboard/troubleshooting/" },
          ],
        },
        {
          label: "Build a device",
          items: [
            { label: "Hardware and pin map", link: "/device/hardware/" },
            { label: "Firmware setup", link: "/device/firmware/" },
            { label: "BLE provisioning", link: "/device/ble/" },
            { label: "Telemetry and display", link: "/device/telemetry/" },
          ],
        },
        {
          label: "Core concepts",
          items: [
            { label: "AQI and measurements", link: "/concepts/aqi/" },
            { label: "Data and security", link: "/concepts/data-security/" },
          ],
        },
        {
          label: "Contribute",
          items: [
            { label: "Contributor setup", link: "/contributing/" },
            { label: "API conventions", link: "/reference/api/" },
            { label: "API errors", link: "/reference/errors/" },
          ],
        },
        ...openAPISidebarGroups,
      ],
    }),
  ],
});
