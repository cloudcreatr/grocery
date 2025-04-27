import type { AppRouter } from "@repo/bg"
import { createTRPCContext } from "@trpc/tanstack-react-query";


export const { TRPCProvider, useTRPC, useTRPCClient  } = createTRPCContext<AppRouter>();