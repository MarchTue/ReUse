
## Version 0.1

### 0.1.0

2025.06.21

Project Initialization

Set up project packages.


```bash
# Create Next.js project (using App Router)
npx create-next-app@latest reuse-app --typescript --tailwind --eslint --app --src-dir

cd reuse-app

# Install essential packages
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-textarea @radix-ui/react-toast

# Icons and Utilities
npm install lucide-react class-variance-authority clsx tailwind-merge

# State Management
npm install zustand

# PWA related
npm install next-pwa workbox-webpack-plugin

# Form Management
npm install react-hook-form @hookform/resolvers zod

# Date Handling
npm install date-fns

# Development Tools
npm install --save-dev @types/node eslint-config-prettier prettier

# Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input card badge avatar separator tabs switch checkbox radio-group select textarea label alert-dialog dropdown-menu accordion toast
```

### Tailwind Config

[tailwind Config](../tailwind.config.ts)

### util.ts

Add utility functions. 

- formatPrice
- formatDate

### prettier & eslint

add configs.


