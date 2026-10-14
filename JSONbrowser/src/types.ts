export type NodeType = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: NodeType[];
  childrenCount?: number;
  totalSize?: number;
}