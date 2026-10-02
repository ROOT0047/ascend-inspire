import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/aroha")({
  beforeLoad: () => {
    throw redirect({ to: "/ascend", statusCode: 301 });
  },
});
