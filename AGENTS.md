<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Component Modularity

Always design and create new custom UI components (such as buttons, toasts, cards, dialogs, etc.) as separate, reusable files inside the root-level `ui/` directory instead of writing them inline inside main page or layout files. Import them wherever they are needed to keep the codebase clean, modular, and easy to maintain.
