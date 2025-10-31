import { Task } from '../types';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'List Files with Details',
    description: 'Use the ls command with appropriate flags to display all files in the current directory with detailed information including permissions, size, and timestamps.',
    expectedCommand: 'ls -la',
    hints: [
      'Use -l flag for long format',
      'Use -a flag to show hidden files',
    ],
  },
  {
    id: '2',
    title: 'Find Error Logs',
    description: 'Search for all lines containing "ERROR" in the /home/user/logs/error.log file. This will help identify critical issues in the system.',
    expectedCommand: 'grep ERROR /home/user/logs/error.log',
    hints: [
      'Use grep to search for patterns',
      'The log file is located in /home/user/logs/',
    ],
  },
  {
    id: '3',
    title: 'View Script Content',
    description: 'Display the contents of the backup.sh script located in the /home/user/scripts directory to review the backup procedure.',
    expectedCommand: 'cat /home/user/scripts/backup.sh',
    hints: [
      'Use cat to display file contents',
      'Full path is /home/user/scripts/backup.sh',
    ],
  },
  {
    id: '4',
    title: 'Make Script Executable',
    description: 'Change the permissions of deploy.sh in /home/user/scripts to make it executable by all users (755 permissions).',
    expectedCommand: 'chmod 755 /home/user/scripts/deploy.sh',
    hints: [
      'Use chmod to change permissions',
      '755 means rwxr-xr-x',
    ],
  },
  {
    id: '5',
    title: 'Find All Shell Scripts',
    description: 'Search for all files with the .sh extension starting from the /home/user directory and its subdirectories.',
    expectedCommand: 'find /home/user -name "*.sh"',
    hints: [
      'Use find command with -name flag',
      'Use wildcard * for pattern matching',
    ],
  },
  {
    id: '6',
    title: 'Navigate to Documents',
    description: 'Change your current working directory to /home/user/documents and verify your location.',
    expectedCommand: 'cd /home/user/documents',
    hints: [
      'Use cd to change directory',
      'Use pwd to verify your location',
    ],
  },
  {
    id: '7',
    title: 'Search Access Logs',
    description: 'Find all successful HTTP requests (status code 200) in the access.log file located in /home/user/logs.',
    expectedCommand: 'grep "200" /home/user/logs/access.log',
    hints: [
      'Look for lines containing "200"',
      'Use grep to search the log file',
    ],
  },
  {
    id: '8',
    title: 'Find TODO Items',
    description: 'Search for all TODO items in the notes.txt file in the documents directory.',
    expectedCommand: 'grep TODO /home/user/documents/notes.txt',
    hints: [
      'Search for the pattern "TODO"',
      'The file is in /home/user/documents/',
    ],
  },
];
