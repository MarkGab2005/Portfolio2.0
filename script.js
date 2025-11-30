document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach(a=>{
// Small interactions: set current year and add smooth scrolling
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const target = this.getAttribute('href');
    if(target.length>1){
      e.preventDefault();
      const el = document.querySelector(target);
      if(el) el.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Project rendering + data import (JSON or CSV)
function renderProjects(projects){
  const grid = document.getElementById('project-grid');
  if(!grid) return;
  grid.innerHTML = '';
  if(!projects || !projects.length){
    grid.innerHTML = '<p style="color:var(--muted)">No projects found. Import a JSON/CSV or load the sample data.</p>';
    return;
  }
  projects.forEach(p=>{
    const art = document.createElement('article');
    art.className = 'project';
    const title = document.createElement('h4');
    title.textContent = p.title || p.name || 'Untitled Project';
    art.appendChild(title);
    if(p.image){
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.title || p.name || 'Project image';
      img.style.width = '100%';
      img.style.borderRadius = '6px';
      img.style.marginBottom = '0.5rem';
      art.appendChild(img);
    }
    const desc = document.createElement('p');
    desc.textContent = p.description || p.desc || '';
    art.appendChild(desc);
    if(p.link){
      const pLink = document.createElement('p');
      const a = document.createElement('a');
      a.href = p.link;
      a.textContent = 'View project';
      a.className = 'link';
      a.target = '_blank';
      pLink.appendChild(a);
      art.appendChild(pLink);
    }
    grid.appendChild(art);
  });
}

function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(Boolean);
  if(lines.length === 0) return [];
  const headers = lines[0].split(',').map(h=>h.trim());
  const rows = lines.slice(1).map(line=>{
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h,i)=>{ obj[h] = (cols[i]||'').trim(); });
    return obj;
  });
  return rows;
}

function handleFile(file){
  const status = document.getElementById('import-status');
  status.textContent = `Importing ${file.name}...`;
  const reader = new FileReader();
  reader.onload = function(e){
    const text = e.target.result;
    try{
      const data = JSON.parse(text);
      if(Array.isArray(data)){
        renderProjects(data);
        status.textContent = `Imported ${data.length} projects`;
        return;
      }
      // If object with projects key
      if(data.projects && Array.isArray(data.projects)){
        renderProjects(data.projects);
        status.textContent = `Imported ${data.projects.length} projects`;
        return;
      }
      // Fallback: try to wrap object into array
      renderProjects([data]);
      status.textContent = `Imported 1 project`;
    }catch(err){
      // try CSV
      try{
        const rows = parseCSV(text);
        renderProjects(rows);
        status.textContent = `Imported ${rows.length} rows from CSV`;
      }catch(e2){
        status.textContent = 'Failed to parse file';
      }
    }
  };
  reader.onerror = function(){ status.textContent = 'Failed to read file'; };
  reader.readAsText(file);
}

// Wire up file input, drag-drop, and sample load
const fileInput = document.getElementById('data-file');
if(fileInput){
  fileInput.addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0];
    if(f) handleFile(f);
  });
}

const dropZone = document.getElementById('drop-zone');
if(dropZone){
  ['dragenter','dragover'].forEach(ev=>dropZone.addEventListener(ev, e=>{ e.preventDefault(); dropZone.style.background = 'rgba(0,102,255,0.02)'; }));
  ['dragleave','drop'].forEach(ev=>dropZone.addEventListener(ev, e=>{ e.preventDefault(); dropZone.style.background = 'transparent'; }));
  dropZone.addEventListener('drop', e=>{
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if(f) handleFile(f);
  });
}

const loadSampleBtn = document.getElementById('load-sample');
if(loadSampleBtn){
  loadSampleBtn.addEventListener('click', ()=>{
    const status = document.getElementById('import-status');
    status.textContent = 'Loading sample data...';
    fetch('data/projects.json')
      .then(r=>{
        if(!r.ok) throw new Error('Fetch failed');
        return r.json();
      })
      .then(data=>{
        if(data.projects && Array.isArray(data.projects)) renderProjects(data.projects);
        else if(Array.isArray(data)) renderProjects(data);
        else renderProjects([data]);
        status.textContent = `Loaded sample data`;
      })
      .catch(err=>{ status.textContent = 'Could not load sample data (try serving site with a local server)'; });
  });
}
