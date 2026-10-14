import type { NodeType } from "./types";

// Helper: Format bytes to B / KB / MB
export const formatBytes = (bytes: number | undefined | null) => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '0 B';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper: Recursively calculate total folder size and attach full paths & parent references
export const enrichTree = (node : NodeType, parentPath = '') => {
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  node.path = currentPath;

  if (node.type === 'file') {
    node.totalSize = node.size || 0;
    node.childrenCount = 0;
  } else if (node.type === 'folder') {
    let totalSize = 0;
    const children = node.children || [];
    children.forEach((child : NodeType) => {
      enrichTree(child, currentPath);
      totalSize += child?.totalSize ?? 0;
    });
    node.totalSize = totalSize;
    node.childrenCount = children.length;
  }
  return node;
}

// Helper: Find node by path
export const findNodeByPath = (root, targetPath) => {
  if (!root) return null;
  // Normalize paths for matching (remove leading/trailing slashes if any)
  const cleanTarget = targetPath.replace(/^\/+|\/+$/g, '');
  const cleanRoot = root.name;

  if (cleanTarget === cleanRoot || cleanTarget === '') {
    return root;
  }

  // Target path usually starts with root name or is relative to root children
  // e.g., root is "root", targetPath could be "root/src/index.ts" or "src/index.ts"
  let searchPath = cleanTarget;
  if (!searchPath.startsWith(root.name + '/')) {
    searchPath = `${root.name}/${searchPath}`;
  }

  const search = (node: NodeType) : NodeType | null => {
    if (node.path === searchPath) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = search(child);
        if (found) return found;
      }
    }
    return null;
  }

  return search(root);
}

// Helper: Collect all matching search results
export const searchTree = (node: NodeType | null, query: string, results: NodeType[] = []) => {
  if (!node) return results;
  if (node.name.toLowerCase().includes(query.toLowerCase())) {
    results.push(node);
  }
  if (node.children) {
    node.children.forEach((child: NodeType) => searchTree(child, query, results));
  }
  return results;
}