// Bundlers replace `process.env.NODE_ENV` at build time. Declared here so the
// library does not need a dependency on @types/node.
declare const process: { env: { NODE_ENV?: string } };
