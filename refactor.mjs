import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  if (file.includes('api.ts') || file.includes('toast.ts')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace alert
  if (content.includes('alert(')) {
    content = content.replace(/alert\(/g, 'toast.info(');
    if (!content.includes('import { toast }')) {
      content = `import { toast } from '@/utils/toast';\n` + content;
    }
    changed = true;
  }

  // Replace fetch
  // Be careful not to replace apiFetch with apiapiFetch
  if (/\bfetch\(/g.test(content) && !content.includes('const fetchUser')) {
    content = content.replace(/\bfetch\(/g, 'apiFetch(');
    if (!content.includes('apiFetch')) {
      // It should include it now
    }
    if (!content.includes('import { apiFetch }') && !content.includes('import { API_BASE_URL, apiFetch }')) {
      if (content.includes('import { API_BASE_URL }')) {
        content = content.replace(/import \{ API_BASE_URL \} from ["'](.*)api["'];?/, 'import { API_BASE_URL, apiFetch } from "@/config/api";');
      } else {
        content = `import { apiFetch } from '@/config/api';\n` + content;
      }
    }
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
