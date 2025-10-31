import { FileSystemNode, CommandOutput } from '../types';

export const createMockFileSystem = (): FileSystemNode => ({
  name: '/',
  type: 'directory',
  permissions: 'drwxr-xr-x',
  size: 4096,
  children: [
    {
      name: 'home',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      size: 4096,
      children: [
        {
          name: 'user',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          size: 4096,
          children: [
            {
              name: 'documents',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              size: 4096,
              children: [
                {
                  name: 'report.txt',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  size: 1024,
                  content: 'Annual Report 2024\nRevenue: $1,000,000\nExpenses: $750,000\nProfit: $250,000',
                },
                {
                  name: 'notes.txt',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  size: 512,
                  content: 'Meeting notes from Monday\nTODO: Review the proposal\nTODO: Send email to team',
                },
              ],
            },
            {
              name: 'scripts',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              size: 4096,
              children: [
                {
                  name: 'backup.sh',
                  type: 'file',
                  permissions: '-rwxr-xr-x',
                  size: 256,
                  content: '#!/bin/bash\necho "Starting backup..."\ntar -czf backup.tar.gz /home/user/documents',
                },
                {
                  name: 'deploy.sh',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  size: 512,
                  content: '#!/bin/bash\necho "Deploying application..."\nnpm run build\npm2 restart app',
                },
              ],
            },
            {
              name: 'logs',
              type: 'directory',
              permissions: 'drwxr-xr-x',
              size: 4096,
              children: [
                {
                  name: 'access.log',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  size: 2048,
                  content: '192.168.1.1 - - [01/Jan/2024:10:00:00] "GET /api/users HTTP/1.1" 200 1234\n192.168.1.2 - - [01/Jan/2024:10:01:00] "POST /api/login HTTP/1.1" 401 89\n192.168.1.1 - - [01/Jan/2024:10:02:00] "GET /api/data HTTP/1.1" 200 5678',
                },
                {
                  name: 'error.log',
                  type: 'file',
                  permissions: '-rw-r--r--',
                  size: 1024,
                  content: '[ERROR] 2024-01-01 10:05:00 - Database connection failed\n[WARN] 2024-01-01 10:06:00 - Slow query detected\n[ERROR] 2024-01-01 10:10:00 - Authentication timeout',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'var',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      size: 4096,
      children: [
        {
          name: 'www',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          size: 4096,
          children: [
            {
              name: 'index.html',
              type: 'file',
              permissions: '-rw-r--r--',
              size: 512,
              content: '<!DOCTYPE html>\n<html>\n<head><title>Welcome</title></head>\n<body><h1>Hello World</h1></body>\n</html>',
            },
          ],
        },
      ],
    },
  ],
});

export class BashSimulator {
  private fileSystem: FileSystemNode;
  private currentPath: string;

  constructor() {
    this.fileSystem = createMockFileSystem();
    this.currentPath = '/home/user';
  }

  private resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return path;
    }
    if (path === '~') {
      return '/home/user';
    }
    if (path.startsWith('~/')) {
      return '/home/user' + path.slice(1);
    }
    if (path === '..') {
      const parts = this.currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    return this.currentPath === '/' ? `/${path}` : `${this.currentPath}/${path}`;
  }

  private findNode(path: string): FileSystemNode | null {
    const resolvedPath = this.resolvePath(path);
    const parts = resolvedPath.split('/').filter(Boolean);

    let current = this.fileSystem;

    if (parts.length === 0) {
      return current;
    }

    for (const part of parts) {
      if (!current.children) {
        return null;
      }
      const next = current.children.find(child => child.name === part);
      if (!next) {
        return null;
      }
      current = next;
    }

    return current;
  }

  private formatLsOutput(node: FileSystemNode, showAll: boolean = false): string {
    if (!node.children) {
      return '';
    }

    const items = showAll
      ? [
          { name: '.', type: 'directory', permissions: node.permissions, size: node.size },
          { name: '..', type: 'directory', permissions: 'drwxr-xr-x', size: 4096 },
          ...node.children
        ]
      : node.children;

    return items
      .map(item => {
        const type = item.type === 'directory' ? 'd' : '-';
        const perms = item.permissions || '-rw-r--r--';
        return `${perms} 1 user user ${item.size.toString().padStart(6)} Jan 1 10:00 ${item.name}`;
      })
      .join('\n');
  }

  executeCommand(command: string): CommandOutput {
    const timestamp = new Date();
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    try {
      let output = '';

      switch (cmd) {
        case 'ls': {
          const hasL = args.includes('-l');
          const hasA = args.includes('-a') || args.includes('-la') || args.includes('-al');
          const path = args.find(arg => !arg.startsWith('-')) || this.currentPath;

          const node = this.findNode(path);
          if (!node) {
            output = `ls: cannot access '${path}': No such file or directory`;
            return { command, output, timestamp, success: false };
          }

          if (hasL) {
            output = this.formatLsOutput(node, hasA);
          } else {
            const children = node.children || [];
            output = children.map(c => c.name).join('  ');
          }
          break;
        }

        case 'pwd':
          output = this.currentPath;
          break;

        case 'cd': {
          const targetPath = args[0] || '/home/user';
          const node = this.findNode(targetPath);

          if (!node) {
            output = `cd: ${targetPath}: No such file or directory`;
            return { command, output, timestamp, success: false };
          }

          if (node.type !== 'directory') {
            output = `cd: ${targetPath}: Not a directory`;
            return { command, output, timestamp, success: false };
          }

          this.currentPath = this.resolvePath(targetPath);
          output = '';
          break;
        }

        case 'cat': {
          if (args.length === 0) {
            output = 'cat: missing file operand';
            return { command, output, timestamp, success: false };
          }

          const node = this.findNode(args[0]);
          if (!node) {
            output = `cat: ${args[0]}: No such file or directory`;
            return { command, output, timestamp, success: false };
          }

          if (node.type === 'directory') {
            output = `cat: ${args[0]}: Is a directory`;
            return { command, output, timestamp, success: false };
          }

          output = node.content || '';
          break;
        }

        case 'grep': {
          if (args.length < 2) {
            output = 'grep: missing pattern or file';
            return { command, output, timestamp, success: false };
          }

          const pattern = args[0];
          const filePath = args[1];
          const node = this.findNode(filePath);

          if (!node || !node.content) {
            output = `grep: ${filePath}: No such file or directory`;
            return { command, output, timestamp, success: false };
          }

          const regex = new RegExp(pattern, 'gi');
          const lines = node.content.split('\n');
          const matches = lines.filter(line => regex.test(line));
          output = matches.join('\n');
          break;
        }

        case 'chmod': {
          if (args.length < 2) {
            output = 'chmod: missing operand';
            return { command, output, timestamp, success: false };
          }

          const perms = args[0];
          const filePath = args[1];
          const node = this.findNode(filePath);

          if (!node) {
            output = `chmod: cannot access '${filePath}': No such file or directory`;
            return { command, output, timestamp, success: false };
          }

          output = `Changed permissions of '${filePath}' to ${perms}`;
          break;
        }

        case 'find': {
          const nameIndex = args.indexOf('-name');
          if (nameIndex !== -1 && args[nameIndex + 1]) {
            const pattern = args[nameIndex + 1].replace(/['"]/g, '');
            const searchPath = args[0] || this.currentPath;
            const results: string[] = [];

            const search = (node: FileSystemNode, path: string) => {
              if (node.name.includes(pattern) || pattern === '*') {
                results.push(path);
              }
              if (node.children) {
                node.children.forEach(child => {
                  const childPath = path === '/' ? `/${child.name}` : `${path}/${child.name}`;
                  search(child, childPath);
                });
              }
            };

            const startNode = this.findNode(searchPath);
            if (startNode) {
              search(startNode, this.resolvePath(searchPath));
            }

            output = results.join('\n') || `find: no files matching '${pattern}'`;
          } else {
            output = 'find: missing -name argument';
            return { command, output, timestamp, success: false };
          }
          break;
        }

        case 'awk': {
          output = 'awk command executed (simplified simulation)';
          break;
        }

        case 'echo':
          output = args.join(' ');
          break;

        case 'clear':
          output = '\x1Bc';
          break;

        case 'help':
          output = `Available commands:
  ls [-l] [-a] [path]  - List directory contents
  cd [path]            - Change directory
  pwd                  - Print working directory
  cat <file>           - Display file contents
  grep <pattern> <file>- Search for pattern in file
  chmod <mode> <file>  - Change file permissions
  find <path> -name <pattern> - Find files
  echo <text>          - Display text
  clear                - Clear terminal
  help                 - Show this help message`;
          break;

        default:
          output = `bash: ${cmd}: command not found`;
          return { command, output, timestamp, success: false };
      }

      return { command, output, timestamp, success: true };
    } catch (error) {
      return {
        command,
        output: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp,
        success: false,
      };
    }
  }

  getCurrentPath(): string {
    return this.currentPath;
  }
}
