const DEFAULT_JSON = {
  "name": "root",
  "type": "folder",
  "children": [
    {
      "name": "src",
      "type": "folder",
      "children": [
        { "name": "index.ts", "type": "file", "size": 1024 },
        { "name": "App.tsx", "type": "file", "size": 4096 },
        {
          "name": "components",
          "type": "folder",
          "children": [
            { "name": "Button.tsx", "type": "file", "size": 512 },
            { "name": "Modal.tsx", "type": "file", "size": 1536 }
          ]
        },
        {
          "name": "utils",
          "type": "folder",
          "children": [
            { "name": "formatters.ts", "type": "file", "size": 340 }
          ]
        }
      ]
    },
    {
      "name": "public",
      "type": "folder",
      "children": [
        { "name": "favicon.ico", "type": "file", "size": 2048 },
        { "name": "index.html", "type": "file", "size": 850 }
      ]
    },
    { "name": "package.json", "type": "file", "size": 420 },
    { "name": "tsconfig.json", "type": "file", "size": 280 },
    { "name": "README.md", "type": "file", "size": 1200 }
  ]
};
export { DEFAULT_JSON };